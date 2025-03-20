import {
  NextResponse,
} from 'next/server';
import type {
  NextRequest,
} from 'next/server';

const protectedPaths = [
  '/welcome',
  '/home',
  '/posts',
  '/write',
];

function included(path: string) {
  for (const p of protectedPaths) {
    if (path.startsWith(p)) {
      return true;
    }
  }

  return false;
}

export function middleware(req: NextRequest) {
  const {
    origin,
    pathname,
    search,
  } = req.nextUrl;
  console.log('[middleware]:', req.method, pathname);

  const token = req.cookies.get('BLOG_TOKEN');

  // protected path
  if ((!token
    || !token.value)
      && included(pathname)) {
    const redirect = encodeURIComponent(`${pathname}${search}`);

    const url = `${origin}/sign-in?redirect=${redirect}`;

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|images|icons|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
