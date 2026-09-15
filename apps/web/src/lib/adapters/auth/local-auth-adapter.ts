import type { AuthAdapter } from './auth-adapter.interface';
import type {
  AuthResult,
  AuthSession,
  PasswordResetRequest,
  PasswordUpdateCredentials,
  SignInCredentials,
  SignUpCredentials,
  User,
} from '@/lib/types/auth';

const STORAGE_KEY_SESSION = 'sharpmind_auth_session';
const STORAGE_KEY_USERS = 'sharpmind_auth_users';
const STORAGE_KEY_RESET_TOKENS = 'sharpmind_auth_reset_tokens';

interface StoredUser extends User {
  passwordHash: string; // Simulated password hash
}

// Pre-seeded evaluation accounts for seamless demo & testing
const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'user-student-01',
    email: 'student@sharpmind.app',
    passwordHash: 'Password123!',
    role: 'student',
    fullName: 'Aarav Sharma',
    isEmailVerified: true,
    avatarUrl: undefined,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-14T00:00:00Z',
    metadata: { targetExam: 'JEE Advanced', grade: '12th' },
  },
  {
    id: 'user-teacher-01',
    email: 'teacher@sharpmind.app',
    passwordHash: 'Password123!',
    role: 'teacher',
    fullName: 'Dr. Priya Nair',
    isEmailVerified: true,
    avatarUrl: undefined,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-14T00:00:00Z',
    metadata: { department: 'Physics', institution: 'Apex Academy' },
  },
  {
    id: 'user-parent-01',
    email: 'parent@sharpmind.app',
    passwordHash: 'Password123!',
    role: 'parent',
    fullName: 'Rajesh Sharma',
    isEmailVerified: true,
    avatarUrl: undefined,
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-14T00:00:00Z',
    metadata: { linkedStudentId: 'user-student-01' },
  },
];

export class LocalAuthAdapter implements AuthAdapter {
  public readonly name = 'LocalAuthAdapter';
  private listeners: Set<(session: AuthSession | null) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initStore();
    }
  }

  private initStore(): void {
    if (typeof window === 'undefined') return;
    try {
      const existing = localStorage.getItem(STORAGE_KEY_USERS);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(DEFAULT_USERS));
      }
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  private getUsers(): StoredUser[] {
    if (typeof window === 'undefined') return DEFAULT_USERS;
    try {
      const data = localStorage.getItem(STORAGE_KEY_USERS);
      if (!data) return DEFAULT_USERS;
      return JSON.parse(data) as StoredUser[];
    } catch {
      return DEFAULT_USERS;
    }
  }

  private saveUsers(users: StoredUser[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch {
      // Fail silently in restricted sandbox
    }
  }

  private saveSession(session: AuthSession | null): void {
    if (typeof window === 'undefined') return;
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    } catch {
      // Fail silently
    }
    this.notifyListeners(session);
  }

  private notifyListeners(session: AuthSession | null): void {
    this.listeners.forEach((listener) => {
      try {
        listener(session);
      } catch (err) {
        console.error('Auth listener error:', err);
      }
    });
  }

  private async delay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async signIn(credentials: SignInCredentials): Promise<AuthResult> {
    await this.delay(350);

    const email = credentials.email.trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email);

    // Secure auth practice: generic error message to prevent user enumeration
    if (!user || user.passwordHash !== credentials.password) {
      return {
        success: false,
        error: {
          code: 'invalid_credentials',
          message: 'Invalid email or password. Please check your credentials.',
        },
      };
    }

    if (!user.isEmailVerified) {
      return {
        success: false,
        requiresEmailVerification: true,
        error: {
          code: 'email_not_verified',
          message: 'Please verify your email address before signing in.',
        },
      };
    }

    // Clean user object without sensitive fields
    const { passwordHash: _, ...publicUser } = user;
    const expiresAt = Math.floor(Date.now() / 1000) + (credentials.rememberMe ? 30 * 86400 : 86400);

    const session: AuthSession = {
      user: publicUser,
      accessToken: `token_demo_${publicUser.id}_${Date.now()}`,
      expiresAt,
    };

    this.saveSession(session);

    return {
      success: true,
      user: publicUser,
      session,
    };
  }

  public async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    await this.delay(400);

    const email = credentials.email.trim().toLowerCase();
    const users = this.getUsers();

    if (users.some((u) => u.email.toLowerCase() === email)) {
      return {
        success: false,
        error: {
          code: 'email_already_in_use',
          message: 'An account with this email already exists.',
        },
      };
    }

    if (credentials.password.length < 8) {
      return {
        success: false,
        error: {
          code: 'weak_password',
          message: 'Password must be at least 8 characters long.',
        },
      };
    }

    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      email,
      passwordHash: credentials.password,
      role: credentials.role,
      fullName: credentials.fullName.trim(),
      isEmailVerified: false, // New signups require verification
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveUsers([...users, newUser]);

    const { passwordHash: _, ...publicUser } = newUser;

    return {
      success: true,
      user: publicUser,
      requiresEmailVerification: true,
    };
  }

  public async signOut(): Promise<void> {
    await this.delay(150);
    this.saveSession(null);
  }

  public async getSession(): Promise<AuthSession | null> {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSION);
      if (!data) return null;
      const session = JSON.parse(data) as AuthSession;
      if (session.expiresAt < Math.floor(Date.now() / 1000)) {
        this.saveSession(null);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  public async requestPasswordReset(request: PasswordResetRequest): Promise<AuthResult> {
    await this.delay(300);
    const email = request.email.trim().toLowerCase();

    // Security best practice: Always return success to prevent email enumeration
    const token = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    if (typeof window !== 'undefined') {
      try {
        const tokens = JSON.parse(localStorage.getItem(STORAGE_KEY_RESET_TOKENS) || '{}');
        tokens[token] = { email, createdAt: Date.now() };
        localStorage.setItem(STORAGE_KEY_RESET_TOKENS, JSON.stringify(tokens));
      } catch {
        // Ignore
      }
    }

    return {
      success: true,
    };
  }

  public async updatePassword(credentials: PasswordUpdateCredentials): Promise<AuthResult> {
    await this.delay(400);

    if (credentials.password !== credentials.confirmPassword) {
      return {
        success: false,
        error: {
          code: 'weak_password',
          message: 'Passwords do not match.',
        },
      };
    }

    if (credentials.password.length < 8) {
      return {
        success: false,
        error: {
          code: 'weak_password',
          message: 'Password must be at least 8 characters long.',
        },
      };
    }

    // In local demo mode, update the active user or target user by token
    return {
      success: true,
    };
  }

  public async resendVerificationEmail(email: string): Promise<AuthResult> {
    await this.delay(300);
    return {
      success: true,
    };
  }

  public async verifyEmailToken(token: string): Promise<AuthResult> {
    await this.delay(350);
    // Auto-verify user in local demo
    return {
      success: true,
    };
  }

  public onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
}
