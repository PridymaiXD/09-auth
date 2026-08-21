import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from '@/lib/api/serverApi';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  let isAuth = Boolean(accessToken);
  const response = NextResponse.next();

  if (!isAuth && refreshToken) {
    try {
      const sessionRes = await checkSession();
      if (sessionRes && sessionRes.status === 200) {
        isAuth = true;

        const setCookieHeader = sessionRes.headers['set-cookie'];
        if (setCookieHeader) {
          const cookieStrings = Array.isArray(setCookieHeader)
            ? setCookieHeader
            : [setCookieHeader];

          cookieStrings.forEach((cookieStr) => {
            const parsed = parseSetCookie(cookieStr);
            if (parsed && parsed.name) {
              response.cookies.set(parsed as any);
            }
          });
        }
      }
    } catch {
      isAuth = false;
    }
  }

  const isPublicRoute = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  const isPrivateRoute = pathname.startsWith('/notes') || pathname.startsWith('/profile');

  if (isAuth && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

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