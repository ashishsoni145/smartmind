export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  fullName?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      studentProfileId?: string;
    }
  }
}

