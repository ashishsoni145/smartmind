import { asNumber, pickString } from '../../utils/format';

export type PlanTaskView = {
  id: string;
  sessionId: string | null;
  title: string;
  subject: string | null;
  minutes: number | null;
  status: string;
  priority: string | null;
};

export type RevisionView = {
  id: string;
  title: string;
  subject: string | null;
  dueDate: string | null;
  intervalDays: number | null;
  retention: number | null;
};

export type CalibrationView = {
  calibrated: boolean;
  evidenceCount: number | null;
  mastery: number | null;
  retention: number | null;
  weakTopics: Array<{ title: string; mastery: number | null }>;
  reason: string;
};

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

export function mapPlanTasks(plan: unknown): PlanTaskView[] {
  const sessions = record(plan).sessions;
  if (!Array.isArray(sessions)) return [];
  const tasks: PlanTaskView[] = [];
  sessions.forEach((session) => {
    const sessionRecord = record(session);
    const nested = sessionRecord.tasks;
    if (!Array.isArray(nested)) return;
    nested.forEach((task) => {
      const item = record(task);
      const title = pickString(item, ['title']);
      const id = pickString(item, ['id']);
      if (!title || !id) return;
      tasks.push({
        id,
        sessionId: pickString(sessionRecord, ['id']),
        title,
        subject: pickString(item, ['subjectId', 'subject_id', 'subject']),
        minutes: asNumber(item.estimatedMinutes ?? item.estimated_minutes),
        status: pickString(item, ['status']) || 'pending',
        priority: pickString(item, ['priority']),
      });
    });
  });
  return tasks;
}

export function mapRevisionDue(payload: unknown): RevisionView[] {
  const items = Array.isArray(payload) ? payload : record(payload).items;
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    const row = record(item);
    const id = pickString(row, ['id']);
    if (!id) return [];
    return [{
      id,
      title: pickString(row, ['topicTitle', 'title']) || 'Revision item',
      subject: pickString(row, ['subjectId', 'subject_id']),
      dueDate: pickString(row, ['dueDate', 'due_date']),
      intervalDays: asNumber(row.intervalDays ?? row.interval_days),
      retention: asNumber(row.currentRetention ?? row.current_retention),
    }];
  });
}

export function mapCalibration(summary: unknown, profileStatus: string | null): CalibrationView {
  const row = record(summary);
  const evidence = asNumber(row.totalEvidence ?? row.total_evidence);
  const status = (profileStatus || '').toLowerCase();
  const calibrated = status === 'calibrated' || status === 'initialized' ? evidence !== 0 : (evidence ?? 0) > 0;
  if (!calibrated) {
    return {
      calibrated: false,
      evidenceCount: evidence,
      mastery: null,
      retention: null,
      weakTopics: [],
      reason: evidence === 0 || evidence === null
        ? 'No learning evidence has been recorded yet. Scores stay hidden until the diagnostic calibrates the student model.'
        : 'The student model is marked uncalibrated. SharpMind will not show a mastery score.',
    };
  }
  const subjects = Array.isArray(row.subjectSummaries) ? row.subjectSummaries : [];
  const weakTopics = subjects.flatMap((subject) => {
    const topics = record(subject).weakestTopics;
    if (!Array.isArray(topics)) return [];
    return topics.map((topic) => {
      const item = record(topic);
      return {
        title: pickString(item, ['title']) || 'Topic',
        mastery: asNumber(item.mastery),
      };
    });
  });
  return {
    calibrated: true,
    evidenceCount: evidence,
    mastery: asNumber(row.overallMastery ?? row.overall_mastery),
    retention: asNumber(row.overallRetention ?? row.overall_retention),
    weakTopics,
    reason: 'Scores come from the student model. They are not estimated on this device.',
  };
}

export function nextAction(input: {
  calibrated: boolean;
  tasks: PlanTaskView[];
  revisions: RevisionView[];
  backlogTitle: string | null;
}): { title: string; detail: string; route: string } {
  if (!input.calibrated) {
    return {
      title: 'Take the diagnostic',
      detail: 'Calibration has to come from the assessment engine before SharpMind can rank what to study.',
      route: 'Tests',
    };
  }
  const open = input.tasks.find((task) => task.status !== 'completed' && task.status !== 'skipped');
  if (open) {
    return { title: open.title, detail: 'Next incomplete task from today’s server plan.', route: 'Planner' };
  }
  if (input.revisions[0]) {
    return { title: input.revisions[0].title, detail: 'Due in the spaced-repetition queue.', route: 'Revision' };
  }
  if (input.backlogTitle) {
    return { title: input.backlogTitle, detail: 'Highest priority item from the adaptive backlog.', route: 'Planner' };
  }
  return {
    title: 'No next action yet',
    detail: 'The planner and revision queue did not return a task. Nothing was filled in locally.',
    route: 'Planner',
  };
}
