import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await checkSession().catch(() => null);

  const isPrivateKey = privateRoutes.some((route) => pathname.startsWith(route));
  const isPublicKey = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPrivateKey && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicKey && session) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};