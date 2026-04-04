import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/config';

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // 認証不要パス
  const publicPaths = ['/auth', '/api/auth'];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // 未認証 → ログインページへ
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // オンボーディング未完了（Google新規ユーザー）→ オンボーディングへ
  if (session.user.needsOnboarding && !pathname.startsWith('/auth/onboarding')) {
    return NextResponse.redirect(new URL('/auth/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
