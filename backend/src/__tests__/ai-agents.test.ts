import { describe, it, expect } from 'vitest';
import { QuestionGenAgent } from '../ai/agents/question-gen.agent';
import { TestAnalysisAgent } from '../ai/agents/test-analysis.agent';
import { MistakeAnalysisAgent } from '../ai/agents/mistake-analysis.agent';
import { StudyMaterialAgent } from '../ai/agents/study-material.agent';

describe('Specialized Domain AI Agents (Phase 06 Part 04)', () => {
  it('QuestionGenAgent should generate validated structured questions', async () => {
    const result = await QuestionGenAgent.generate({
      topic: 'Circular Motion',
      subject: 'Physics',
      count: 1,
      difficulty: 'medium',
      examPattern: 'JEE',
    });

    expect(result).toBeDefined();
    expect(result.questions).toBeDefined();
    expect(result.questions.length).toBeGreaterThan(0);
    const q = result.questions[0];
    expect(q.text).toBeDefined();
    expect(q.explanation).toBeDefined();
    expect(q.correctAnswer).toBeDefined();
    expect(q.marks).toBeGreaterThan(0);
  });

  it('TestAnalysisAgent should generate holistic test attempt diagnostics', async () => {
    const result = await TestAnalysisAgent.analyze({
      attemptId: 'att-123',
      studentId: 'stud-123',
      testTitle: 'JEE Advanced Mechanics Test 1',
      totalQuestions: 25,
      correctAnswers: 20,
      incorrectAnswers: 3,
      unattempted: 2,
      timeSpentSeconds: 3200,
      targetDurationSeconds: 3600,
      topicBreakdowns: [{ topic: 'Rotational Motion', correct: 3, total: 5 }],
    });

    expect(result).toBeDefined();
    expect(result.overallScore).toBeDefined();
    expect(result.accuracyRate).toBeGreaterThan(0);
    expect(Array.isArray(result.keyStrengths)).toBe(true);
    expect(Array.isArray(result.criticalWeaknesses)).toBe(true);
    expect(result.actionPlan).toBeDefined();
  });

  it('MistakeAnalysisAgent should produce root cause diagnosis and remediation', async () => {
    const result = await MistakeAnalysisAgent.diagnose({
      questionText: 'A rod is pivoted at one end...',
      correctAnswer: 'Option B',
      studentAnswer: 'Option C',
      studentRationale: 'I conserved linear momentum about the center',
    });

    expect(result).toBeDefined();
    expect(['conceptual', 'calculation', 'comprehension', 'timing', 'shortcut']).toContain(result.mistakeType);
    expect(result.rootCause).toBeDefined();
    expect(result.pedagogicalDiagnosis).toBeDefined();
    expect(result.remedialAction).toBeDefined();
  });

  it('StudyMaterialAgent should extract structured formulas, definitions, and pitfalls', async () => {
    const result = await StudyMaterialAgent.process({
      text: 'Thermodynamics First Law: dQ = dU + dW. Where W is work done by gas. Common pitfall: sign convention.',
      sourceDocumentName: 'Thermodynamics Class Notes Ch 12.pdf',
      subject: 'Physics',
    });

    expect(result).toBeDefined();
    expect(result.extractedTopics.length).toBeGreaterThan(0);
    const topic = result.extractedTopics[0];
    expect(topic.title).toBeDefined();
    expect(Array.isArray(topic.keyFormulas)).toBe(true);
    expect(Array.isArray(topic.commonPitfalls)).toBe(true);
    expect(result.provenance).toBe('Thermodynamics Class Notes Ch 12.pdf');
  });
});
