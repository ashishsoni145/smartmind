// =============================================================================
// Post-Test Intelligence — Behavioral & Error Diagnostics Engine
// =============================================================================

import type {
  Question,
  AssessmentAnswerItem,
  PostTestIntelligence,
} from '@sharpmind/types';

export interface PostTestAnalysisInput {
  answers: AssessmentAnswerItem[];
  questions: Question[];
  totalScore: number;
  maxScore: number;
  accuracyPercentage: number;
  timeTakenSeconds: number;
}

/**
 * Computes deep diagnostic insights on a completed test submission.
 * Identifies behavioral traps, conceptual blindspots, guessing, and pacing issues.
 */
export function analyzePostTestIntelligence(
  input: PostTestAnalysisInput
): PostTestIntelligence {
  const { answers, questions, totalScore, maxScore, accuracyPercentage, timeTakenSeconds } = input;

  const questionsMap = new Map<string, Question>();
  questions.forEach((q) => questionsMap.set(q.id, q));

  let totalAttempted = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalUnattempted = 0;

  let totalCorrectTime = 0;
  let totalIncorrectTime = 0;

  const easyMisses: PostTestIntelligence['easyQuestionMisses'] = [];
  const guessingDetected: PostTestIntelligence['guessingDetected'] = [];
  const timeManagementIssues: PostTestIntelligence['timeManagementIssues'] = [];
  const conceptErrorCountMap: Record<string, { title: string; count: number }> = {};
  const calculationErrors: PostTestIntelligence['calculationErrors'] = [];
  const weakTopicMarksLostMap: Record<string, { title: string; marksLost: number }> = {};

  const difficultyStats: Record<string, { attempted: number; correct: number }> = {
    easy: { attempted: 0, correct: 0 },
    medium: { attempted: 0, correct: 0 },
    hard: { attempted: 0, correct: 0 },
    olympiad: { attempted: 0, correct: 0 },
  };

  const questionTypeStats: Record<string, { attempted: number; correct: number }> = {};

  for (const ans of answers) {
    const q = questionsMap.get(ans.questionId);
    if (!q) continue;

    const isAttempted =
      (ans.selectedOptions && ans.selectedOptions.length > 0) ||
      (ans.numericalAnswer && ans.numericalAnswer.trim() !== '');

    const diff = q.difficultyLevel || 'medium';
    if (!difficultyStats[diff]) {
      difficultyStats[diff] = { attempted: 0, correct: 0 };
    }

    const qType = q.questionType || 'single_choice';
    if (!questionTypeStats[qType]) {
      questionTypeStats[qType] = { attempted: 0, correct: 0 };
    }

    if (!isAttempted) {
      totalUnattempted++;
      continue;
    }

    totalAttempted++;
    const timeSpent = ans.timeSpentSeconds || 0;
    difficultyStats[diff].attempted++;
    questionTypeStats[qType].attempted++;

    if (ans.isCorrect) {
      totalCorrect++;
      totalCorrectTime += timeSpent;
      difficultyStats[diff].correct++;
      questionTypeStats[qType].correct++;
    } else {
      totalIncorrect++;
      totalIncorrectTime += timeSpent;

      // 1. Easy Question Misses
      if (diff === 'easy') {
        easyMisses.push({
          questionId: q.id,
          topic: q.questionText.slice(0, 50) + '...',
          difficulty: 'easy',
          explanation: 'Careless reading or fundamental recall gap on high-confidence item.',
        });
      }

      // 2. Guessing Detection (< 20 seconds on medium/hard item followed by incorrect answer)
      if (timeSpent < 20 && (diff === 'medium' || diff === 'hard')) {
        guessingDetected.push({
          questionId: q.id,
          timeTakenSeconds: timeSpent,
          explanation: `Rushed response (${timeSpent}s) on ${diff} difficulty item. Likely guessing under pressure.`,
        });
      }

      // 3. Calculation Errors (for numerical question types)
      if (qType === 'numerical' && ans.numericalAnswer) {
        const studentNum = parseFloat(ans.numericalAnswer);
        const targetStr = q.options?.find((o) => o.isCorrect)?.optionText || q.explanation || '';
        const targetNum = parseFloat(targetStr);
        if (!isNaN(studentNum) && !isNaN(targetNum)) {
          const ratio = Math.abs(studentNum - targetNum) / Math.max(1, Math.abs(targetNum));
          if (ratio < 0.25) {
            calculationErrors.push({
              questionId: q.id,
              studentAnswer: ans.numericalAnswer,
              correctAnswer: targetStr,
            });
          }
        }
      }

      // 4. Conceptual Error aggregation
      if (q.conceptId) {
        if (!conceptErrorCountMap[q.conceptId]) {
          conceptErrorCountMap[q.conceptId] = {
            title: q.patternTags?.[0] || 'Prerequisite Concept',
            count: 0,
          };
        }
        conceptErrorCountMap[q.conceptId].count++;
      }

      // 5. Weak topic negative marks impact
      const topicKey = q.curriculumNodeId || 'general';
      if (!weakTopicMarksLostMap[topicKey]) {
        weakTopicMarksLostMap[topicKey] = {
          title: q.patternTags?.[0] || q.subjectId,
          marksLost: 0,
        };
      }
      weakTopicMarksLostMap[topicKey].marksLost += Math.abs(ans.marksAwarded || 1);
    }

    // 6. Time Management Bottlenecks (> 240 seconds on a single question)
    if (timeSpent > 240) {
      timeManagementIssues.push({
        sectionName: q.subjectId.toUpperCase(),
        issue: `Spent ${Math.round(timeSpent / 60)} minutes on question "${q.questionText.slice(0, 40)}...", causing pacing strain for remaining questions.`,
      });
    }
  }

  const avgTimePerQuestionSeconds =
    totalAttempted > 0 ? Math.round(timeTakenSeconds / totalAttempted) : 0;
  const avgTimeCorrectSeconds =
    totalCorrect > 0 ? Math.round(totalCorrectTime / totalCorrect) : 0;
  const avgTimeIncorrectSeconds =
    totalIncorrect > 0 ? Math.round(totalIncorrectTime / totalIncorrect) : 0;

  // Compile difficulty breakdown
  const difficultyPerformance: PostTestIntelligence['difficultyPerformance'] = {};
  for (const [lvl, stats] of Object.entries(difficultyStats)) {
    difficultyPerformance[lvl] = {
      attempted: stats.attempted,
      correct: stats.correct,
      accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0,
    };
  }

  // Compile question type breakdown
  const questionTypePerformance: PostTestIntelligence['questionTypePerformance'] = {};
  for (const [type, stats] of Object.entries(questionTypeStats)) {
    questionTypePerformance[type] = {
      attempted: stats.attempted,
      correct: stats.correct,
      accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0,
    };
  }

  // Weak topics sorted by marks lost descending
  const weakTopics = Object.entries(weakTopicMarksLostMap)
    .map(([nodeId, val]) => ({
      curriculumNodeId: nodeId,
      topicTitle: val.title,
      marksLost: val.marksLost,
    }))
    .sort((a, b) => b.marksLost - a.marksLost);

  // Conceptual errors
  const conceptualErrors = Object.entries(conceptErrorCountMap).map(([id, val]) => ({
    conceptId: id,
    conceptTitle: val.title,
    count: val.count,
  }));

  // Recommendations
  const recommendations: string[] = [];
  if (easyMisses.length > 0) {
    recommendations.push(
      `Watch out for careless reading: you dropped ${easyMisses.length} easy question(s). Re-read problem statements before selecting options.`
    );
  }
  if (guessingDetected.length > 0) {
    recommendations.push(
      `Eliminate impulse guessing: ${guessingDetected.length} question(s) answered in <20s were incorrect, costing negative marks.`
    );
  }
  if (timeManagementIssues.length > 0) {
    recommendations.push(
      `Set a strict 3-minute cap on difficult problems to avoid running out of time in the final sections.`
    );
  }
  if (calculationErrors.length > 0) {
    recommendations.push(
      `Perform double-check verification on arithmetic and units: ${calculationErrors.length} numerical question(s) were close to correct answers.`
    );
  }
  if (recommendations.length === 0) {
    recommendations.push('Strong performance across sections. Focus on speed drills for Olympiad and HOTS questions.');
  }

  return {
    accuracyPercentage,
    totalAttempted,
    totalCorrect,
    totalIncorrect,
    totalUnattempted,
    totalScore,
    maxScore,
    avgTimePerQuestionSeconds,
    avgTimeCorrectSeconds,
    avgTimeIncorrectSeconds,
    easyQuestionMisses: easyMisses,
    guessingDetected,
    timeManagementIssues,
    conceptualErrors,
    calculationErrors,
    weakTopics,
    difficultyPerformance,
    questionTypePerformance,
    recommendations,
  };
}
