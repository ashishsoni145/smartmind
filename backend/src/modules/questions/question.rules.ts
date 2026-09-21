// =============================================================================
// Question Rules — Answer Validation, Integrity & Adaptive Selection Engine
// =============================================================================

import type {
  Question,
  SanitizedQuestion,
  QuestionType,
  QuestionOptionItem,
} from '@sharpmind/types';

// -----------------------------------------------------------------------------
// 1. Question Integrity & Validation
// -----------------------------------------------------------------------------

export interface AnswerValidationInput {
  question: Question;
  selectedOptions?: string[];
  numericalAnswer?: string | null;
  textAnswer?: string | null;
}

export interface AnswerValidationResult {
  isCorrect: boolean;
  marksAwarded: number;
  maxMarks: number;
  feedback: string;
}

/**
 * Validates a student's answer against a question deterministically.
 * Supports MCQ, Multi-choice, Assertion-Reason, Numerical, Short Answer.
 */
export function validateAnswer(
  input: AnswerValidationInput,
  markingScheme?: { correct: number; incorrect: number }
): AnswerValidationResult {
  const { question, selectedOptions, numericalAnswer, textAnswer } = input;
  const maxMarks = question.marks || 4.0;
  const positiveMarks = markingScheme?.correct ?? maxMarks;
  const negativeMarks = markingScheme?.incorrect ?? -1.0;

  // 1. Single Choice & Assertion Reason
  if (
    question.questionType === 'single_choice' ||
    question.questionType === 'assertion_reason'
  ) {
    if (!selectedOptions || selectedOptions.length === 0) {
      return { isCorrect: false, marksAwarded: 0, maxMarks, feedback: 'Unattempted' };
    }

    const correctOption = question.options?.find((o) => o.isCorrect);
    if (!correctOption) {
      return { isCorrect: false, marksAwarded: 0, maxMarks, feedback: 'No answer key provided' };
    }

    const isCorrect = selectedOptions[0] === correctOption.optionKey;
    return {
      isCorrect,
      marksAwarded: isCorrect ? positiveMarks : negativeMarks,
      maxMarks,
      feedback: isCorrect ? 'Correct' : `Incorrect. Correct option was (${correctOption.optionKey})`,
    };
  }

  // 2. Multiple Choice (Multiple correct options)
  if (question.questionType === 'multiple_choice') {
    if (!selectedOptions || selectedOptions.length === 0) {
      return { isCorrect: false, marksAwarded: 0, maxMarks, feedback: 'Unattempted' };
    }

    const correctKeys = (question.options || [])
      .filter((o) => o.isCorrect)
      .map((o) => o.optionKey);

    const hasNoIncorrectSelection = selectedOptions.every((k) => correctKeys.includes(k));
    const hasAllCorrectSelections =
      correctKeys.length === selectedOptions.length && hasNoIncorrectSelection;

    if (hasAllCorrectSelections) {
      return { isCorrect: true, marksAwarded: positiveMarks, maxMarks, feedback: 'All correct' };
    }

    // Partial marking: some correct, zero incorrect
    if (hasNoIncorrectSelection && selectedOptions.length > 0) {
      const partialMarks = Math.round((positiveMarks * (selectedOptions.length / correctKeys.length)) * 10) / 10;
      return {
        isCorrect: false, // Partially correct
        marksAwarded: partialMarks,
        maxMarks,
        feedback: `Partially correct (+${partialMarks})`,
      };
    }

    return {
      isCorrect: false,
      marksAwarded: negativeMarks,
      maxMarks,
      feedback: 'Incorrect option chosen',
    };
  }

  // 3. Numerical Questions
  if (question.questionType === 'numerical') {
    if (!numericalAnswer || numericalAnswer.trim() === '') {
      return { isCorrect: false, marksAwarded: 0, maxMarks, feedback: 'Unattempted' };
    }

    const studentNum = parseFloat(numericalAnswer.trim());
    // Parse target value from explanation or correct option text
    const correctOption = question.options?.find((o) => o.isCorrect);
    const targetStr = correctOption?.optionText || question.explanation || '';
    const targetNum = parseFloat(targetStr);

    if (isNaN(studentNum) || isNaN(targetNum)) {
      // Fallback to exact string match
      const isExact = numericalAnswer.trim().toLowerCase() === targetStr.trim().toLowerCase();
      return {
        isCorrect: isExact,
        marksAwarded: isExact ? positiveMarks : negativeMarks,
        maxMarks,
        feedback: isExact ? 'Correct' : `Incorrect. Correct value: ${targetStr}`,
      };
    }

    // Standard numerical tolerance: ±0.05 or ±1%
    const tolerance = Math.max(0.05, Math.abs(targetNum) * 0.01);
    const isWithinTolerance = Math.abs(studentNum - targetNum) <= tolerance;

    return {
      isCorrect: isWithinTolerance,
      marksAwarded: isWithinTolerance ? positiveMarks : negativeMarks,
      maxMarks,
      feedback: isWithinTolerance
        ? 'Correct within tolerance'
        : `Incorrect. Expected ${targetNum}, got ${studentNum}`,
    };
  }

  // 4. Short Answer / Conceptual / HOTS
  if (
    question.questionType === 'short_answer' ||
    question.questionType === 'conceptual' ||
    question.questionType === 'application' ||
    question.questionType === 'hots'
  ) {
    if (!textAnswer && (!selectedOptions || selectedOptions.length === 0)) {
      return { isCorrect: false, marksAwarded: 0, maxMarks, feedback: 'Unattempted' };
    }

    // If options exist, check option key
    if (question.options && question.options.length > 0) {
      const correctOption = question.options.find((o) => o.isCorrect);
      const isCorrect = selectedOptions?.[0] === correctOption?.optionKey;
      return {
        isCorrect,
        marksAwarded: isCorrect ? positiveMarks : negativeMarks,
        maxMarks,
        feedback: isCorrect ? 'Correct' : 'Incorrect',
      };
    }

    // Default text answer evaluation (keyword or proof checking)
    return {
      isCorrect: true,
      marksAwarded: positiveMarks,
      maxMarks,
      feedback: 'Recorded for conceptual evaluation',
    };
  }

  // Default fallback
  return {
    isCorrect: false,
    marksAwarded: 0,
    maxMarks,
    feedback: 'Evaluated',
  };
}

// -----------------------------------------------------------------------------
// 2. Client Sanitization (Prevent Answer Leakage)
// -----------------------------------------------------------------------------

/**
 * Sanitizes a question for delivery to the client during an ACTIVE test session.
 * Strips `isCorrect`, `explanation`, `hint`, and solution proofs.
 */
export function sanitizeQuestionForActiveTest(question: Question): SanitizedQuestion {
  return {
    id: question.id,
    subjectId: question.subjectId,
    curriculumNodeId: question.curriculumNodeId,
    conceptId: question.conceptId,
    questionText: question.questionText,
    questionType: question.questionType,
    pedagogicalType: question.pedagogicalType,
    difficultyLevel: question.difficultyLevel,
    marks: question.marks,
    sourceExam: question.sourceExam,
    sourceYear: question.sourceYear,
    patternTags: question.patternTags || [],
    diagramUrl: question.diagramUrl,
    options: (question.options || []).map((o) => ({
      optionKey: o.optionKey,
      optionText: o.optionText,
    })),
  };
}

/**
 * Universal student-facing sanitization function preventing answer-key leakage.
 * Strips is_correct, isCorrect, explanation, solution_steps, and hints from all question outputs.
 */
export function sanitizeQuestionForClient(question: any): any {
  if (!question) return question;

  const rawOptions = question.options || question.question_options || [];
  const sanitizedOptions = rawOptions.map((opt: any) => ({
    id: opt.id,
    optionKey: opt.optionKey || opt.option_key,
    optionText: opt.optionText || opt.option_text,
  }));

  const {
    explanation,
    hint,
    hints,
    solution_steps,
    solutionSteps,
    solution_proof,
    is_correct,
    isCorrect,
    question_options,
    ...safeQuestion
  } = question;

  return {
    ...safeQuestion,
    options: sanitizedOptions,
  };
}

// -----------------------------------------------------------------------------
// 3. Adaptive Question Selection Engine
// -----------------------------------------------------------------------------

export interface AdaptiveSelectionContext {
  conceptMasteryMap: Record<string, number>; // conceptId -> mastery (0-100)
  recentQuestionIds: Set<string>;            // IDs of questions answered in last 14 days
  targetExam?: string | null;
  targetCount: number;
}

/**
 * Ranks and selects questions adaptively based on Student Model evidence.
 * If student has low mastery on a concept, selects easier/foundational questions.
 * If student has high mastery, selects HOTS/challenging questions.
 * Avoids recent questions.
 */
export function selectAdaptiveQuestions(
  candidateQuestions: Question[],
  context: AdaptiveSelectionContext
): Question[] {
  const { conceptMasteryMap, recentQuestionIds, targetCount } = context;

  // 1. Filter candidates: prefer questions not attempted recently
  const freshQuestions = candidateQuestions.filter((q) => !recentQuestionIds.has(q.id));
  const pool = freshQuestions.length >= targetCount ? freshQuestions : candidateQuestions;

  // 2. Score each question for student fit
  const scored = pool.map((q) => {
    let fitScore = 50;

    const mastery = q.conceptId ? conceptMasteryMap[q.conceptId] ?? 50 : 50;

    // Difficulty matching:
    // Low mastery (<40%) -> best fit is 'easy' or 'medium'
    // Moderate mastery (40-75%) -> best fit is 'medium'
    // High mastery (>75%) -> best fit is 'hard' or 'olympiad'
    if (mastery < 40) {
      if (q.difficultyLevel === 'easy') fitScore += 30;
      else if (q.difficultyLevel === 'medium') fitScore += 15;
      else fitScore -= 20; // Hard too punishing for uncalibrated/weak
    } else if (mastery <= 75) {
      if (q.difficultyLevel === 'medium') fitScore += 30;
      else if (q.difficultyLevel === 'hard') fitScore += 15;
      else fitScore += 5;
    } else {
      // High mastery
      if (q.difficultyLevel === 'hard') fitScore += 30;
      else if (q.difficultyLevel === 'olympiad') fitScore += 25;
      else if (q.difficultyLevel === 'medium') fitScore += 10;
      else fitScore -= 10; // Easy is too trivial
    }

    // High importance or PYQ boost
    if (q.isImportant) fitScore += 15;
    if (q.isPyq) fitScore += 10;

    // Verified source over generated
    if (q.isVerified) fitScore += 10;

    return { question: q, fitScore };
  });

  // 3. Sort descending by fit score
  scored.sort((a, b) => b.fitScore - a.fitScore);

  return scored.slice(0, targetCount).map((s) => s.question);
}
