import { Request, Response, NextFunction } from 'express';
import { supabase } from '../db/client';
import { UnauthorizedError } from '../lib/errors';
import { AuthenticatedUser } from '../types/express';

export const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // Fallback to cookie if present
  if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');
    for (const cookie of cookies) {
      const [name, val] = cookie.trim().split('=');
      if (name === 'sb-access-token' || name.endsWith('-auth-token')) {
        try {
          // Some Supabase cookies are JSON encoded tokens
          const decoded = decodeURIComponent(val);
          if (decoded.startsWith('[') || decoded.startsWith('{')) {
            const parsed = JSON.parse(decoded);
            return parsed[0] || parsed.access_token || parsed;
          }
          return decoded;
        } catch {
          return val;
        }
      }
    }
  }

  return null;
};

export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedError('Authentication required. Missing Bearer token.');
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedError('Invalid or expired authentication token.');
    }

    const authUser = data.user;

    // Fetch user profile for role and full name
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url, is_email_verified')
      .eq('id', authUser.id)
      .maybeSingle();

    const user: AuthenticatedUser = {
      id: authUser.id,
      email: authUser.email || '',
      role: (profile?.role as AuthenticatedUser['role']) || 'student',
      fullName: profile?.full_name || authUser.user_metadata?.full_name || '',
      avatarUrl: profile?.avatar_url || authUser.user_metadata?.avatar_url,
      isEmailVerified: profile?.is_email_verified ?? !!authUser.email_confirmed_at,
    };

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next();
    }

    const { data } = await supabase.auth.getUser(token);
    if (data?.user) {
      const authUser = data.user;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name, avatar_url, is_email_verified')
        .eq('id', authUser.id)
        .maybeSingle();

      req.user = {
        id: authUser.id,
        email: authUser.email || '',
        role: (profile?.role as AuthenticatedUser['role']) || 'student',
        fullName: profile?.full_name || authUser.user_metadata?.full_name || '',
        avatarUrl: profile?.avatar_url || authUser.user_metadata?.avatar_url,
        isEmailVerified: profile?.is_email_verified ?? !!authUser.email_confirmed_at,
      };
    }
    next();
  } catch {
    // In optional auth, do not fail on bad token; proceed as anonymous
    next();
  }
};
