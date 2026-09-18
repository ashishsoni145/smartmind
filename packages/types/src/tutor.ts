export type TutorMode =
  | 'teach'
  | 'socratic'
  | 'hint'
  | 'practice'
  | 'quiz'
  | 'check_solution'
  | 'explain_mistake'
  | 'revision'
  | 'viva'
  | 'exam';

export interface TutorModeInfo {
  id: TutorMode;
  label: string;
  shortDesc: string;
  icon: string;
  badge?: string;
  pedagogyRationale: string;
}

export interface TutorCitation {
  source: string;
  chapterOrDoc: string;
  chapter?: string;
  section?: string;
  pageNumber?: number;
  url?: string;
}

export interface TutorMessage {
  id: string;
  sessionId: string;
  senderRole: 'student' | 'assistant' | 'system';
  role?: 'user' | 'assistant' | 'student';
  messageText: string;
  content?: string;
  imageUrl?: string;
  mode?: TutorMode;
  citations?: TutorCitation[];
  createdAt: string;
}

export interface TutorContext {
  subjectId?: string;
  chapterId?: string;
  topicId?: string;
  topicTitle?: string;
  grade?: string;
  targetExam?: string;
}

export interface TutorSession {
  id: string;
  userId: string;
  title: string;
  subjectId?: string;
  curriculumNodeId?: string;
  currentMode: TutorMode;
  mode?: TutorMode;
  context?: TutorContext;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}
