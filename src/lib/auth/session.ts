import { auth } from './config';
import { redirect } from 'next/navigation';

/**
 * 認証済みセッションを取得。未認証ならログインページへリダイレクト。
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/login');
  }
  return session;
}

/**
 * セッションを取得（リダイレクトなし）。
 */
export async function getSession() {
  return auth();
}
