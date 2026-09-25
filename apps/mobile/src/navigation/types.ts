export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type StudyStackParamList = {
  StudyHub: undefined;
  Planner: undefined;
  Classroom: undefined;
  Topic: { nodeId: string; title: string };
  Library: undefined;
  Material: { materialId: string; title: string };
  Tests: undefined;
  TestDetail: { assessmentId: string };
  TestRunner: { assessmentId: string; submissionId?: string };
  TestResults: { submissionId: string };
  Revision: undefined;
  Mistakes: undefined;
  MistakeDetail: { mistakeId: string };
};

export type TutorStackParamList = {
  TutorList: undefined;
  TutorChat: { sessionId: string; title?: string };
};

export type FocusStackParamList = {
  FocusHome: undefined;
  FocusSetup: undefined;
  Permissions: undefined;
  FocusSession: undefined;
};

export type ProgressStackParamList = {
  ProgressHub: undefined;
  Analytics: undefined;
  Readiness: undefined;
  Mastery: undefined;
  History: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Profile: undefined;
  Notifications: undefined;
  Subscription: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  TutorTab: undefined;
  StudyTab: undefined;
  FocusTab: undefined;
  ProgressTab: undefined;
};
