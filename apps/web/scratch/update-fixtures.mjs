import fs from 'fs';

const filePath = './src/lib/curriculum/fixtures/canonical-curriculum-fixtures.ts';
const content = fs.readFileSync(filePath, 'utf8');

// Find where CANONICAL_QUESTIONS starts
const questionsIndex = content.indexOf('export const CANONICAL_QUESTIONS');
if (questionsIndex === -1) {
  throw new Error('Could not find export const CANONICAL_QUESTIONS');
}

const restOfFile = content.substring(questionsIndex);

const header = `import type {
  ChapterNode,
  TopicNode,
  CurriculumQuestion,
  CurriculumMaterial,
} from '@/lib/types/curriculum';
import { ALL_NCERT_CHAPTERS } from './ncert-chapters-data';
import { ALL_NCERT_TOPICS } from './ncert-topics-data';

export const CANONICAL_CHAPTERS: ChapterNode[] = ALL_NCERT_CHAPTERS;

export const CANONICAL_TOPICS: Record<string, TopicNode[]> = ALL_NCERT_TOPICS;

`;

fs.writeFileSync(filePath, header + restOfFile, 'utf8');
console.log('Successfully updated canonical-curriculum-fixtures.ts!');
