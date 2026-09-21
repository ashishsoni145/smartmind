'use client';

import React, { useState } from 'react';
import type {
  Subject,
  ChapterNode,
  TopicNode,
  CurriculumQuestion,
  CurriculumMaterial,
  FormulaItem,
} from '@/lib/types/curriculum';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { FormulaCard } from '@/components/ui/MathFormula';
import { VisualLearningViewer } from '@/components/visual/VisualLearningViewer';
import { apiClient } from '@/lib/api-client';
import styles from './TopicDetailView.module.css';

export type TopicTab = 'notes' | 'formulas' | 'artifacts' | 'questions';

interface TopicDetailViewProps {
  subject: Subject;
  chapter: ChapterNode;
  topic: TopicNode;
  questions: CurriculumQuestion[];
  materials: CurriculumMaterial[];
  activeTab?: TopicTab;
  onTabChange?: (tab: TopicTab) => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  subject,
  chapter,
  topic,
  questions,
  materials,
  activeTab = 'notes',
  onTabChange,
}) => {
  const [currentTab, setCurrentTab] = useState<TopicTab>(activeTab);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<
    Record<
      string,
      {
        isCorrect: boolean;
        explanation?: string;
        correctOptions?: string[];
        marksAwarded?: number;
      }
    >
  >({});
  const [validatingQuestionId, setValidatingQuestionId] = useState<string | null>(null);
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [is3DActive, setIs3DActive] = useState<boolean>(true);
  const [examFilter, setExamFilter] = useState<string>('all');

  const handleTabClick = (tab: TopicTab) => {
    setCurrentTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleOptionSelect = async (questionId: string, optionKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
    setValidatingQuestionId(questionId);
    try {
      const result = await apiClient.questions.validate(questionId, {
        selectedOptions: [optionKey],
      });
      setEvaluations((prev) => ({
        ...prev,
        [questionId]: {
          isCorrect: result.isCorrect,
          explanation: result.explanation,
          correctOptions: result.correctOptions || [],
          marksAwarded: result.marksAwarded,
        },
      }));
    } catch (err) {
      console.error('Failed to validate question answer:', err);
    } finally {
      setValidatingQuestionId(null);
    }
  };

  const toggleHint = (questionId: string) => {
    setRevealedHints((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const toggleSolution = (questionId: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Collect formulas for this topic
  const topicFormulas: FormulaItem[] =
    topic.formulas && topic.formulas.length > 0
      ? topic.formulas
      : topic.concepts && topic.concepts.length > 0
      ? topic.concepts.flatMap((c) => c.coreFormulas || [])
      : [];

  // Check if topic has a registered 3D simulation
  const primarySimulationId =
    topic.artifacts?.find((a) => a.simulationId)?.simulationId ||
    topic.concepts?.find((c) => c.simulationId)?.simulationId;

  const has3DSimulation = Boolean(primarySimulationId);

  // Notes data fallback
  const notesData = {
    overview:
      topic.notes?.overview ||
      topic.description ||
      `Comprehensive NCERT study module for ${topic.title} aligned with the latest rationalised curriculum.`,
    sections:
      topic.notes?.sections && topic.notes.sections.length > 0
        ? topic.notes.sections
        : [
            {
              heading: 'Foundational Principles & Theory',
              paragraphs: [
                `This unit establishes the core theoretical concepts of ${topic.title} following the latest rationalised NCERT syllabus. Review derivations, dimensional relationships, and fundamental definitions.`,
                `Pay close attention to coordinate conventions, physical assumptions, and experimental boundary conditions.`,
              ],
              keyTakeaways: [
                'Master fundamental definitions and vector/scalar distinctions.',
                'Verify SI base units and dimensional homogeneity in all equations.',
                'Review step-by-step mathematical reasoning for examination derivations.',
              ],
              examTips: [
                'Frequently tested in standard CBSE board long-answer questions and competitive entrance exams.',
                'Check sign conventions and reference frames before substituting numerical values.',
              ],
            },
          ],
    commonMisconceptions: topic.notes?.commonMisconceptions,
  };

  return (
    <div className={styles.container}>
      {/* Topic Hero Card */}
      <div className={styles.topicHero}>
        <div className={styles.heroTopRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={styles.topicCode}>{topic.code}</span>
            <span className={styles.parentContext}>
              {subject.name} • {chapter.title}
            </span>
          </div>
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Icon name="clock" size="xs" />
            <span>Est. {topic.estimatedMinutes || 45} mins</span>
          </span>
        </div>

        <h2 className={styles.topicTitle}>{topic.title}</h2>
        {topic.description && <p className={styles.topicDescription}>{topic.description}</p>}
      </div>

      {/* Prerequisites & Student Model Hooks */}
      {topic.prerequisites && topic.prerequisites.length > 0 && (
        <div className={styles.prerequisitesCard}>
          <div className={styles.prerequisitesHeader}>
            <h4 className={styles.prerequisitesTitle}>
              <Icon name="check" size="sm" />
              <span>Academic Prerequisites & Diagnostic Readiness</span>
            </h4>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: 'var(--color-text-tertiary)',
              }}
            >
              <span>
                Mastery: <strong style={{ color: '#38bdf8' }}>{topic.masteryStatus || 'uncalibrated'}</strong>
              </span>
              <span>•</span>
              <span>
                Retention: <strong>{topic.retentionPercent ?? 100}%</strong>
              </span>
            </div>
          </div>
          <div className={styles.prerequisitesList}>
            {topic.prerequisites.map((p) => (
              <span key={p.id} className={styles.prereqItem}>
                <span className={p.met ? styles.prereqStatusMet : styles.prereqStatusPending}>
                  {p.met ? '✓' : '○'}
                </span>
                <span>{p.title}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs Navigation: Notes, Formula Sheet, Artifacts, Questions */}
      <nav className={styles.tabsNav} role="tablist" aria-label="Topic Learning Resources">
        {/* OPTION 1: Detailed Notes */}
        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'notes'}
          className={`${styles.tabBtn} ${currentTab === 'notes' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabClick('notes')}
        >
          <Icon name="fileText" size="sm" />
          <span>Detailed Notes</span>
        </button>

        {/* OPTION 2: Formula Sheet */}
        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'formulas'}
          className={`${styles.tabBtn} ${currentTab === 'formulas' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabClick('formulas')}
        >
          <Icon name="sparkles" size="sm" />
          <span>Formula Sheet</span>
          <span className={styles.tabCount}>{topicFormulas.length}</span>
        </button>

        {/* OPTION 3: Visual Artifacts */}
        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'artifacts'}
          className={`${styles.tabBtn} ${currentTab === 'artifacts' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabClick('artifacts')}
        >
          <Icon name="cube" size="sm" />
          <span>Visual Artifacts</span>
          {has3DSimulation && (
            <span
              className={styles.tabCount}
              style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
              }}
            >
              3D Sandbox
            </span>
          )}
        </button>

        {/* OPTION 4: Questions & PYQs */}
        <button
          type="button"
          role="tab"
          aria-selected={currentTab === 'questions'}
          className={`${styles.tabBtn} ${currentTab === 'questions' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabClick('questions')}
        >
          <Icon name="award" size="sm" />
          <span>Exam PYQs & Tests</span>
          <span className={styles.tabCount}>{questions.length}</span>
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* 1. NOTES VIEW */}
      {/* ========================================================================= */}
      {currentTab === 'notes' && (
        <div className={styles.notesContainer} role="tabpanel">
          {/* Overview Card */}
          <div className={styles.notesOverviewCard}>
            <div className={styles.overviewHeader}>
              <Icon name="bookOpen" size="sm" />
              <h3 className={styles.overviewTitle}>NCERT Syllabus Module Overview</h3>
            </div>
            <p className={styles.overviewText}>{notesData.overview}</p>
          </div>

          {/* Structured Note Sections */}
          {notesData.sections.map((sec, idx) => (
            <div key={idx} className={styles.noteSectionCard}>
              <h4 className={styles.sectionHeading}>
                <span>{idx + 1}.</span>
                <span>{sec.heading}</span>
              </h4>

              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className={styles.noteParagraph}>
                  {p}
                </p>
              ))}

              {/* Key Takeaways */}
              {sec.keyTakeaways && sec.keyTakeaways.length > 0 && (
                <div className={styles.takeawaysBox}>
                  <div className={styles.takeawaysTitle}>Key Examination Takeaways</div>
                  <ul className={styles.takeawaysList}>
                    {sec.keyTakeaways.map((item, tIdx) => (
                      <li key={tIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exam Tips */}
              {sec.examTips && sec.examTips.length > 0 && (
                <div className={styles.examTipsBox}>
                  <div className={styles.examTipsTitle}>High-Yield Scoring Pointers</div>
                  <ul className={styles.takeawaysList}>
                    {sec.examTips.map((tip, eIdx) => (
                      <li key={eIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Common Misconceptions Box */}
          {notesData.commonMisconceptions && notesData.commonMisconceptions.length > 0 && (
            <div className={styles.misconceptionsBox}>
              <div className={styles.misconceptionsTitle}>Common Student Traps & Pitfalls</div>
              <ul className={styles.takeawaysList}>
                {notesData.commonMisconceptions.map((misc, mIdx) => (
                  <li key={mIdx}>{misc}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FORMULA SHEET VIEW */}
      {/* ========================================================================= */}
      {currentTab === 'formulas' && (
        <div className={styles.formulaSheetContainer} role="tabpanel">
          <div className={styles.formulaSheetHeader}>
            <h3 className={styles.formulaSheetTitle}>
              Key Equations & Analytical Formulas ({topicFormulas.length} Associated)
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              Rendered with standard mathematical typesetting and variable legends
            </span>
          </div>

          {topicFormulas.length === 0 ? (
            <div className={styles.noteSectionCard}>
              <h4 className={styles.sectionHeading}>Conceptual / Non-Numerical Unit</h4>
              <p className={styles.noteParagraph}>
                This section focuses primarily on structural classification, qualitative principles, and nomenclature. Review the detailed notes tab for complete definitions and mechanisms.
              </p>
            </div>
          ) : (
            <div className={styles.formulaGrid}>
              {topicFormulas.map((f, idx) => (
                <FormulaCard
                  key={idx}
                  label={f.label}
                  formula={f.formula}
                  description={f.description}
                  variables={f.variables}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VISUAL ARTIFACTS VIEW */}
      {/* ========================================================================= */}
      {currentTab === 'artifacts' && (
        <div className={styles.artifactsContainer} role="tabpanel">
          {has3DSimulation ? (
            <div className={styles.artifactCard}>
              <div className={styles.artifactHeader}>
                <div className={styles.artifactMeta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className={styles.artifactTitle}>Interactive 3D Simulation Sandbox</h3>
                    <span className={styles.artifactBadge3D}>Contained 3D Window</span>
                  </div>
                  <p className={styles.artifactDesc}>
                    Rotate and orbit camera angle, zoom into dynamic vectors, and adjust physical parameters in real-time. All interactions are strictly contained within this 3D viewport window.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={is3DActive ? 'outline' : 'primary'}
                  onClick={() => setIs3DActive(!is3DActive)}
                >
                  {is3DActive ? 'Reset 3D Sandbox' : 'Launch 3D Window'}
                </Button>
              </div>

              {is3DActive && (
                <div className={styles.artifactStageBox}>
                  <VisualLearningViewer
                    simulationId={primarySimulationId}
                    title={topic.title}
                    topicTitle={`${chapter.title} • ${topic.title}`}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={styles.artifactCard}>
              <div className={styles.artifactHeader}>
                <div className={styles.artifactMeta}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className={styles.artifactTitle}>Conceptual Visual Model</h3>
                    <span
                      className={styles.artifactBadge3D}
                      style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      Visual Model
                    </span>
                  </div>
                  <p className={styles.artifactDesc}>
                    Orthogonal visual breakdown and dimensional parameter relationships for {topic.title}.
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '24px',
                  background: 'rgba(9, 13, 22, 0.7)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ color: '#38bdf8', fontWeight: 600, fontSize: '14px' }}>
                  Analytical Architecture & Physical Relationships
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
                  This module operates under standard rationalised NCERT parameters. For 3D kinetic mechanics, open the respective kinematics, orbital gravitation, electromagnetism, wave interference, or atomic models in the curriculum library.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Button size="sm" variant="outline" onClick={() => handleTabClick('formulas')}>
                    <Icon name="sparkles" size="xs" />
                    <span>View Formula Sheet</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTabClick('notes')}>
                    <Icon name="fileText" size="xs" />
                    <span>Read Detailed Notes</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. QUESTIONS & PYQS VIEW */}
      {/* ========================================================================= */}
      {currentTab === 'questions' && (
        <div className={styles.tabPanel} role="tabpanel">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Verified examination questions with authentic provenance ({questions.length} Total)
            </span>
            <Button href={`/app/tutor?topic=${encodeURIComponent(topic.title)}`} size="sm" variant="outline">
              <Icon name="tutor" size="xs" />
              <span>Practice with Socratic Tutor</span>
            </Button>
          </div>

          {/* Exam Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', marginBottom: '8px' }}>
            {['all', 'JEE Main', 'NEET', 'JEE Advanced', 'CBSE Board'].map((exam) => (
              <button
                key={exam}
                type="button"
                onClick={() => setExamFilter(exam)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: examFilter === exam ? 'var(--color-text-primary)' : 'rgba(255, 255, 255, 0.1)',
                  background: examFilter === exam ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: examFilter === exam ? '#fff' : 'var(--color-text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {exam === 'all' ? 'All Examinations' : exam}
              </button>
            ))}
          </div>

          {(() => {
            const filteredQuestions =
              examFilter === 'all'
                ? questions
                : questions.filter(
                    (q) => q.sourceExam?.toLowerCase() === examFilter.toLowerCase()
                  );

            if (filteredQuestions.length === 0) {
              return (
                <div className={styles.noteSectionCard}>
                  <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                    {questions.length === 0
                      ? 'No past year questions currently indexed for this specific node. Practice diagnostic assessments in the Tests & Diagnostics tab.'
                      : `No past year questions indexed for ${examFilter}. Select "All Examinations" to view all available questions.`}
                  </p>
                </div>
              );
            }

            return filteredQuestions.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isHintOpen = revealedHints[q.id];
              const isSolOpen = revealedSolutions[q.id];

              return (
                <div key={q.id} className={styles.questionCard}>
                  <div className={styles.questionMetaRow}>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span className={styles.qNum}>Q{idx + 1}</span>
                      {q.isPyq && q.sourceExam && (
                        <span className={styles.examTag}>
                          {q.sourceExam} {q.sourceYear}
                        </span>
                      )}
                      {q.sourceSession && (
                        <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)' }}>
                          ({q.sourceSession})
                        </span>
                      )}
                      <span
                        className={`${styles.diffTag} ${
                          q.difficultyLevel === 'easy'
                            ? styles.diffEasy
                            : q.difficultyLevel === 'hard'
                            ? styles.diffHard
                            : styles.diffModerate
                        }`}
                      >
                        {q.difficultyLevel.toUpperCase()}
                      </span>
                      {q.isImportant && (
                        <span className={styles.importantBadge}>
                          🔥 High Yield
                        </span>
                      )}
                      {q.appearanceFrequency && q.appearanceFrequency > 1 && (
                        <span className={styles.frequencyBadge}>
                          Repeated {q.appearanceFrequency}x
                        </span>
                      )}
                      {q.marks && (
                        <span className={styles.marksBadge}>
                          {q.marks} Marks
                        </span>
                      )}
                    </div>

                    {q.isVerified && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#10b981',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Icon name="check" size="xs" />
                        <span>Verified Provenance</span>
                      </span>
                    )}
                  </div>

                  <div className={styles.questionText}>{q.questionText}</div>

                  {/* Pattern tags */}
                  {q.patternTags && q.patternTags.length > 0 && (
                    <div className={styles.patternTagsList}>
                      {q.patternTags.map((tag) => (
                        <span key={tag} className={styles.patternTagChip}>
                          #{tag.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Options */}
                  {q.options && q.options.length > 0 && (
                    <div className={styles.optionsList}>
                      {q.options.map((opt) => {
                        const evalResult = evaluations[q.id];
                        const isSelected = userAns === opt.optionKey;
                        const isCorrectOption = evalResult?.correctOptions?.includes(opt.optionKey) || (isSelected && evalResult?.isCorrect);
                        let optionClass = styles.optionItem;

                        if (evalResult) {
                          if (isSelected) {
                            optionClass += evalResult.isCorrect
                              ? ` ${styles.optionCorrect}`
                              : ` ${styles.optionIncorrect}`;
                          } else if (isCorrectOption) {
                            optionClass += ` ${styles.optionCorrect}`;
                          }
                        } else if (isSelected) {
                          optionClass += ` ${styles.optionCorrect}`;
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            className={optionClass}
                            disabled={validatingQuestionId === q.id}
                            onClick={() => handleOptionSelect(q.id, opt.optionKey)}
                          >
                            <span className={styles.optionLetter}>{opt.optionKey}</span>
                            <span className={styles.optionText}>{opt.optionText}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Server Validation Feedback */}
                  {evaluations[q.id] && (
                    <div
                      style={{
                        marginTop: '12px',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: evaluations[q.id].isCorrect
                          ? 'rgba(16, 185, 129, 0.1)'
                          : 'rgba(239, 68, 68, 0.1)',
                        border: `1px solid ${
                          evaluations[q.id].isCorrect
                            ? 'rgba(16, 185, 129, 0.3)'
                            : 'rgba(239, 68, 68, 0.3)'
                        }`,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: evaluations[q.id].isCorrect ? '#10b981' : '#ef4444',
                          marginBottom: '4px',
                        }}
                      >
                        {evaluations[q.id].isCorrect
                          ? `✓ Correct Answer! (+${evaluations[q.id].marksAwarded || q.marks || 4} Marks)`
                          : '✗ Incorrect. Review the verified derivation below.'}
                      </div>
                      {evaluations[q.id].explanation && (
                        <p
                          style={{
                            margin: '4px 0 0',
                            fontSize: '0.8125rem',
                            lineHeight: 1.5,
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          <strong>Solution: </strong>
                          {evaluations[q.id].explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Hints and Solutions Action Row */}
                  <div className={styles.actionRow}>
                    {q.hint && (
                      <button
                        type="button"
                        className={styles.hintBtn}
                        onClick={() => toggleHint(q.id)}
                      >
                        <Icon name="lightbulb" size="xs" />
                        <span>{isHintOpen ? 'Hide Socratic Hint' : 'View Socratic Hint'}</span>
                      </button>
                    )}

                    {Boolean(evaluations[q.id]?.explanation) && (
                      <button
                        type="button"
                        className={styles.solBtn}
                        onClick={() => toggleSolution(q.id)}
                      >
                        <Icon name="check" size="xs" />
                        <span>{isSolOpen ? 'Hide Full Solution' : 'View Verified Solution'}</span>
                      </button>
                    )}
                  </div>

                  {/* Hint Reveal */}
                  {isHintOpen && (
                    <div className={styles.hintBox}>
                      <strong>Socratic Guide: </strong>
                      {q.hint}
                    </div>
                  )}

                  {/* Solution Reveal */}
                  {isSolOpen && (
                    <div className={styles.solutionBox}>
                      <div className={styles.solutionHeader}>
                        <Icon name="check" size="xs" />
                        <span>Authentic Examination Solution & Derivation</span>
                      </div>
                      <div className={styles.solutionText}>
                        {evaluations[q.id]?.explanation || 'Solution steps verified against standard syllabus.'}
                      </div>
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
};
