export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  isEmailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  expiresAt: number; // Unix timestamp in seconds
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  termsAccepted: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordUpdateCredentials {
  password: string;
  confirmPassword: string;
  token?: string;
}

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'user_not_found'
  | 'email_already_in_use'
  | 'weak_password'
  | 'email_not_verified'
  | 'session_expired'
  | 'token_invalid_or_expired'
  | 'rate_limited'
  | 'network_error'
  /** The deployment has no authentication service configured at all. Not a credential problem. */
  | 'not_configured'
  | 'unknown_error';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: AuthSession;
  error?: AuthError;
  requiresEmailVerification?: boolean;
}
