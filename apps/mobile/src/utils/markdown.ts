export type MarkdownBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; text: string; language?: string }
  | { type: 'math'; text: string }
  | { type: 'quote'; text: string };

const replacements: Array<[RegExp, string]> = [
  [/\\times/g, '×'],
  [/\\cdot/g, '·'],
  [/\\pm/g, '±'],
  [/\\leq/g, '≤'],
  [/\\geq/g, '≥'],
  [/\\neq/g, '≠'],
  [/\\rightarrow/g, '→'],
  [/\\infty/g, '∞'],
  [/\\alpha/g, 'α'],
  [/\\beta/g, 'β'],
  [/\\gamma/g, 'γ'],
  [/\\theta/g, 'θ'],
  [/\\pi/g, 'π'],
  [/\\Delta/g, 'Δ'],
  [/\\sqrt\{([^}]+)\}/g, '√($1)'],
  [/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)'],
  [/[_^]\{([^}]+)\}/g, '$1'],
];

export function latexToPlain(input: string): string {
  let text = input.trim();
  if (text.startsWith('$$') && text.endsWith('$$')) text = text.slice(2, -2);
  if (text.startsWith('$') && text.endsWith('$')) text = text.slice(1, -1);
  replacements.forEach(([pattern, value]) => {
    text = text.replace(pattern, value);
  });
  return text.replace(/[{}]/g, '').trim();
}

export function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index] ?? '';
    if (!line.trim()) {
      index += 1;
      continue;
    }
    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || undefined;
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? '').startsWith('```')) {
        code.push(lines[index] ?? '');
        index += 1;
      }
      index += 1;
      blocks.push({ type: 'code', text: code.join('\n'), language });
      continue;
    }
    if (line.trim().startsWith('$$')) {
      const math: string[] = [line.replace(/\$\$/g, '')];
      if (!line.trim().endsWith('$$') || line.trim() === '$$') {
        index += 1;
        while (index < lines.length && !(lines[index] ?? '').includes('$$')) {
          math.push(lines[index] ?? '');
          index += 1;
        }
        if (lines[index]?.includes('$$')) {
          math.push((lines[index] ?? '').replace(/\$\$/g, ''));
        }
      }
      index += 1;
      blocks.push({ type: 'math', text: latexToPlain(math.join('\n')) });
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1]?.length ?? 1, text: heading[2] ?? '' });
      index += 1;
      continue;
    }
    if (line.startsWith('> ')) {
      blocks.push({ type: 'quote', text: line.slice(2) });
      index += 1;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && (/^\s*[-*]\s+/.test(lines[index] ?? '') || /^\s*\d+\.\s+/.test(lines[index] ?? ''))) {
        items.push((lines[index] ?? '').replace(/^\s*(?:[-*]|\d+\.)\s+/, ''));
        index += 1;
      }
      blocks.push({ type: 'list', items });
      continue;
    }
    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && (lines[index] ?? '').trim() && !/^(#{1,3}\s|```|>\s|\$\$|\s*[-*]\s|\s*\d+\.\s)/.test(lines[index] ?? '')) {
      paragraph.push(lines[index] ?? '');
      index += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
  }
  return blocks;
}
