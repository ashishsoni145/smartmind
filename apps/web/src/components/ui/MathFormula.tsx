import React from 'react';
import styles from './MathFormula.module.css';

interface MathFormulaProps {
  formula: string;
  block?: boolean;
  className?: string;
}

// Map common LaTeX Greek symbols to Unicode
const GREEK_MAP: Record<string, string> = {
  alpha: 'α',
  beta: 'β',
  gamma: 'γ',
  delta: 'δ',
  Delta: 'Δ',
  epsilon: 'ε',
  varepsilon: 'ε',
  zeta: 'ζ',
  eta: 'η',
  theta: 'θ',
  Theta: 'Θ',
  iota: 'ι',
  kappa: 'κ',
  lambda: 'λ',
  Lambda: 'Λ',
  mu: 'μ',
  nu: 'ν',
  xi: 'ξ',
  pi: 'π',
  Pi: 'Π',
  rho: 'ρ',
  sigma: 'σ',
  Sigma: 'Σ',
  tau: 'τ',
  phi: 'φ',
  Phi: 'Φ',
  psi: 'ψ',
  omega: 'ω',
  Omega: 'Ω',
  eps: 'ε',
  infty: '∞',
  cdot: '·',
  times: '×',
  pm: '±',
  approx: '≈',
  le: '≤',
  ge: '≥',
  ne: '≠',
  to: '→',
  sum: '∑',
  int: '∫',
};

// Clean helper to extract balanced curly brace contents: \frac{a}{b} -> [a, b, restIndex]
function extractBraceGroup(str: string, startIndex: number): { content: string; nextIndex: number } | null {
  if (str[startIndex] !== '{') return null;
  let depth = 0;
  let content = '';
  for (let i = startIndex; i < str.length; i++) {
    const char = str[i];
    if (char === '{') {
      if (depth > 0) content += char;
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth === 0) {
        return { content, nextIndex: i + 1 };
      } else {
        content += char;
      }
    } else {
      content += char;
    }
  }
  return { content, nextIndex: str.length };
}

// Token parser converting LaTeX math formula string into formatted React Nodes
export function renderMathFormulaNodes(rawFormula: string): React.ReactNode[] {
  // Normalize whitespace and clean up escaped backslashes
  let formula = rawFormula.replace(/\\\\/g, '\\').trim();

  // If there's a \text{...}, preserve its text
  formula = formula.replace(/\\text\{([^}]+)\}/g, '$1');

  const nodes: React.ReactNode[] = [];
  let i = 0;
  let keyIdx = 0;

  while (i < formula.length) {
    // 1. Fractions: \frac{num}{den}
    if (formula.startsWith('\\frac', i)) {
      const brace1 = extractBraceGroup(formula, i + 5);
      if (brace1) {
        let denStart = brace1.nextIndex;
        while (denStart < formula.length && formula[denStart] === ' ') denStart++;
        const brace2 = extractBraceGroup(formula, denStart);
        if (brace2) {
          nodes.push(
            <span key={keyIdx++} className={styles.fraction}>
              <span className={styles.numerator}>{renderMathFormulaNodes(brace1.content)}</span>
              <span className={styles.denominator}>{renderMathFormulaNodes(brace2.content)}</span>
            </span>
          );
          i = brace2.nextIndex;
          continue;
        }
      }
    }

    // 2. Square root: \sqrt{content} or \sqrt[n]{content}
    if (formula.startsWith('\\sqrt', i)) {
      let contentIndex = i + 5;
      if (formula[contentIndex] === '[') {
        const closeBracket = formula.indexOf(']', contentIndex);
        if (closeBracket !== -1) contentIndex = closeBracket + 1;
      }
      while (contentIndex < formula.length && formula[contentIndex] === ' ') contentIndex++;
      const brace = extractBraceGroup(formula, contentIndex);
      if (brace) {
        nodes.push(
          <span key={keyIdx++} className={styles.sqrtWrapper}>
            <span className={styles.sqrtSymbol}>√</span>
            <span className={styles.sqrtContent}>{renderMathFormulaNodes(brace.content)}</span>
          </span>
        );
        i = brace.nextIndex;
        continue;
      }
    }

    // 3. Vectors: \vec{v}
    if (formula.startsWith('\\vec', i)) {
      const brace = extractBraceGroup(formula, i + 4);
      if (brace) {
        nodes.push(
          <span key={keyIdx++} className={styles.vectorWrapper}>
            <span className={styles.vectorArrow}>→</span>
            <span>{brace.content}</span>
          </span>
        );
        i = brace.nextIndex;
        continue;
      }
    }

    // 4. Unit vectors: \hat{n}
    if (formula.startsWith('\\hat', i)) {
      const brace = extractBraceGroup(formula, i + 4);
      if (brace) {
        nodes.push(
          <span key={keyIdx++} className={styles.vectorWrapper}>
            <span className={styles.hatSymbol}>^</span>
            <span>{brace.content}</span>
          </span>
        );
        i = brace.nextIndex;
        continue;
      }
    }

    // 5. Superscripts: ^2 or ^{2\theta}
    if (formula[i] === '^') {
      if (formula[i + 1] === '{') {
        const brace = extractBraceGroup(formula, i + 1);
        if (brace) {
          nodes.push(
            <sup key={keyIdx++} className={styles.sup}>
              {renderMathFormulaNodes(brace.content)}
            </sup>
          );
          i = brace.nextIndex;
          continue;
        }
      } else if (i + 1 < formula.length && formula[i + 1] !== ' ') {
        nodes.push(
          <sup key={keyIdx++} className={styles.sup}>
            {formula[i + 1]}
          </sup>
        );
        i += 2;
        continue;
      }
    }

    // 6. Subscripts: _0 or _{max}
    if (formula[i] === '_') {
      if (formula[i + 1] === '{') {
        const brace = extractBraceGroup(formula, i + 1);
        if (brace) {
          nodes.push(
            <sub key={keyIdx++} className={styles.sub}>
              {renderMathFormulaNodes(brace.content)}
            </sub>
          );
          i = brace.nextIndex;
          continue;
        }
      } else if (i + 1 < formula.length && formula[i + 1] !== ' ') {
        nodes.push(
          <sub key={keyIdx++} className={styles.sub}>
            {formula[i + 1]}
          </sub>
        );
        i += 2;
        continue;
      }
    }

    // 7. LaTeX Macros: \theta, \sin, \cos, \tan, etc.
    if (formula[i] === '\\') {
      const match = formula.slice(i + 1).match(/^[a-zA-Z]+/);
      if (match) {
        const macro = match[0];
        const macroLen = macro.length + 1;

        // Greek letters & symbols
        if (GREEK_MAP[macro]) {
          nodes.push(<span key={keyIdx++}>{GREEK_MAP[macro]}</span>);
          i += macroLen;
          continue;
        }

        // Functions: sin, cos, tan, ln, log, lim, etc.
        if (['sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'ln', 'log', 'exp', 'lim'].includes(macro)) {
          nodes.push(
            <span key={keyIdx++} className={styles.funcName}>
              {macro}
            </span>
          );
          i += macroLen;
          continue;
        }

        // Left/Right delimiters
        if (macro === 'left' || macro === 'right') {
          i += macroLen;
          continue;
        }

        // Quad spacing
        if (macro === 'quad' || macro === 'qquad') {
          nodes.push(<span key={keyIdx++}>&nbsp;&nbsp;</span>);
          i += macroLen;
          continue;
        }

        // Fallback: render macro name cleanly
        nodes.push(<span key={keyIdx++}>{macro}</span>);
        i += macroLen;
        continue;
      }
    }

    // 8. Math Operators
    const char = formula[i];
    if (['=', '+', '-', '<', '>', '*', '/'].includes(char)) {
      nodes.push(
        <span key={keyIdx++} className={styles.operator}>
          {char === '*' ? '·' : char}
        </span>
      );
      i++;
      continue;
    }

    // Regular characters & spaces
    nodes.push(char);
    i++;
  }

  return nodes;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ formula, block = false, className = '' }) => {
  const content = renderMathFormulaNodes(formula);

  if (block) {
    return (
      <div className={`${styles.mathDisplayBlock} ${className}`}>
        <div className={styles.mathContainer}>{content}</div>
      </div>
    );
  }

  return <span className={`${styles.mathContainer} ${className}`}>{content}</span>;
};

// Full interactive Formula Card with variables & descriptions
export interface FormulaCardProps {
  label: string;
  formula: string;
  description?: string;
  variables?: { symbol: string; meaning: string; unit?: string }[];
}

export const FormulaCard: React.FC<FormulaCardProps> = ({
  label,
  formula,
  description,
  variables,
}) => {
  return (
    <div className={styles.formulaCard}>
      <div className={styles.cardHeader}>
        <div className={styles.labelArea}>
          <div className={styles.label}>{label}</div>
          {description && <div className={styles.desc}>{description}</div>}
        </div>
      </div>

      <MathFormula formula={formula} block />

      {variables && variables.length > 0 && (
        <div className={styles.variablesGrid}>
          {variables.map((v, idx) => (
            <div key={idx} className={styles.variableItem}>
              <span className={styles.varSymbol}>{v.symbol}</span>
              <span className={styles.varMeaning}>{v.meaning}</span>
              {v.unit && <span className={styles.varUnit}>[{v.unit}]</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
