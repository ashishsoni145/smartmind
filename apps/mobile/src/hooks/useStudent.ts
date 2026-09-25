import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api';
import { useAuth } from '../services/auth';

export function useStudent() {
  const { user } = useAuth();
  const profile = useQuery({
    queryKey: ['student-profile', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => authApi.studentProfile(),
  });
  const me = useQuery({
    queryKey: ['me', user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => authApi.me(),
  });
  const student = (profile.data || (me.data as { studentProfile?: { id?: string } } | null)?.studentProfile) as
    | { id?: string; onboardingCompleted?: boolean; knowledgeModelStatus?: string; enrolledSubjects?: string[]; gradeId?: string; boardId?: string; targetExamGoals?: unknown[] }
    | null
    | undefined;
  return {
    user,
    me: me.data,
    profile: student ?? null,
    studentId: student?.id || user?.id || null,
    loading: profile.isLoading || me.isLoading,
    error: profile.error || me.error,
    refetch: () => Promise.all([profile.refetch(), me.refetch()]),
  };
}
