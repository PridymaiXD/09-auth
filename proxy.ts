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

  const isPublicRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isPrivateRoute = pathname.startsWith('/notes') || pathname.startsWith('/profile');

  if (isAuth && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuth && isPrivateRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const matcher = [
  '/login',
  '/register',
  '/profile/:path*',
  '/notes/:path*',
];