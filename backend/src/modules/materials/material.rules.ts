import { Flashcard, StudyFormulaItem, MaterialQuizQuestion } from '@sharpmind/types';

export interface DocumentChunk {
  chunkIndex: number;
  content: string;
  wordCount: number;
  citationTag: string;
}

export class MaterialRules {
  /**
   * Sanitizes input text, removing null bytes and non-printable control codes
   */
  static cleanDocumentText(rawText: string): string {
    if (!rawText) return '';
    return rawText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /**
   * Chunks text into sliding-window segments with semantic overlap
   */
  static chunkDocument(
    fullText: string,
    materialId: string = 'doc',
    targetChunkWords: number = 250,
    overlapWords: number = 30
  ): DocumentChunk[] {
    const cleaned = this.cleanDocumentText(fullText);
    if (!cleaned) return [];

    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return [];

    const chunks: DocumentChunk[] = [];
    let startIdx = 0;
    let chunkIndex = 0;

    while (startIdx < words.length) {
      const endIdx = Math.min(startIdx + targetChunkWords, words.length);
      const chunkWords = words.slice(startIdx, endIdx);
      const content = chunkWords.join(' ');

      chunks.push({
        chunkIndex,
        content,
        wordCount: chunkWords.length,
        citationTag: `DOC-${materialId.slice(0, 8)}-CHUNK-${chunkIndex + 1}`,
      });

      chunkIndex++;
      if (endIdx >= words.length) break;
      startIdx += targetChunkWords - overlapWords;
    }

    return chunks;
  }

  /**
   * Synthesizes flashcards and quiz questions from extracted formulas and concepts
   */
  static synthesizeFlashcards(
    formulas: StudyFormulaItem[],
    concepts: Array<{ name: string; definition: string }>
  ): Flashcard[] {
    const flashcards: Flashcard[] = [];

    // From formulas
    for (const f of formulas) {
      flashcards.push({
        id: `fc-${f.id || Math.random().toString(36).slice(2, 8)}`,
        front: `What is the mathematical formulation for ${f.name}?`,
        back: `${f.formulaLatex}\n\nBoundary Conditions: ${f.boundaryConditions || 'Standard ideal conditions'}`,
        topic: f.name,
        difficulty: 'medium',
      });
    }

    // From concepts
    for (const c of concepts) {
      flashcards.push({
        id: `fc-c-${Math.random().toString(36).slice(2, 8)}`,
        front: `Define and state the key principle of: ${c.name}`,
        back: c.definition,
        topic: c.name,
        difficulty: 'easy',
      });
    }

    return flashcards;
  }

  static generateRevisionDeck = MaterialRules.synthesizeFlashcards;

  /**
   * Synthesizes rapid check quiz questions from formulas and definitions
   */
  static synthesizeQuizQuestions(
    concepts: Array<{ name: string; definition: string }>,
    formulas: StudyFormulaItem[]
  ): MaterialQuizQuestion[] {
    const quiz: MaterialQuizQuestion[] = [];

    // Question from concept
    if (concepts.length > 0) {
      const c = concepts[0];
      quiz.push({
        id: `quiz-1`,
        text: `Which of the following statements best characterizes ${c.name}?`,
        type: 'mcq',
        options: [
          { id: 'opt_a', text: c.definition },
          { id: 'opt_b', text: `It represents the inverse or negative condition of ${c.name}.` },
          { id: 'opt_c', text: 'It only applies when external temperature is absolute zero.' },
          { id: 'opt_d', text: 'It has been completely superseded by non-relativistic classical approximations.' },
        ],
        correctAnswer: 'opt_a',
        explanation: `By definition: ${c.definition}`,
      });
    }

    // Question from formula
    if (formulas.length > 0) {
      const f = formulas[0];
      quiz.push({
        id: `quiz-2`,
        text: `In the formula for ${f.name}, what is the governing mathematical relationship?`,
        type: 'mcq',
        options: [
          { id: 'opt_a', text: f.formulaLatex },
          { id: 'opt_b', text: 'Zero under all reference frames' },
          { id: 'opt_c', text: 'Proportional strictly to the square root of universal gas constant' },
          { id: 'opt_d', text: 'Independent of physical dimensions' },
        ],
        correctAnswer: 'opt_a',
        explanation: `The standard equation is given by ${f.formulaLatex}.`,
      });
    }

    return quiz;
  }
}
