export interface Board {
  id: string;
  name: string;
  code: string;
  description: string;
}

export interface Grade {
  id: string;
  name: string;
  code: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  icon: string;
  category: 'core_stem' | 'humanities' | 'commerce' | 'languages';
}

export type ScoreType = 'rank' | 'percentile' | 'marks';

export interface TargetExam {
  id: string;
  name: string;
  code: string;
  scoreType: ScoreType;
  scorePlaceholder: string;
  typicalMonths: string[];
}
