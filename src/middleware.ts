import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) return NextResponse.next();
  if (['/en', '/es', '/pt'].some(l => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)) return NextResponse.next();
  const accept = request.headers.get('accept-language') ?? '';
  const detected = ['es', 'pt', 'en'].find(l => accept.includes(l)) || 'es';
  const url = request.nextUrl.clone();
  url.pathname = `/${detected}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'] };
