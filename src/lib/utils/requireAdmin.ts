import { auth } from '@/lib/auth';

export async function requireAdminSession() {
  const session = await auth();

  if (!session) {
    return { session: null, error: 'Unauthorized: Authentication required' };
  }

  if (session.user.role !== 'admin' || !session.user.isAdmin) {
    return { session: null, error: 'Forbidden: Admin access required' };
  }

  return { session, error: null };
}
