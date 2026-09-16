'use client';

import React, { useState } from 'react';
import type {
  Subject,
  ChapterNode,
  TopicNode,
  CurriculumQuestion,
  CurriculumMaterial,
} from '@/lib/types/curriculum';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { VisualLearningViewer } from '@/components/visual/VisualLearningViewer';
import styles from './TopicDetailView.module.css';

export type TopicTab = 'concepts' | 'pyqs' | 'notes' | 'mastery';

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
  activeTab = 'concepts',
  onTabChange,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  const handleTabClick = (tab: TopicTab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleOptionSelect = (questionId: string, optionKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const toggleHint = (questionId: string) => {
    setRevealedHints((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const toggleSolution = (questionId: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const concepts = topic.concepts || [];
  const pyqQuestions = questions.filter((q) => q.isPyq);

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
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Icon name="clock" size="xs" />
            <span>Est. {topic.estimatedMinutes || 45} mins</span>
          </span>
        </div>

        <h2 className={styles.topicTitle}>{topic.title}</h2>
        {topic.description && <p className={styles.topicDescription}>{topic.description}</p>}
      </div>

      {/* Tabs Navigation */}
      <nav className={styles.tabsNav} role="tablist" aria-label="Topic Learning Resources">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'concepts'}
          className={`${styles.tabBtn} ${activeTab === 'concepts' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabClick('concepts')}
        >
          <Icon name="sparkles" size="sm" />
          <span>Concepts & Visual Learning</span>
          <span className={styles.tabCount}>{concepts.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'pyqs'}
          className={`${styles.tabBtn} ${activeTab === 'pyqs' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabClick('pyqs')}
        >
          <Icon name="award" size="sm" />
          <span>Important Questions & PYQs</span>
          <span className={styles.tabCount}>{questions.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'notes'}
          className={`${styles.tabBtn} ${activeTab === 'notes' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabClick('notes')}
        >
          <Icon name="fileText" size="sm" />
          <span>Notes & References</span>
          <span className={styles.tabCount}>{materials.length}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'mastery'}
          className={`${styles.tabBtn} ${activeTab === 'mastery' ? styles.tabBtnActive : ''}`}
          onClick={() => handleTabClick('mastery')}
        >
          <Icon name="target" size="sm" />
          <span>Mastery & Readiness Hooks</span>
          <span className={styles.tabCount} style={{ background: 'rgba(255, 255, 255, 0.1)' }}>Model</span>
        </button>
      </nav>

      {/* TAB 1: Concepts & Visual Learning */}
      {activeTab === 'concepts' && (
        <div className={styles.tabPanel} role="tabpanel">
          {concepts.length === 0 ? (
            <div className={styles.conceptCard}>
              <h3 className={styles.conceptTitle}>Foundational Concept Overview</h3>
              <p className={styles.conceptSummary}>
                {topic.description || 'Core syllabus unit under active pedagogical review.'}
              </p>
            </div>
          ) : (
            concepts.map((concept) => (
              <div key={concept.id} className={styles.conceptCard}>
                <div className={styles.conceptHeader}>
                  <h3 className={styles.conceptTitle}>{concept.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    {topic.code}
                  </span>
                </div>

                <p className={styles.conceptSummary}>{concept.summary}</p>

                {/* Mathematical / Core Formulas */}
                {concept.coreFormulas && concept.coreFormulas.length > 0 && (
                  <div className={styles.formulaSection}>
                    <h4 className={styles.formulaHeading}>Key Equations & Formulas</h4>
                    <div className={styles.formulaGrid}>
                      {concept.coreFormulas.map((f, i) => (
                        <div key={i} className={styles.formulaCard}>
                          <span className={styles.formulaLabel}>{f.label}</span>
                          <code className={styles.formulaCode}>{f.formula}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Learning Simulation */}
                {concept.visualLearningTitle && (
                  <div className={styles.simulationCard}>
                    <div className={styles.simulationHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon name="video" size="sm" />
                        <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                          {concept.visualLearningTitle}
                        </span>
                      </div>
                      <span className={styles.simulationBadge}>
                        {concept.visualLearningType || 'Interactive Simulation'}
                      </span>
                    </div>

                    <div className={styles.simulationCanvas}>
                      <Icon name="cube" size="lg" style={{ opacity: 0.9, color: '#38bdf8' }} />
                      <div style={{ maxWidth: '480px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                          {concept.visualLearningTitle}
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                          {concept.visualLearningDescription}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={isSimulationActive ? 'outline' : 'primary'}
                        onClick={() => setIsSimulationActive(!isSimulationActive)}
                      >
                        {isSimulationActive ? 'Close 3D Simulation' : 'Launch 3D Visual Sandbox'}
                      </Button>
                    </div>

                    {isSimulationActive && (
                      <div style={{ marginTop: '1.25rem', width: '100%' }}>
                        <VisualLearningViewer
                          title={concept.visualLearningTitle || 'Ballistic Projectile Dynamics'}
                          topicTitle={topic.title}
                          onClose={() => setIsSimulationActive(false)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Important Questions & PYQ Entry */}
      {activeTab === 'pyqs' && (
        <div className={styles.tabPanel} role="tabpanel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Verified examination questions with authentic provenance ({questions.length} Total • {pyqQuestions.length} PYQs)
            </span>
            <Button href={`/app/tutor?topic=${encodeURIComponent(topic.title)}`} size="sm" variant="outline">
              <Icon name="tutor" size="xs" />
              <span>Practice with Socratic Tutor</span>
            </Button>
          </div>

          {questions.length === 0 ? (
            <div className={styles.questionCard}>
              <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                No verified past year questions linked to this specific node yet. Try the Baseline Diagnostic in Tests.
              </p>
            </div>
          ) : (
            questions.map((q, idx) => {
              const selected = selectedAnswers[q.id];
              const showHint = revealedHints[q.id];
              const showSolution = revealedSolutions[q.id];

              return (
                <div key={q.id} className={styles.questionCard}>
                  <div className={styles.questionMetaRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                        Question {idx + 1}
                      </span>
                      {q.isPyq && (
                        <span className={styles.pyqBadge}>
                          <Icon name="award" size="xs" />
                          <span>{q.sourceExam} {q.sourceYear}</span>
                        </span>
                      )}
                    </div>

                    <span className={styles.difficultyBadge}>
                      {q.difficultyLevel}
                    </span>
                  </div>

                  <p className={styles.questionText}>{q.questionText}</p>

                  {q.options && q.options.length > 0 && (
                    <div className={styles.optionsList}>
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`${styles.optionItem} ${selected === opt.optionKey ? styles.optionSelected : ''}`}
                          onClick={() => handleOptionSelect(q.id, opt.optionKey)}
                        >
                          <span className={styles.optionKey}>{opt.optionKey}</span>
                          <span>{opt.optionText}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                    {q.hint && (
                      <button
                        type="button"
                        className={styles.toggleBtn}
                        onClick={() => toggleHint(q.id)}
                      >
                        <Icon name="lightbulb" size="xs" />
                        <span>{showHint ? 'Hide Pedagogical Hint' : 'View Pedagogical Hint'}</span>
                      </button>
                    )}

                    {q.explanation && (
                      <button
                        type="button"
                        className={styles.toggleBtn}
                        onClick={() => toggleSolution(q.id)}
                      >
                        <Icon name="fileText" size="xs" />
                        <span>{showSolution ? 'Hide Step-by-Step Solution' : 'Reveal Step-by-Step Solution'}</span>
                      </button>
                    )}
                  </div>

                  {showHint && (
                    <div className={styles.expandableBox} style={{ borderColor: 'rgba(255, 255, 255, 0.15)' }}>
                      <strong style={{ color: 'var(--color-text-primary)' }}>Pedagogical Hint: </strong>
                      {q.hint}
                    </div>
                  )}

                  {showSolution && (
                    <div className={styles.expandableBox} style={{ background: 'rgba(255, 255, 255, 0.04)' }}>
                      <strong style={{ color: 'var(--color-text-primary)' }}>Full Solution & Verification: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: Notes & Resources Entry */}
      {activeTab === 'notes' && (
        <div className={styles.tabPanel} role="tabpanel">
          <div className={styles.materialGrid}>
            {materials.map((mat) => (
              <div key={mat.id} className={styles.materialCard}>
                <div className={styles.materialTop}>
                  <span className={styles.materialType}>{mat.fileType.replace('_', ' ')}</span>
                  <Icon name="fileText" size="sm" style={{ color: 'var(--color-text-tertiary)' }} />
                </div>

                <h4 className={styles.materialTitle}>{mat.title}</h4>
                {mat.authoritativeSource && (
                  <span className={styles.materialSource}>Source: {mat.authoritativeSource}</span>
                )}
                {mat.description && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {mat.description}
                  </p>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
                  <Button size="sm" variant="outline" href={`/app/library?doc=${mat.id}`}>
                    <Icon name="externalLink" size="xs" />
                    <span>Open in Curriculum Library</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Future Mastery & Readiness Hooks */}
      {activeTab === 'mastery' && (
        <div className={styles.tabPanel} role="tabpanel">
          <div className={styles.masteryCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>
                  Student Knowledge State & Retention Architecture
                </h3>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>
                  Continuous Bayesian Knowledge Tracing (BKT) & Leitner Spaced Decay Model
                </span>
              </div>

              <span style={{
                fontSize: '0.6875rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--color-text-secondary)'
              }}>
                Status: Calibration Pending
              </span>
            </div>

            <div className={styles.masteryGrid}>
              <div className={styles.masteryMetric}>
                <span className={styles.metricTitle}>
                  <Icon name="target" size="xs" />
                  <span>Mastery Probability (p_know)</span>
                </span>
                <span className={styles.metricValue}>0.10</span>
                <span className={styles.metricSubtitle}>Prior baseline before practice evidence</span>
              </div>

              <div className={styles.masteryMetric}>
                <span className={styles.metricTitle}>
                  <Icon name="revision" size="xs" />
                  <span>Memory Stability (S)</span>
                </span>
                <span className={styles.metricValue}>Cold</span>
                <span className={styles.metricSubtitle}>Awaiting first spaced review cycle</span>
              </div>

              <div className={styles.masteryMetric}>
                <span className={styles.metricTitle}>
                  <Icon name="award" size="xs" />
                  <span>Exam Weightage Share</span>
                </span>
                <span className={styles.metricValue}>{topic.weightagePercent}%</span>
                <span className={styles.metricSubtitle}>High-yield entrance exam contribution</span>
              </div>

              <div className={styles.masteryMetric}>
                <span className={styles.metricTitle}>
                  <Icon name="check" size="xs" />
                  <span>Prerequisite Dependency</span>
                </span>
                <span className={styles.metricValue} style={{ fontSize: '1.125rem' }}>
                  {topic.prerequisites?.length ? 'Satisfied' : 'None'}
                </span>
                <span className={styles.metricSubtitle}>DAG readiness for active study</span>
              </div>
            </div>

            <div className={styles.actionRow}>
              <Button href={`/app/tutor?topic=${encodeURIComponent(topic.title)}`} variant="primary" size="sm">
                <Icon name="tutor" size="xs" />
                <span>Start Socratic Dialogue</span>
              </Button>
              <Button href={`/app/focus?topic=${encodeURIComponent(topic.title)}`} variant="outline" size="sm">
                <Icon name="focus" size="xs" />
                <span>Launch 25m Focus Block</span>
              </Button>
              <Button href="/app/tests?mode=baseline" variant="outline" size="sm">
                <Icon name="tests" size="xs" />
                <span>Take Diagnostic Assessment</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
