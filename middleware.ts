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
  admin: '/dashboard',
  teacher: '/courses',
  student: '/courses',
};

// Routes that require a specific role
const ROLE_ONLY: Record<string, string[]> = {
  '/dashboard': ['admin'],
  '/users': ['admin'],
  '/classes': ['admin'],
  '/progress': ['student'],
};

// Prefix-based role restrictions
const ROLE_ONLY_PREFIXES: Record<string, string[]> = {
  '/courses/': ['teacher', 'student'],
};

// Sub-path restrictions within /courses/[id]/...
const TEACHER_ONLY_SUFFIXES = ['/editor', '/test-editor'];
const STUDENT_ONLY_SUFFIXES = ['/study', '/test', '/progress'];

const PROTECTED_PREFIXES = ['/dashboard', '/users', '/classes', '/courses', '/progress', '/profile'];

function isProtected(pathname: string): boolean {
  if (pathname === '/login' || pathname === '/register') return false;
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) return false;
  return PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const payload = token ? decodeToken(token) : null;

  const isAuthPath = pathname === '/login' || pathname === '/register';

  if (isAuthPath) {
    if (payload) {
      return NextResponse.redirect(new URL(ROLE_DASHBOARDS[payload.role] || '/', request.url));
    }
    return NextResponse.next();
  }

  if (!isProtected(pathname)) return NextResponse.next();

  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = payload.role;

  // Check exact-match role restrictions
  for (const [path, roles] of Object.entries(ROLE_ONLY)) {
    if (pathname === path || pathname.startsWith(path + '/')) {
      if (!roles.includes(role)) {
        return NextResponse.redirect(new URL(ROLE_DASHBOARDS[role], request.url));
      }
    }
  }

  // Check teacher-only course sub-paths
  if (pathname.includes('/courses/')) {
    const isTeacherOnly = TEACHER_ONLY_SUFFIXES.some(s => pathname.includes(s));
    const isStudentOnly = STUDENT_ONLY_SUFFIXES.some(s => pathname.includes(s));
    if (isTeacherOnly && role !== 'teacher') {
      return NextResponse.redirect(new URL(ROLE_DASHBOARDS[role], request.url));
    }
    if (isStudentOnly && role !== 'student') {
      return NextResponse.redirect(new URL(ROLE_DASHBOARDS[role], request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
