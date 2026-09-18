import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { QuestionService } from '../modules/questions/question.service';

describe('PYQ Data Model, Deduplication & Pattern Analysis Suite', () => {
  const app = createApp();
  const testQuestionText = `Unique Test PYQ: An electron is accelerated through a potential difference V=${Date.now()} Volts. What is its de Broglie wavelength?`;

  it('Should ingest authentic PYQ with options and examination metadata', async () => {
    const result = await QuestionService.ingestQuestions([
      {
        subjectId: 'physics',
        targetExamId: 'jee_main',
        questionText: testQuestionText,
        questionType: 'single_choice',
        difficultyLevel: 'medium',
        marks: 4.0,
        explanation: 'Wavelength lambda = h / sqrt(2 m e V). For an electron, lambda = 1.227 / sqrt(V) nm.',
        hint: 'Use the de Broglie formula relating relativistic or non-relativistic kinetic energy to accelerating potential.',
        sourceExam: 'JEE Main',
        sourceYear: 2023,
        sourceSession: 'April Session 1',
        sourcePaperCode: 'JEE-MAIN-2023-APR-08',
        isPyq: true,
        isImportant: true,
        appearanceFrequency: 1,
        patternTags: ['repeated_concept', 'formula_direct', 'de_broglie'],
        options: [
          { optionKey: 'A', optionText: '1.227 / sqrt(V) nm', isCorrect: true },
          { optionKey: 'B', optionText: '0.286 / sqrt(V) nm', isCorrect: false },
          { optionKey: 'C', optionText: '0.101 / sqrt(V) nm', isCorrect: false },
          { optionKey: 'D', optionText: '12.27 / sqrt(V) nm', isCorrect: false },
        ],
      },
    ]);

    expect(result.createdCount).toBe(1);
    expect(result.deduplicatedCount).toBe(0);
  });

  it('Deduplication: re-ingesting duplicate PYQ should increment appearance frequency without duplicating rows', async () => {
    const result = await QuestionService.ingestQuestions([
      {
        subjectId: 'physics',
        targetExamId: 'jee_main',
        questionText: testQuestionText, // Same exact question!
        questionType: 'single_choice',
        difficultyLevel: 'medium',
        sourceExam: 'JEE Main',
        sourceYear: 2023,
        isPyq: true,
        isImportant: true,
      },
    ]);

    expect(result.createdCount).toBe(0);
    expect(result.deduplicatedCount).toBe(1);
    expect(result.results[0].status).toBe('deduplicated_updated');
  });

  it('GET /api/v1/questions/pyqs should filter PYQs by target exam', async () => {
    const res = await request(app).get('/api/v1/questions/pyqs?targetExamId=jee_main');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const pyqs = res.body.data;
    expect(pyqs.length).toBeGreaterThan(0);
    expect(pyqs.every((p: any) => p.is_pyq === true)).toBe(true);
  });

  it('GET /api/v1/questions/patterns should return exam frequency and difficulty distribution', async () => {
    const res = await request(app).get('/api/v1/questions/patterns?targetExamId=jee_main');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalPyqs).toBeGreaterThanOrEqual(1);
    expect(res.body.data.yearDistribution).toBeDefined();
    expect(res.body.data.difficultyDistribution).toBeDefined();
  });
});
