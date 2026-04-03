import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeToken(token: string) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    if (Date.now() > payload.exp) return null;
    return payload as { userId: string; role: string; orgId: string; exp: number };
  } catch {
    return null;
  }
}

const ROLE_DASHBOARDS: Record<string, string> = {
  admin: '/admin/dashboard',
  teacher: '/teacher/courses',
  student: '/student/courses',
};

const ROLE_PREFIXES: Record<string, string> = {
  admin: '/admin',
  teacher: '/teacher',
  student: '/student',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const payload = token ? decodeToken(token) : null;

  const isAuthPath = pathname === '/login' || pathname === '/register';
  const isProtectedPath = Object.values(ROLE_PREFIXES).some((p) =>
    pathname.startsWith(p)
  );

  if (isAuthPath) {
    if (payload) {
      return NextResponse.redirect(
        new URL(ROLE_DASHBOARDS[payload.role] || '/', request.url)
      );
    }
    return NextResponse.next();
  }

  if (isProtectedPath) {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const allowedPrefix = ROLE_PREFIXES[payload.role];
    if (!pathname.startsWith(allowedPrefix)) {
      return NextResponse.redirect(
        new URL(ROLE_DASHBOARDS[payload.role], request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
