import React, { useState } from 'react';
import type { AcademicSettings } from '@/lib/types/settings';
import { Icon } from '@/components/ui/Icon';
import styles from './AcademicSettingsForm.module.css';

interface AcademicSettingsFormProps {
  initialData: AcademicSettings;
  onSave: (data: Partial<AcademicSettings>) => Promise<void>;
}

const BOARDS = [
  { value: 'cbse', label: 'CBSE (Central Board of Secondary Education)' },
  { value: 'icse', label: 'ISC / ICSE' },
  { value: 'state_board', label: 'State Higher Secondary Board' },
  { value: 'ib', label: 'IB / Cambridge International' },
];

const GRADES = [
  { value: 'class_11', label: 'Class 11 (Senior Secondary Year 1)' },
  { value: 'class_12', label: 'Class 12 (Board Examination Year)' },
  { value: 'dropper', label: 'Dropper / Full-Time Competitive Repeater' },
];

const STREAMS = [
  { value: 'pcm', label: 'PCM (Physics, Chemistry, Mathematics)' },
  { value: 'pcb', label: 'PCB (Physics, Chemistry, Biology)' },
  { value: 'pcmb', label: 'PCMB (Physics, Chemistry, Math & Biology)' },
];

const TARGET_EXAMS_OPTIONS = [
  { id: 'jee_main', label: 'JEE Main' },
  { id: 'jee_advanced', label: 'JEE Advanced' },
  { id: 'neet_ug', label: 'NEET (UG)' },
  { id: 'cbse_boards', label: 'Class 12 Boards' },
  { id: 'bitsat', label: 'BITSAT' },
];

export const AcademicSettingsForm: React.FC<AcademicSettingsFormProps> = ({
  initialData,
  onSave,
}) => {
  const [board, setBoard] = useState(initialData.board);
  const [grade, setGrade] = useState(initialData.grade);
  const [stream, setStream] = useState(initialData.stream);
  const [targetExams, setTargetExams] = useState<string[]>(initialData.targetExams);
  const [dailyHours, setDailyHours] = useState(initialData.dailyAvailableHours);
  const [preferredTime, setPreferredTime] = useState(initialData.preferredStudyTime);
  const [schoolOrCoaching, setSchoolOrCoaching] = useState(initialData.schoolOrCoaching || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleExam = (id: string) => {
    setTargetExams((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        board,
        grade,
        stream,
        targetExams,
        dailyAvailableHours: dailyHours,
        preferredStudyTime: preferredTime,
        schoolOrCoaching: schoolOrCoaching.trim(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save academic profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit}>
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>
          <Icon name="target" size="sm" />
          Academic Target & Syllabus Blueprint
        </h2>
        <p className={styles.subtitle}>
          Your academic setup calibrates the curriculum hierarchy, diagnostic question selection, and target entrance exam weighting.
        </p>
      </div>

      <div className={styles.fieldsGrid}>
        {/* Board */}
        <div className={styles.fieldGroup}>
          <label htmlFor="academic-board" className={styles.label}>
            Education Board
          </label>
          <select
            id="academic-board"
            className={styles.select}
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            disabled={isSaving}
          >
            {BOARDS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* Grade */}
        <div className={styles.fieldGroup}>
          <label htmlFor="academic-grade" className={styles.label}>
            Academic Class
          </label>
          <select
            id="academic-grade"
            className={styles.select}
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            disabled={isSaving}
          >
            {GRADES.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stream */}
        <div className={styles.fieldGroup}>
          <label htmlFor="academic-stream" className={styles.label}>
            Subject Stream
          </label>
          <select
            id="academic-stream"
            className={styles.select}
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            disabled={isSaving}
          >
            {STREAMS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* School or Coaching */}
        <div className={styles.fieldGroup}>
          <label htmlFor="academic-school" className={styles.label}>
            School or Coaching Affiliation
          </label>
          <input
            id="academic-school"
            type="text"
            className={styles.input}
            placeholder="e.g. DPS R.K. Puram / Self-Study"
            value={schoolOrCoaching}
            onChange={(e) => setSchoolOrCoaching(e.target.value)}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Target Competitive Exams */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Target Competitive Examinations</label>
        <div className={styles.pillsRow}>
          {TARGET_EXAMS_OPTIONS.map((exam) => {
            const isSelected = targetExams.includes(exam.id);
            return (
              <button
                key={exam.id}
                type="button"
                className={`${styles.pillCheck} ${isSelected ? styles.activePillCheck : ''}`}
                onClick={() => toggleExam(exam.id)}
              >
                <Icon name={isSelected ? 'check' : 'target'} size="xs" />
                {exam.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Available Study Hours */}
      <div className={styles.fieldGroup}>
        <label htmlFor="academic-hours" className={styles.label}>
          Self-Study Allocation (Daily)
        </label>
        <div className={styles.sliderContainer}>
          <input
            id="academic-hours"
            type="range"
            min="1"
            max="10"
            step="0.5"
            className={styles.slider}
            value={dailyHours}
            onChange={(e) => setDailyHours(Number(e.target.value))}
            disabled={isSaving}
          />
          <span className={styles.sliderVal}>{dailyHours} hrs/day</span>
        </div>
      </div>

      <div className={styles.actionsRow}>
        {savedSuccess && (
          <span className={styles.successToast}>
            <Icon name="check" size="xs" /> Academic target profile updated
          </span>
        )}
        <button type="submit" className={styles.saveBtn} disabled={isSaving}>
          <Icon name="check" size="xs" />
          {isSaving ? 'Updating...' : 'Update Academic Target'}
        </button>
      </div>
    </form>
  );
};
