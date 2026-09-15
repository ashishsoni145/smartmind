import type {
  AuthResult,
  AuthSession,
  PasswordResetRequest,
  PasswordUpdateCredentials,
  SignInCredentials,
  SignUpCredentials,
} from '@/lib/types/auth';

export interface AuthAdapter {
  name: string;
  signIn(credentials: SignInCredentials): Promise<AuthResult>;
  signUp(credentials: SignUpCredentials): Promise<AuthResult>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  requestPasswordReset(request: PasswordResetRequest): Promise<AuthResult>;
  updatePassword(credentials: PasswordUpdateCredentials): Promise<AuthResult>;
  resendVerificationEmail(email: string): Promise<AuthResult>;
  verifyEmailToken?(token: string): Promise<AuthResult>;
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void;
}
