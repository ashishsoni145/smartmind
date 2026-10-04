'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from './auth-context';

interface UseProtectedRouteOptions {
  requireAuth?: boolean; // If true, redirect to login when unauthenticated. If false, redirect to app when authenticated.
  redirectTo?: string;
}

export function useProtectedRoute({
  requireAuth = true,
  redirectTo,
}: UseProtectedRouteOptions = {}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      const currentFullUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      const target = redirectTo || `/login?redirectTo=${encodeURIComponent(currentFullUrl)}`;
      router.replace(target);
    } else if (!requireAuth && isAuthenticated) {
      const redirectParam = searchParams?.get('redirectTo');
      const target = redirectTo || (redirectParam ? decodeURIComponent(redirectParam) : '/app');
      router.replace(target);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router, pathname, searchParams]);

  return { isAuthenticated, isLoading, user };
}
