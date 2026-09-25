export type AnswerDraft = {
  questionId: string;
  selectedOptions: string[];
  numericalAnswer: string;
  status: 'answered' | 'marked_for_review' | 'unanswered' | 'visited';
  timeSpentSeconds: number;
  updatedAt: string;
};

export type PersistedAttempt = {
  submissionId: string;
  assessmentId: string;
  answers: Record<string, AnswerDraft>;
  timeRemainingSeconds: number;
  savedAt: string;
  sync: 'pending' | 'synchronized' | 'failed';
};

export interface KeyValueStore {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
}

export class AnswerStore {
  constructor(private readonly storage: KeyValueStore) {}

  key(submissionId: string): string {
    return `attempt.${submissionId}`;
  }

  async load(submissionId: string): Promise<PersistedAttempt | null> {
    const raw = await this.storage.read(this.key(submissionId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedAttempt;
    if (!parsed || parsed.submissionId !== submissionId || !parsed.answers) return null;
    return parsed;
  }

  async save(attempt: PersistedAttempt): Promise<void> {
    await this.storage.write(this.key(attempt.submissionId), JSON.stringify(attempt));
  }

  merge(local: PersistedAttempt | null, remoteAnswers: Record<string, AnswerDraft>): Record<string, AnswerDraft> {
    const merged: Record<string, AnswerDraft> = { ...remoteAnswers };
    if (!local) return merged;
    Object.values(local.answers).forEach((answer) => {
      const remote = merged[answer.questionId];
      if (!remote || remote.updatedAt < answer.updatedAt) {
        merged[answer.questionId] = answer;
      }
    });
    return merged;
  }
}
