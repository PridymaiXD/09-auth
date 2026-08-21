import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkSession } from '@/lib/api/serverApi';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuth = Boolean(accessToken);
  let response = NextResponse.next();

  if (!isAuth && refreshToken) {
    try {
      const sessionRes = await checkSession();
      if (sessionRes && sessionRes.status === 200) {
        isAuth = true;
        const setCookieHeader = sessionRes.headers['set-cookie'];
        if (setCookieHeader) {
          if (Array.isArray(setCookieHeader)) {
            setCookieHeader.forEach((cookie) => response.headers.append('set-cookie', cookie));
          } else {
            response.headers.set('set-cookie', setCookieHeader);
          }
        }
      }
    } catch {
      isAuth = false;
    }
  }

  // Змінено маршрути на /sign-in та /sign-up
  const isPublicRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPrivateRoute = pathname.startsWith('/notes') || pathname.startsWith('/profile');

  if (isAuth && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Редирект на /sign-in
  if (!isAuth && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return response;
}

export const matcher = [
  '/sign-in',
  '/sign-up',
  '/profile/:path*',
  '/notes/:path*',
];