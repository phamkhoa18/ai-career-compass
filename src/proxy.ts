import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin and /api/admin routes except logins
  const isApiRoute = pathname.startsWith('/api/admin');
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

  if ((isAdminRoute || isApiRoute) && pathname !== '/api/admin/login') {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      if (isApiRoute) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      if (isApiRoute) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // Prevent accessing login page if already logged in
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
