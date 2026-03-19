import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from '@/auth.config';

const publicRoutes = ['/login'];
/** Super-admin only (JWT role check). Client users are sent away from these prefixes. */
const adminOnlyPrefixes = ['/admin', '/view-client'];

/** Paths under `public/` — must not hit auth redirects or <Image> gets HTML instead of bytes */
const staticPublicFile =
  /\.(?:ico|png|jpe?g|gif|webp|svg|avif|woff2?|ttf|eot|txt|xml|webmanifest)$/i;

export const proxy = NextAuth(authConfig).auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (staticPublicFile.test(pathname)) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    if (isLoggedIn) {
      const home =
        role === 'super_admin' ? '/admin' : '/';
      return NextResponse.redirect(new URL(home, req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    adminOnlyPrefixes.some((prefix) => pathname.startsWith(prefix)) &&
    role !== 'super_admin'
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
