'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { curriculumAdapter } from '@/lib/adapters/curriculum';
import { studentProfileAdapter } from '@/lib/adapters/student';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Board, Grade, Subject, TargetExam } from '@/lib/types/curriculum';
import type {
  LearningStyle,
  PreparationLevel,
  StudentProfile,
  StudyTimeOfDay,
  TargetExamGoal,
} from '@/lib/types/onboarding';
import styles from './page.module.css';

const STEP_TITLES = [
  'Academic Identity',
  'Subjects & Target Exams',
  'Preparation Baseline',
  'Study Habits & Schedule',
  'Review & Activation',
];

function OnboardingWizard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || 'demo_student';

  // Catalog state from CurriculumAdapter
  const [boards, setBoards] = useState<Board[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [targetExamsList, setTargetExamsList] = useState<TargetExam[]>([]);
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);

  // Wizard State
  const [step, setStep] = useState(1);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedExamGoals, setSelectedExamGoals] = useState<TargetExamGoal[]>([]);

  const [preparationLevel, setPreparationLevel] = useState<PreparationLevel>('moderate');
  const [strengthSubjects, setStrengthSubjects] = useState<string[]>([]);
  const [focusSubjects, setFocusSubjects] = useState<string[]>([]);

  const [dailyHours, setDailyHours] = useState<number>(4);
  const [preferredStudyTime, setPreferredStudyTime] = useState<StudyTimeOfDay>('evening');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('problem_solving_first');

  // Load curriculum taxonomy
  useEffect(() => {
    async function loadCatalog() {
      const [b, g, s, e, y] = await Promise.all([
        curriculumAdapter.getBoards(),
        curriculumAdapter.getGrades(),
        curriculumAdapter.getSubjects(),
        curriculumAdapter.getTargetExams(),
        curriculumAdapter.getAcademicYears(),
      ]);

      setBoards(b);
      setGrades(g);
      setSubjects(s);
      setTargetExamsList(e);
      setAcademicYears(y);

      // Default selections if unpopulated
      if (!selectedGrade && g.length > 1) setSelectedGrade(g[1].id); // Class 12
      if (!selectedBoard && b.length > 0) setSelectedBoard(b[0].id); // CBSE
      if (!selectedYear && y.length > 0) setSelectedYear(y[0]);

      setCatalogLoaded(true);
    }
    loadCatalog();
  }, []);

  // Resume / Re-entry: Load saved draft or profile on mount
  useEffect(() => {
    async function restoreDraft() {
      const saved = await studentProfileAdapter.getDraft(userId);
      if (saved && saved.draft) {
        const d = saved.draft;
        if (d.fullName) setFullName(d.fullName);
        if (d.academicProfile?.grade) setSelectedGrade(d.academicProfile.grade);
        if (d.academicProfile?.board) setSelectedBoard(d.academicProfile.board);
        if (d.academicProfile?.academicYear) setSelectedYear(d.academicProfile.academicYear);
        if (d.academicProfile?.enrolledSubjects) setSelectedSubjects(d.academicProfile.enrolledSubjects);
        if (d.targetExams) setSelectedExamGoals(d.targetExams);
        if (d.readinessBaseline?.currentPreparationLevel) {
          setPreparationLevel(d.readinessBaseline.currentPreparationLevel);
        }
        if (d.readinessBaseline?.selfAssessedStrengths) {
          setStrengthSubjects(d.readinessBaseline.selfAssessedStrengths);
        }
        if (d.readinessBaseline?.selfAssessedFocusAreas) {
          setFocusSubjects(d.readinessBaseline.selfAssessedFocusAreas);
        }
        if (d.studyPreferences?.dailyAvailableHours) {
          setDailyHours(d.studyPreferences.dailyAvailableHours);
        }
        if (d.studyPreferences?.preferredStudyTime) {
          setPreferredStudyTime(d.studyPreferences.preferredStudyTime);
        }
        if (d.studyPreferences?.learningStylePreference) {
          setLearningStyle(d.studyPreferences.learningStylePreference);
        }

        if (saved.step) {
          setStep(saved.step);
        }
        setDraftSavedTime('Restored from previous session');
      }
    }

    if (userId) {
      restoreDraft();
    }
  }, [userId]);

  // Save draft helper
  const saveCurrentDraft = async (nextStep: number) => {
    const draft: Partial<StudentProfile> = {
      fullName,
      academicProfile: {
        grade: selectedGrade,
        board: selectedBoard,
        academicYear: selectedYear,
        enrolledSubjects: selectedSubjects,
      },
      targetExams: selectedExamGoals,
      readinessBaseline: {
        currentPreparationLevel: preparationLevel,
        selfAssessedStrengths: strengthSubjects,
        selfAssessedFocusAreas: focusSubjects,
      },
      studyPreferences: {
        dailyAvailableHours: dailyHours,
        preferredStudyTime,
        learningStylePreference: learningStyle,
        reminderPreferences: { email: true, dailyGoalPrompt: true },
      },
    };

    await studentProfileAdapter.saveDraft(userId, draft, nextStep);
    setDraftSavedTime('Draft saved');
  };

  // Toggle subject selection
  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  };

  // Toggle target exam selection
  const toggleExam = (exam: TargetExam) => {
    setSelectedExamGoals((prev) => {
      const exists = prev.some((g) => g.examId === exam.id);
      if (exists) {
        return prev.filter((g) => g.examId !== exam.id);
      } else {
        return [
          ...prev,
          {
            examId: exam.id,
            examName: exam.name,
            targetYear: 2027,
            targetScoreOrRank: '',
            expectedExamDate: exam.typicalMonths[0] || 'May',
          },
        ];
      }
    });
  };

  const updateExamGoal = (examId: string, updates: Partial<TargetExamGoal>) => {
    setSelectedExamGoals((prev) =>
      prev.map((g) => (g.examId === examId ? { ...g, ...updates } : g))
    );
  };

  // Validation per step
  const validateStep = (currentStep: number): boolean => {
    setValidationError(null);

    if (currentStep === 1) {
      if (!fullName.trim()) {
        setValidationError('Please enter your full name.');
        return false;
      }
      if (!selectedGrade) {
        setValidationError('Please select your grade or class.');
        return false;
      }
      if (!selectedBoard) {
        setValidationError('Please select your examination board.');
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (selectedSubjects.length === 0) {
        setValidationError('Please select at least one subject.');
        return false;
      }
      if (selectedExamGoals.length === 0) {
        setValidationError('Please select at least one target exam.');
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (!preparationLevel) {
        setValidationError('Please select your current preparation level.');
        return false;
      }
      return true;
    }

    if (currentStep === 4) {
      if (!dailyHours || dailyHours <= 0) {
        setValidationError('Please specify your daily study hours.');
        return false;
      }
      if (!preferredStudyTime) {
        setValidationError('Please select your preferred study time of day.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;

    const nextStep = step + 1;
    await saveCurrentDraft(nextStep);
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setValidationError(null);
    if (step > 1) {
      const prevStep = step - 1;
      setStep(prevStep);
      saveCurrentDraft(prevStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    const completeProfile: StudentProfile = {
      id: `profile-${Date.now()}`,
      userId,
      fullName: fullName.trim(),
      academicProfile: {
        grade: selectedGrade,
        board: selectedBoard,
        academicYear: selectedYear,
        enrolledSubjects: selectedSubjects,
      },
      targetExams: selectedExamGoals,
      readinessBaseline: {
        currentPreparationLevel: preparationLevel,
        selfAssessedStrengths: strengthSubjects,
        selfAssessedFocusAreas: focusSubjects,
      },
      studyPreferences: {
        dailyAvailableHours: dailyHours,
        preferredStudyTime,
        learningStylePreference: learningStyle,
        reminderPreferences: { email: true, dailyGoalPrompt: true },
      },
      onboardingStatus: {
        currentStep: 5,
        isCompleted: true,
        completedAt: new Date().toISOString(),
        nextAction: 'take_diagnostic',
      },
      knowledgeModelAttachment: {
        status: 'pending_initial_diagnostic',
        lastCalibratedAt: undefined,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await studentProfileAdapter.completeOnboarding(userId, completeProfile);
    setIsSubmitting(false);
    router.push('/app');
  };

  if (!catalogLoaded) {
    return <div className={styles.card}>Loading academic curriculum catalog...</div>;
  }

  const selectedBoardObj = boards.find((b) => b.id === selectedBoard);
  const selectedGradeObj = grades.find((g) => g.id === selectedGrade);

  return (
    <div className={styles.container}>
      {/* Progress Bar & Steps Tracker */}
      <nav className={styles.progressSection} aria-label="Onboarding progress">
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${(step / STEP_TITLES.length) * 100}%` }}
          />
        </div>
        <ol className={styles.stepsIndicator}>
          {STEP_TITLES.map((title, index) => {
            const stepNum = index + 1;
            const isDone = stepNum < step;
            const isCurrent = stepNum === step;
            return (
              <li
                key={title}
                className={`${styles.stepNode} ${isCurrent ? styles.stepActive : ''} ${
                  isDone ? styles.stepCompleted : ''
                }`}
              >
                <span className={styles.stepCircle}>{isDone ? '✓' : stepNum}</span>
                <span className={styles.stepLabel}>{title}</span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Main Wizard Card */}
      <div className={styles.card}>
        <header className={styles.stepHeader}>
          <div className={styles.stepBadge}>Step {step} of 5</div>
          <h1 className={styles.stepTitle}>{STEP_TITLES[step - 1]}</h1>
          <p className={styles.stepSubtitle}>
            {step === 1 && 'Define your current academic affiliation and grade level.'}
            {step === 2 && 'Select your active subjects and target competitive or board examinations.'}
            {step === 3 && 'Calibrate your initial readiness baseline so the AI can tailor practice intensity.'}
            {step === 4 && 'Tell us your study routines so SharpMind can schedule daily revision windows.'}
            {step === 5 && 'Review your profile and initialize your continuous Student Knowledge Model.'}
          </p>
        </header>

        {validationError && (
          <div className={styles.errorAlert} role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* STEP 1: ACADEMIC IDENTITY */}
        {step === 1 && (
          <div className={styles.formGrid}>
            <Input
              label="Full Name"
              type="text"
              id="student-fullname"
              placeholder="e.g. Aarav Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Current Class / Grade</label>
              <div className={`${styles.optionsGrid} ${styles.optionsGrid3}`}>
                {grades.map((grade) => (
                  <button
                    key={grade.id}
                    type="button"
                    className={`${styles.optionCard} ${
                      selectedGrade === grade.id ? styles.optionCardActive : ''
                    }`}
                    onClick={() => setSelectedGrade(grade.id)}
                  >
                    <div className={styles.optionTitle}>{grade.name}</div>
                    <div className={styles.optionDesc}>Target {grade.code}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Board / Curriculum</label>
              <div className={`${styles.optionsGrid} ${styles.optionsGrid2}`}>
                {boards.map((board) => (
                  <button
                    key={board.id}
                    type="button"
                    className={`${styles.optionCard} ${
                      selectedBoard === board.id ? styles.optionCardActive : ''
                    }`}
                    onClick={() => setSelectedBoard(board.id)}
                  >
                    <div className={styles.optionTitle}>{board.code}</div>
                    <div className={styles.optionDesc}>{board.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Academic Year</label>
              <select
                className="input"
                style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: 'var(--text-sm)',
                }}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {academicYears.map((year) => (
                  <option key={year} value={year}>
                    {year} Academic Session
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: SUBJECTS & TARGET EXAMS */}
        {step === 2 && (
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Enrolled Subjects (Select all that apply)</label>
              <p className={styles.fieldHint}>
                SharpMind models knowledge and mistake patterns separately per subject.
              </p>
              <div className={styles.chipsContainer}>
                {subjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub.id);
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      className={`${styles.chip} ${isSelected ? styles.chipActive : ''}`}
                      onClick={() => toggleSubject(sub.id)}
                    >
                      <span aria-hidden="true">{sub.icon}</span>
                      <span>{sub.name}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Target Examination(s)</label>
              <p className={styles.fieldHint}>
                Select the exams you are preparing for to align syllabus weightages.
              </p>
              <div className={styles.chipsContainer}>
                {targetExamsList.map((exam) => {
                  const isSelected = selectedExamGoals.some((g) => g.examId === exam.id);
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      className={`${styles.chip} ${isSelected ? styles.chipActive : ''}`}
                      onClick={() => toggleExam(exam)}
                    >
                      <span>🎯</span>
                      <span>{exam.name}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Goals Inputs for Selected Exams */}
            {selectedExamGoals.length > 0 && (
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Exam Goals & Timeline</label>
                <div className={styles.examList}>
                  {selectedExamGoals.map((goal) => {
                    const examMeta = targetExamsList.find((e) => e.id === goal.examId);
                    return (
                      <div key={goal.examId} className={styles.examItem}>
                        <div className={styles.examItemHeader}>
                          <span style={{ fontWeight: 600, color: 'var(--color-primary-light)' }}>
                            {goal.examName}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                            Typical window: {examMeta?.typicalMonths.join(', ')}
                          </span>
                        </div>
                        <div className={styles.examInputs}>
                          <Input
                            label="Target Score / Rank Goal"
                            type="text"
                            placeholder={examMeta?.scorePlaceholder || 'Target score'}
                            value={goal.targetScoreOrRank || ''}
                            onChange={(e) =>
                              updateExamGoal(goal.examId, { targetScoreOrRank: e.target.value })
                            }
                          />
                          <Input
                            label="Target Year"
                            type="number"
                            value={goal.targetYear.toString()}
                            onChange={(e) =>
                              updateExamGoal(goal.examId, {
                                targetYear: parseInt(e.target.value) || 2027,
                              })
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: PREPARATION BASELINE */}
        {step === 3 && (
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Current Preparation Level</label>
              <p className={styles.fieldHint}>
                Helps the adaptive engine calibrate diagnostic question difficulty.
              </p>
              <div className={styles.optionsGrid}>
                <button
                  type="button"
                  className={`${styles.optionCard} ${
                    preparationLevel === 'beginner' ? styles.optionCardActive : ''
                  }`}
                  onClick={() => setPreparationLevel('beginner')}
                >
                  <div className={styles.optionTitle}>🌱 Beginner / Starting Out</div>
                  <div className={styles.optionDesc}>
                    Focusing on core theory, textbook fundamentals, and initial concept building.
                  </div>
                </button>

                <button
                  type="button"
                  className={`${styles.optionCard} ${
                    preparationLevel === 'moderate' ? styles.optionCardActive : ''
                  }`}
                  onClick={() => setPreparationLevel('moderate')}
                >
                  <div className={styles.optionTitle}>⚖️ Moderate / Consistent Study</div>
                  <div className={styles.optionDesc}>
                    Familiar with concepts, solving standard problems, aiming for speed and consistency.
                  </div>
                </button>

                <button
                  type="button"
                  className={`${styles.optionCard} ${
                    preparationLevel === 'advanced' ? styles.optionCardActive : ''
                  }`}
                  onClick={() => setPreparationLevel('advanced')}
                >
                  <div className={styles.optionTitle}>🚀 Advanced / High Mastery</div>
                  <div className={styles.optionDesc}>
                    Strong grasp on syllabus, tackling multi-concept problems and mock tests.
                  </div>
                </button>

                <button
                  type="button"
                  className={`${styles.optionCard} ${
                    preparationLevel === 'exam_revision' ? styles.optionCardActive : ''
                  }`}
                  onClick={() => setPreparationLevel('exam_revision')}
                >
                  <div className={styles.optionTitle}>🎯 Intensive Exam Revision</div>
                  <div className={styles.optionDesc}>
                    Full syllabus completed, focusing on PYQs, mistake analysis, and exam simulation.
                  </div>
                </button>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Priority Focus Subject(s)</label>
              <p className={styles.fieldHint}>Which subject needs the most attention right now?</p>
              <div className={styles.chipsContainer}>
                {subjects
                  .filter((s) => selectedSubjects.includes(s.id))
                  .map((sub) => {
                    const isFocus = focusSubjects.includes(sub.id);
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        className={`${styles.chip} ${isFocus ? styles.chipActive : ''}`}
                        onClick={() =>
                          setFocusSubjects((prev) =>
                            prev.includes(sub.id)
                              ? prev.filter((id) => id !== sub.id)
                              : [...prev, sub.id]
                          )
                        }
                      >
                        <span>{sub.icon}</span>
                        <span>{sub.name}</span>
                        {isFocus && <span>(Priority)</span>}
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: STUDY HABITS & SCHEDULE */}
        {step === 4 && (
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>
                Daily Self-Study Capacity: {dailyHours} Hours
              </label>
              <p className={styles.fieldHint}>Excludes school and coaching hours.</p>
              <div className={`${styles.optionsGrid} ${styles.optionsGrid3}`}>
                {[2, 4, 6, 8].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    className={`${styles.optionCard} ${
                      dailyHours === hours ? styles.optionCardActive : ''
                    }`}
                    onClick={() => setDailyHours(hours)}
                  >
                    <div className={styles.optionTitle}>{hours} Hours / day</div>
                    <div className={styles.optionDesc}>
                      {hours <= 2 && 'Steady pace'}
                      {hours === 4 && 'Balanced target'}
                      {hours === 6 && 'Rigorous prep'}
                      {hours >= 8 && 'Full-time study'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Preferred Peak Study Time</label>
              <div className={`${styles.optionsGrid} ${styles.optionsGrid2}`}>
                {[
                  { id: 'early_morning', label: '🌅 Early Morning (5 AM - 8 AM)' },
                  { id: 'morning', label: '☀️ Morning (8 AM - 12 PM)' },
                  { id: 'afternoon', label: '🌤️ Afternoon (12 PM - 5 PM)' },
                  { id: 'evening', label: '🌆 Evening (5 PM - 9 PM)' },
                  { id: 'night', label: '🌙 Night (9 PM - 1 AM)' },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    className={`${styles.optionCard} ${
                      preferredStudyTime === slot.id ? styles.optionCardActive : ''
                    }`}
                    onClick={() => setPreferredStudyTime(slot.id as StudyTimeOfDay)}
                  >
                    <div className={styles.optionTitle}>{slot.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Preferred AI Guidance Style</label>
              <div className={styles.optionsGrid}>
                {[
                  {
                    id: 'problem_solving_first',
                    title: 'Problem-Solving First',
                    desc: 'Jump straight into questions and learn theories through practical application.',
                  },
                  {
                    id: 'theory_first',
                    title: 'Theory & Derivations First',
                    desc: 'Read structured conceptual summaries before answering practice problems.',
                  },
                  {
                    id: 'socratic_tutor',
                    title: 'Socratic Guiding Questions',
                    desc: 'Tutor provides progressive hints and counter-questions without spoiling the answer.',
                  },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    className={`${styles.optionCard} ${
                      learningStyle === style.id ? styles.optionCardActive : ''
                    }`}
                    onClick={() => setLearningStyle(style.id as LearningStyle)}
                  >
                    <div className={styles.optionTitle}>{style.title}</div>
                    <div className={styles.optionDesc}>{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & ACTIVATION */}
        {step === 5 && (
          <div className={styles.summaryContainer}>
            <div className={styles.summarySection}>
              <div className={styles.summaryHeader}>
                <span className={styles.summaryTitle}>Student Identity</span>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', cursor: 'pointer' }}
                  onClick={() => setStep(1)}
                >
                  Edit
                </button>
              </div>
              <div className={styles.summaryContent}>
                <strong>{fullName}</strong> &bull; {selectedGradeObj?.name} &bull;{' '}
                {selectedBoardObj?.code} ({selectedYear})
              </div>
            </div>

            <div className={styles.summarySection}>
              <div className={styles.summaryHeader}>
                <span className={styles.summaryTitle}>Curriculum & Exams</span>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', cursor: 'pointer' }}
                  onClick={() => setStep(2)}
                >
                  Edit
                </button>
              </div>
              <div className={styles.summaryContent}>
                <div>
                  <strong>Subjects:</strong>{' '}
                  {selectedSubjects
                    .map((id) => subjects.find((s) => s.id === id)?.name)
                    .filter(Boolean)
                    .join(', ')}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <strong>Target Exams:</strong>{' '}
                  {selectedExamGoals.map((g) => `${g.examName} (${g.targetYear})`).join(', ')}
                </div>
              </div>
            </div>

            <div className={styles.summarySection}>
              <div className={styles.summaryHeader}>
                <span className={styles.summaryTitle}>Study Routine</span>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', cursor: 'pointer' }}
                  onClick={() => setStep(4)}
                >
                  Edit
                </button>
              </div>
              <div className={styles.summaryContent}>
                {dailyHours} hours daily &bull; {preferredStudyTime.replace('_', ' ')} study peak &bull;{' '}
                {learningStyle.replace(/_/g, ' ')}
              </div>
            </div>

            {/* Extensible Future Diagnostic / Student Model Hook */}
            <div className={styles.knowledgeModelBox}>
              <div className={styles.kmIcon} aria-hidden="true">
                🧬
              </div>
              <div>
                <div className={styles.kmTextTitle}>Student Model Ready for Calibration</div>
                <p className={styles.kmTextDesc}>
                  Your academic taxonomy is attached to the SharpMind Knowledge Graph. Your baseline readiness is recorded as{' '}
                  <strong style={{ color: 'var(--color-primary-light)' }}>{preparationLevel.replace('_', ' ')}</strong>.
                  A diagnostic assessment can be started immediately or from your workspace dashboard.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <footer className={styles.wizardFooter}>
          <div className={styles.draftIndicator}>
            {draftSavedTime && <span>💾 {draftSavedTime}</span>}
          </div>

          <div className={styles.footerActions}>
            {step > 1 && (
              <Button type="button" variant="outline" size="md" onClick={handleBack}>
                Back
              </Button>
            )}

            {step < 5 ? (
              <Button type="button" variant="primary" size="md" onClick={handleNext}>
                Save & Continue &rarr;
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={handleComplete}
              >
                Activate Student OS &rarr;
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <section className={`${styles.page} section`} aria-labelledby="onboarding-heading">
      <div className={styles.glow} aria-hidden="true" />
      <Suspense fallback={<div className={styles.container}>Loading onboarding session...</div>}>
        <OnboardingWizard />
      </Suspense>
    </section>
  );
}
