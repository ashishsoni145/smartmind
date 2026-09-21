import { supabase } from '../../db/client';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../lib/errors';
import { AuthenticatedUser } from '../../types/express';

/**
 * IdentityService provides the canonical resolution between:
 * auth.users.id / profiles.id  <--->  student_profiles.id
 *
 * Rule:
 * auth.users.id === profiles.id
 * student_profiles.user_id === profiles.id
 * student_profiles.id === academic primary key
 */
export class IdentityService {
  private static profileIdCache = new Map<string, { studentProfileId: string; expiresAt: number }>();
  private static userIdCache = new Map<string, { userId: string; expiresAt: number }>();
  private static readonly TTL_MS = 60000; // 1 minute cache

  /**
   * Resolves the canonical student_profiles.id given a user_id (profiles.id).
   * If a student profile does not yet exist for the user, initializes one idempotently.
   */
  public static async getStudentProfileIdForUser(userId: string): Promise<string> {
    const cached = this.profileIdCache.get(userId);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.studentProfileId;
    }

    const { data: sp, error } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new BadRequestError(`Failed to resolve student profile: ${error.message}`);
    }

    if (sp?.id) {
      this.profileIdCache.set(userId, { studentProfileId: sp.id, expiresAt: Date.now() + this.TTL_MS });
      this.userIdCache.set(sp.id, { userId, expiresAt: Date.now() + this.TTL_MS });
      return sp.id;
    }

    // Auto-initialize student profile if user profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) {
      throw new NotFoundError(`User profile not found for ID: ${userId}`);
    }

    const { data: inserted, error: insertErr } = await supabase
      .from('student_profiles')
      .insert({
        user_id: userId,
        enrolled_subjects: ['physics', 'chemistry', 'mathematics'],
        daily_available_hours: 3.0,
        onboarding_completed: false,
        onboarding_step: 1,
        next_action: 'complete_onboarding',
        knowledge_model_status: 'uncalibrated',
      })
      .select('id')
      .single();

    if (insertErr || !inserted) {
      throw new BadRequestError(`Failed to initialize student profile: ${insertErr?.message}`);
    }

    this.profileIdCache.set(userId, { studentProfileId: inserted.id, expiresAt: Date.now() + this.TTL_MS });
    this.userIdCache.set(inserted.id, { userId, expiresAt: Date.now() + this.TTL_MS });
    return inserted.id;
  }

  /**
   * Resolves the user_id (profiles.id) given a student_profiles.id.
   */
  public static async getUserIdForStudentProfile(studentProfileId: string): Promise<string> {
    const cached = this.userIdCache.get(studentProfileId);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.userId;
    }

    const { data, error } = await supabase
      .from('student_profiles')
      .select('user_id')
      .eq('id', studentProfileId)
      .maybeSingle();

    if (error) {
      throw new BadRequestError(`Failed to resolve user ID for student profile: ${error.message}`);
    }
    if (!data?.user_id) {
      throw new NotFoundError(`Student profile ${studentProfileId} not found`);
    }

    this.userIdCache.set(studentProfileId, { userId: data.user_id, expiresAt: Date.now() + this.TTL_MS });
    this.profileIdCache.set(data.user_id, { studentProfileId, expiresAt: Date.now() + this.TTL_MS });
    return data.user_id;
  }

  /**
   * Resolves canonical studentProfileId from an arbitrary identifier that may be
   * either student_profiles.id OR profiles.id (user_id).
   */
  public static async resolveStudentProfileId(identifier: string): Promise<string> {
    if (!identifier) {
      throw new BadRequestError('Student identifier is required');
    }

    // Check if identifier is already a student_profiles.id
    const { data: byId } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('id', identifier)
      .maybeSingle();

    if (byId?.id) {
      return byId.id;
    }

    // Check if identifier is user_id
    const { data: byUserId } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', identifier)
      .maybeSingle();

    if (byUserId?.id) {
      return byUserId.id;
    }

    throw new NotFoundError(`Student profile could not be resolved from identifier: ${identifier}`);
  }

  /**
   * Verifies if caller has authorized access to a target student profile.
   * Allows:
   * 1. Admins to access any student
   * 2. Students to access ONLY their own profile
   * 3. Parents to access explicitly APPROVED linked students
   * 4. Teachers to access explicitly APPROVED linked students
   */
  public static async isAuthorizedForStudent(
    caller: AuthenticatedUser,
    targetIdentifier: string
  ): Promise<{ authorized: boolean; studentProfileId: string; targetUserId: string }> {
    let studentProfileId: string;
    let targetUserId: string;

    if (targetIdentifier === 'me') {
      if (caller.role !== 'student') {
        throw new ForbiddenError('Only student accounts can use the "me" shortcut for student resources');
      }
      studentProfileId = await this.getStudentProfileIdForUser(caller.id);
      targetUserId = caller.id;
      return { authorized: true, studentProfileId, targetUserId };
    }

    // Resolve studentProfileId and targetUserId
    try {
      studentProfileId = await this.resolveStudentProfileId(targetIdentifier);
      targetUserId = await this.getUserIdForStudentProfile(studentProfileId);
    } catch {
      throw new NotFoundError('Target student profile does not exist');
    }

    // Admin has global authorized access
    if (caller.role === 'admin') {
      return { authorized: true, studentProfileId, targetUserId };
    }

    // Student can only access own profile
    if (caller.role === 'student') {
      const callerStudentProfileId = await this.getStudentProfileIdForUser(caller.id);
      const isSelf = callerStudentProfileId === studentProfileId || caller.id === targetUserId;
      if (!isSelf) {
        throw new ForbiddenError('Access denied: You are not authorized to access another student\'s records');
      }
      return { authorized: true, studentProfileId, targetUserId };
    }

    // Parent must have approved parent-student link
    if (caller.role === 'parent') {
      const { data: link } = await supabase
        .from('parent_student_links')
        .select('id')
        .eq('parent_id', caller.id)
        .eq('student_id', targetUserId)
        .eq('consent_status', 'approved')
        .maybeSingle();

      if (!link) {
        throw new ForbiddenError('Access denied: You do not have an approved parent link for this student');
      }
      return { authorized: true, studentProfileId, targetUserId };
    }

    // Teacher must have approved teacher-student link
    if (caller.role === 'teacher') {
      const { data: link } = await supabase
        .from('teacher_student_links')
        .select('id')
        .eq('teacher_id', caller.id)
        .eq('student_id', targetUserId)
        .eq('consent_status', 'approved')
        .maybeSingle();

      if (!link) {
        throw new ForbiddenError('Access denied: You do not have an approved teacher link for this student');
      }
      return { authorized: true, studentProfileId, targetUserId };
    }

    throw new ForbiddenError('Access denied: Role not authorized for student records');
  }

  /**
   * Clear cache entries (useful for testing or when profiles are updated)
   */
  public static clearCache(): void {
    this.profileIdCache.clear();
    this.userIdCache.clear();
  }
}
