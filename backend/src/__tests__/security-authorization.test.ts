import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { sanitizeQuestionForClient } from '../modules/questions/question.rules';
import { IdentityService } from '../modules/auth/identity.service';
import { requireStudentOrMentor } from '../middleware/authorization';
import { ModelRouter, AiServiceUnavailableError } from '../ai/router/model-router';
import { AuthenticatedUser } from '../types/express';
import { supabase } from '../db/client';

describe('SharpMind Security, Tenant Isolation & Anti-Leakage Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  describe('1. Cross-Tenant Isolation via IdentityService', () => {
    const studentUser1: AuthenticatedUser = {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'student1@sharpmind.ai',
      role: 'student',
      fullName: 'Student One',
    };

    const studentUser2: AuthenticatedUser = {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'student2@sharpmind.ai',
      role: 'student',
      fullName: 'Student Two',
    };

    it('Student 1 should be authorized to access their own resources via "me"', async () => {
      vi.spyOn(IdentityService, 'getStudentProfileIdForUser').mockResolvedValue('sp-profile-1');

      const result = await IdentityService.isAuthorizedForStudent(studentUser1, 'me');
      expect(result.authorized).toBe(true);
      expect(result.studentProfileId).toBe('sp-profile-1');
      expect(result.targetUserId).toBe(studentUser1.id);
    });

    it('Student 1 should NOT be authorized to access Student 2 resources', async () => {
      vi.spyOn(IdentityService, 'resolveStudentProfileId').mockResolvedValue('sp-profile-2');
      vi.spyOn(IdentityService, 'getUserIdForStudentProfile').mockResolvedValue(studentUser2.id);
      vi.spyOn(IdentityService, 'getStudentProfileIdForUser').mockResolvedValue('sp-profile-1');

      await expect(IdentityService.isAuthorizedForStudent(studentUser1, 'sp-profile-2')).rejects.toThrow(
        /Access denied/
      );
    });

    it('Admin user should be authorized to access any student profile', async () => {
      const adminUser: AuthenticatedUser = {
        id: '99999999-9999-9999-9999-999999999999',
        email: 'admin@sharpmind.ai',
        role: 'admin',
        fullName: 'Admin User',
      };

      vi.spyOn(IdentityService, 'resolveStudentProfileId').mockResolvedValue('sp-profile-2');
      vi.spyOn(IdentityService, 'getUserIdForStudentProfile').mockResolvedValue(studentUser2.id);

      const result = await IdentityService.isAuthorizedForStudent(adminUser, 'sp-profile-2');
      expect(result.authorized).toBe(true);
    });
  });

  describe('2. Tenant Isolation Middleware (requireStudentOrMentor)', () => {
    it('should reject unauthenticated request with UnauthorizedError', async () => {
      const middleware = requireStudentOrMentor('studentId');
      const req: any = { params: { studentId: 'sp-target-1' } };
      const res: any = {};
      let caughtError: any = null;

      await middleware(req, res, (err) => {
        caughtError = err;
      });

      expect(caughtError).toBeDefined();
      expect(caughtError.statusCode || caughtError.status).toBe(401);
    });

    it('should reject student accessing another student with ForbiddenError (403)', async () => {
      vi.spyOn(IdentityService, 'isAuthorizedForStudent').mockResolvedValue({
        authorized: false,
        studentProfileId: 'sp-target-other',
        targetUserId: 'user-other',
      });

      const middleware = requireStudentOrMentor('studentId');
      const req: any = {
        user: {
          id: 'user-1',
          role: 'student',
          email: 'student1@test.com',
          fullName: 'Student 1',
        },
        params: { studentId: 'sp-target-other' },
      };
      const res: any = {};
      let caughtError: any = null;

      await middleware(req, res, (err) => {
        caughtError = err;
      });

      expect(caughtError).toBeDefined();
      expect(caughtError.statusCode || caughtError.status).toBe(403);
      expect(caughtError.message).toContain('Access denied');
    });

    it('should allow student accessing own data and normalize param to canonical studentProfileId', async () => {
      vi.spyOn(IdentityService, 'isAuthorizedForStudent').mockResolvedValue({
        authorized: true,
        studentProfileId: 'sp-canonical-1',
        targetUserId: 'user-1',
      });

      const middleware = requireStudentOrMentor('studentId');
      const req: any = {
        user: {
          id: 'user-1',
          role: 'student',
          email: 'student1@test.com',
          fullName: 'Student 1',
        },
        params: { studentId: 'user-1' }, // caller passed user_id
      };
      const res: any = {};
      let nextCalled = false;

      await middleware(req, res, (err) => {
        if (!err) nextCalled = true;
      });

      expect(nextCalled).toBe(true);
      // Normalized to canonical studentProfileId
      expect(req.params.studentId).toBe('sp-canonical-1');
      expect(req.studentProfileId).toBe('sp-canonical-1');
    });
  });

  describe('3. Question Answer-Key & Explanation Stripping (Zero Leakage)', () => {
    const fullServerQuestion = {
      id: 'q-test-1',
      curriculumNodeId: 'node-rotational-1',
      questionText: 'A solid cylinder of mass M and radius R rolls without slipping down an incline...',
      questionType: 'single_choice' as const,
      difficultyLevel: 'hard' as const,
      explanation: 'Using conservation of energy, E_total = 1/2 I omega^2 + 1/2 M v^2. Here I = 1/2 M R^2...',
      solutionSteps: [
        'Step 1: Compute moment of inertia I = 1/2 M R^2',
        'Step 2: Relate omega to v via no-slip condition v = omega * R',
        'Step 3: Solve for acceleration a = 2/3 g sin(theta)',
      ],
      hints: ['Consider both translational and rotational kinetic energy'],
      options: [
        { id: 'opt-1', optionKey: 'A', optionText: '2/3 g sin(theta)', isCorrect: true, is_correct: true },
        { id: 'opt-2', optionKey: 'B', optionText: '1/2 g sin(theta)', isCorrect: false, is_correct: false },
        { id: 'opt-3', optionKey: 'C', optionText: '5/7 g sin(theta)', isCorrect: false, is_correct: false },
        { id: 'opt-4', optionKey: 'D', optionText: 'g sin(theta)', isCorrect: false, is_correct: false },
      ],
    };

    it('sanitizeQuestionForClient should strip isCorrect and is_correct from all options', () => {
      const sanitized = sanitizeQuestionForClient(fullServerQuestion);

      expect(sanitized.options).toBeDefined();
      expect(sanitized.options!.length).toBe(4);
      for (const opt of sanitized.options!) {
        expect(opt.isCorrect).toBeUndefined();
        expect((opt as any).is_correct).toBeUndefined();
        expect(opt.id).toBeDefined();
        expect(opt.optionKey).toBeDefined();
        expect(opt.optionText).toBeDefined();
      }
    });

    it('sanitizeQuestionForClient should strip explanation, solutionSteps, and hints', () => {
      const sanitized = sanitizeQuestionForClient(fullServerQuestion);

      expect(sanitized.explanation).toBeUndefined();
      expect(sanitized.solutionSteps).toBeUndefined();
      expect(sanitized.hints).toBeUndefined();
    });

    it('sanitized question should preserve essential metadata for student test taking', () => {
      const sanitized = sanitizeQuestionForClient(fullServerQuestion);

      expect(sanitized.id).toBe('q-test-1');
      expect(sanitized.curriculumNodeId).toBe('node-rotational-1');
      expect(sanitized.questionText).toBe(fullServerQuestion.questionText);
      expect(sanitized.questionType).toBe('single_choice');
      expect(sanitized.difficultyLevel).toBe('hard');
    });
  });

  describe('4. Mock AI Production Guardrail', () => {
    it('ModelRouter in production mode should NEVER use mock as primary or fallback', async () => {
      const originalEnv = process.env.NODE_ENV;
      const originalMode = process.env.APP_MODE;
      try {
        process.env.NODE_ENV = 'production';
        process.env.APP_MODE = 'production';

        const prodRouter = new ModelRouter({
          primaryProvider: 'gemini',
          fallbackProviders: ['groq'],
        });

        prodRouter.registerProvider({
          name: 'gemini',
          supportsTask: () => true,
          supportsVision: () => true,
          complete: async () => {
            throw new Error('Gemini upstream quota exceeded');
          },
        });
        prodRouter.registerProvider({
          name: 'groq',
          supportsTask: () => true,
          supportsVision: () => true,
          complete: async () => {
            throw new Error('Groq upstream rate limited');
          },
        });

        const failingRequest = {
          taskType: 'tutor_socratic' as const,
          messages: [{ role: 'user' as const, content: 'Test question' }],
        };

        // When all providers fail in production, should throw AiServiceUnavailableError and NEVER mock
        await expect(prodRouter.route(failingRequest)).rejects.toThrow(AiServiceUnavailableError);
      } finally {
        process.env.NODE_ENV = originalEnv;
        process.env.APP_MODE = originalMode;
      }
    });
  });

  describe('5. CORS Origin Enforcement', () => {
    const app = createApp();

    it('should reject unauthorized cross-origin requests in strict origin mode', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'https://malicious-attacker-site.com');

      if (res.headers['access-control-allow-origin']) {
        expect(res.headers['access-control-allow-origin']).not.toBe('https://malicious-attacker-site.com');
      }
    });
  });

  describe('6. Canonical Identity & Parameter Spoofing Attack', () => {
    const studentUserA: AuthenticatedUser = {
      id: 'aaaa1111-1111-1111-1111-111111111111',
      email: 'studentA@test.com',
      role: 'student',
      fullName: 'Student A',
    };
    const studentUserB: AuthenticatedUser = {
      id: 'bbbb2222-2222-2222-2222-222222222222',
      email: 'studentB@test.com',
      role: 'student',
      fullName: 'Student B',
    };

    it('User A must resolve to Student Profile A, User B to Student Profile B, and cross-resolution must fail', async () => {
      vi.spyOn(IdentityService, 'getStudentProfileIdForUser').mockImplementation(async (userId: string) => {
        if (userId === studentUserA.id) return 'profile-A';
        if (userId === studentUserB.id) return 'profile-B';
        throw new Error('Not found');
      });
      vi.spyOn(IdentityService, 'resolveStudentProfileId').mockImplementation(async (id: string) => id);
      vi.spyOn(IdentityService, 'getUserIdForStudentProfile').mockImplementation(async (profileId: string) => {
        if (profileId === 'profile-A') return studentUserA.id;
        if (profileId === 'profile-B') return studentUserB.id;
        throw new Error('Not found');
      });

      const profA = await IdentityService.getStudentProfileIdForUser(studentUserA.id);
      const profB = await IdentityService.getStudentProfileIdForUser(studentUserB.id);

      expect(profA).toBe('profile-A');
      expect(profB).toBe('profile-B');
      expect(profA).not.toBe(profB);

      // Student A attempting to access Student Profile B must throw
      await expect(IdentityService.isAuthorizedForStudent(studentUserA, profB)).rejects.toThrow(/Access denied/);
      // Student B attempting to access Student Profile A must throw
      await expect(IdentityService.isAuthorizedForStudent(studentUserB, profA)).rejects.toThrow(/Access denied/);
    });

    it('requireStudentOrMentor middleware must deny access when Student A spoofs Student B in req.body', async () => {
      vi.spyOn(IdentityService, 'isAuthorizedForStudent').mockResolvedValue({
        authorized: false,
        studentProfileId: 'profile-B',
        targetUserId: studentUserB.id,
      });

      const middleware = requireStudentOrMentor('studentId');
      const req: any = {
        user: studentUserA,
        body: { studentId: 'profile-B' },
        params: {},
        query: {},
      };
      let caughtError: any = null;
      await middleware(req, {} as any, (err) => {
        caughtError = err;
      });

      expect(caughtError).toBeDefined();
      expect(caughtError.statusCode || caughtError.status).toBe(403);
    });

    it('requireStudentOrMentor middleware must deny access when Student A spoofs Student B in req.query', async () => {
      vi.spyOn(IdentityService, 'isAuthorizedForStudent').mockResolvedValue({
        authorized: false,
        studentProfileId: 'profile-B',
        targetUserId: studentUserB.id,
      });

      const middleware = requireStudentOrMentor('studentId');
      const req: any = {
        user: studentUserA,
        query: { studentId: 'profile-B' },
        params: {},
        body: {},
      };
      let caughtError: any = null;
      await middleware(req, {} as any, (err) => {
        caughtError = err;
      });

      expect(caughtError).toBeDefined();
      expect(caughtError.statusCode || caughtError.status).toBe(403);
    });

    it('Spoofed identity headers (e.g. x-student-id) must NOT override req.user identity', async () => {
      // The authentication layer uses signed JWTs / Supabase auth, never arbitrary headers
      const middleware = requireStudentOrMentor('studentId');
      const req: any = {
        user: studentUserA,
        headers: { 'x-student-id': 'profile-B' },
        params: {},
        query: {},
        body: {},
      };
      vi.spyOn(IdentityService, 'getStudentProfileIdForUser').mockResolvedValue('profile-A');

      let nextCalled = false;
      await middleware(req, {} as any, (err) => {
        if (!err) nextCalled = true;
      });

      expect(nextCalled).toBe(true);
      // Resolved to student A's own profile, completely ignoring x-student-id header
      expect(req.studentProfileId).toBe('profile-A');
    });
  });

  describe('7. Parent & Teacher Linked vs Unlinked Access', () => {
    const parentUser: AuthenticatedUser = {
      id: 'pppp1111-1111-1111-1111-111111111111',
      email: 'parent@test.com',
      role: 'parent',
      fullName: 'Parent User',
    };
    const teacherUser: AuthenticatedUser = {
      id: 'tttt1111-1111-1111-1111-111111111111',
      email: 'teacher@test.com',
      role: 'teacher',
      fullName: 'Teacher User',
    };

    it('Authorized parent with approved link must succeed', async () => {
      vi.spyOn(IdentityService, 'resolveStudentProfileId').mockResolvedValue('sp-child-1');
      vi.spyOn(IdentityService, 'getUserIdForStudentProfile').mockResolvedValue('user-child-1');
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: () => ({
          eq: () => ({
            eq: () => ({
              eq: () => ({
                maybeSingle: async () => ({ data: { id: 'link-1' } }),
              }),
            }),
          }),
        }),
      } as any);

      const result = await IdentityService.isAuthorizedForStudent(parentUser, 'sp-child-1');
      expect(result.authorized).toBe(true);
    });

    it('Unlinked parent must be denied with 403', async () => {
      vi.spyOn(IdentityService, 'resolveStudentProfileId').mockResolvedValue('sp-stranger-1');
      vi.spyOn(IdentityService, 'getUserIdForStudentProfile').mockResolvedValue('user-stranger-1');
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: () => ({
          eq: () => ({
            eq: () => ({
              eq: () => ({
                maybeSingle: async () => ({ data: null }),
              }),
            }),
          }),
        }),
      } as any);

      await expect(IdentityService.isAuthorizedForStudent(parentUser, 'sp-stranger-1')).rejects.toThrow(
        /Access denied/
      );
    });

    it('Authorized teacher with approved link must succeed', async () => {
      vi.spyOn(IdentityService, 'resolveStudentProfileId').mockResolvedValue('sp-student-1');
      vi.spyOn(IdentityService, 'getUserIdForStudentProfile').mockResolvedValue('user-student-1');
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: () => ({
          eq: () => ({
            eq: () => ({
              eq: () => ({
                maybeSingle: async () => ({ data: { id: 'link-2' } }),
              }),
            }),
          }),
        }),
      } as any);

      const result = await IdentityService.isAuthorizedForStudent(teacherUser, 'sp-student-1');
      expect(result.authorized).toBe(true);
    });

    it('Unlinked teacher must be denied with 403', async () => {
      vi.spyOn(IdentityService, 'resolveStudentProfileId').mockResolvedValue('sp-unlinked-1');
      vi.spyOn(IdentityService, 'getUserIdForStudentProfile').mockResolvedValue('user-unlinked-1');
      vi.spyOn(supabase, 'from').mockReturnValue({
        select: () => ({
          eq: () => ({
            eq: () => ({
              eq: () => ({
                maybeSingle: async () => ({ data: null }),
              }),
            }),
          }),
        }),
      } as any);

      await expect(IdentityService.isAuthorizedForStudent(teacherUser, 'sp-unlinked-1')).rejects.toThrow(
        /Access denied/
      );
    });
  });

  describe('8. Recursive Question Answer-Key & Metadata Leakage Attack', () => {
    function recursivelyFindForbiddenKeys(obj: any, forbidden: string[]): string[] {
      const found: string[] = [];
      function recurse(current: any, path: string) {
        if (!current || typeof current !== 'object') return;
        if (Array.isArray(current)) {
          current.forEach((item, idx) => recurse(item, `${path}[${idx}]`));
          return;
        }
        for (const [key, value] of Object.entries(current)) {
          const currentPath = path ? `${path}.${key}` : key;
          if (forbidden.some((f) => key.toLowerCase() === f.toLowerCase())) {
            found.push(currentPath);
          }
          recurse(value, currentPath);
        }
      }
      recurse(obj, '');
      return found;
    }

    const forbiddenSensitiveKeys = [
      'is_correct',
      'isCorrect',
      'correct_answer',
      'correctAnswer',
      'solution',
      'solution_steps',
      'solutionSteps',
      'explanation',
      'hint',
      'hints',
    ];

    it('sanitized question must have ZERO forbidden answer/explanation keys anywhere in its tree', () => {
      const complexServerQuestion = {
        id: 'q-leak-test',
        curriculumNodeId: 'node-complex',
        questionText: 'Evaluate the limit as x approaches 0 of sin(x)/x.',
        questionType: 'single_choice',
        difficultyLevel: 'medium',
        explanation: 'By LHospitals rule or Taylor series, limit is 1.',
        solutionSteps: ['Expand sin(x) = x - x^3/6 + ...', 'Divide by x: 1 - x^2/6 + ...', 'As x->0, limit is 1.'],
        hints: ['Use standard Taylor expansion or standard limits theorem.'],
        options: [
          { id: 'opt-1', optionKey: 'A', optionText: '1', isCorrect: true, is_correct: true },
          { id: 'opt-2', optionKey: 'B', optionText: '0', isCorrect: false, is_correct: false },
          { id: 'opt-3', optionKey: 'C', optionText: 'Infinity', isCorrect: false, is_correct: false },
          { id: 'opt-4', optionKey: 'D', optionText: 'Undefined', isCorrect: false, is_correct: false },
        ],
      };

      const sanitized = sanitizeQuestionForClient(complexServerQuestion);
      const leakedKeys = recursivelyFindForbiddenKeys(sanitized, forbiddenSensitiveKeys);

      expect(leakedKeys).toEqual([]);
      expect(sanitized.options).toHaveLength(4);
      expect(sanitized.options[0].optionKey).toBe('A');
      expect(sanitized.options[0].isCorrect).toBeUndefined();
      expect(sanitized.options[0].is_correct).toBeUndefined();
    });
  });

  describe('9. Production AI Configuration Guardrail', () => {
    it('AI_PROVIDER_PRIMARY=mock must be rejected in production mode schema validation', async () => {
      const { envSchema } = await import('../config/env');
      const testEnv = {
        NODE_ENV: 'production',
        PORT: 4000,
        API_PREFIX: '/api/v1',
        CORS_ORIGIN: 'http://localhost:3000',
        SUPABASE_URL: 'https://test.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-key-123',
        SUPABASE_ANON_KEY: 'test-anon-key-123',
        AI_PROVIDER_PRIMARY: 'mock', // ILLEGAL in production
      };

      const parsed = envSchema.safeParse(testEnv);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        const primaryError = parsed.error.issues.find((issue) =>
          issue.path.includes('AI_PROVIDER_PRIMARY')
        );
        expect(primaryError).toBeDefined();
        expect(primaryError?.message).toContain('AI_PROVIDER_PRIMARY cannot be set to "mock" in production');
      }
    });
  });

  describe('10. File Upload MIME Security Whitelist', () => {
    it('should reject executable or script MIME types in createUploadUrlSchema', async () => {
      const { createUploadUrlSchema } = await import('../modules/files/file.schema');

      const dangerousInputs = [
        { fileName: 'malware.exe', mimeType: 'application/x-msdownload', sizeBytes: 1024 },
        { fileName: 'script.js', mimeType: 'application/javascript', sizeBytes: 1024 },
        { fileName: 'payload.sh', mimeType: 'application/x-sh', sizeBytes: 1024 },
        { fileName: 'exploit.html', mimeType: 'text/html', sizeBytes: 1024 },
      ];

      for (const dangerous of dangerousInputs) {
        const result = createUploadUrlSchema.safeParse(dangerous);
        expect(result.success).toBe(false);
      }
    });

    it('should accept valid academic document and image MIME types', async () => {
      const { createUploadUrlSchema } = await import('../modules/files/file.schema');

      const validInputs = [
        { fileName: 'physics_notes.pdf', mimeType: 'application/pdf', sizeBytes: 2048 },
        { fileName: 'diagram.png', mimeType: 'image/png', sizeBytes: 1024 },
        { fileName: 'graph.webp', mimeType: 'image/webp', sizeBytes: 1024 },
        { fileName: 'formula.txt', mimeType: 'text/plain', sizeBytes: 512 },
      ];

      for (const valid of validInputs) {
        const result = createUploadUrlSchema.safeParse(valid);
        expect(result.success).toBe(true);
      }
    });
  });
});

