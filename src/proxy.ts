import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|xml|woff2?|ttf|eot)$/i.test(
      pathname,
    )
  ) {
    return NextResponse.next();
  }

  const session = await auth();
  const protectedRoutes = ['/profile', '/projects', '/admin'];

  if (protectedRoutes.some((p) => pathname.startsWith(p)) && !session) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|txt|xml|woff2?|ttf|eot)$).*)',
  ],
};
