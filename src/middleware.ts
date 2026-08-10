import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cross-domain cookies (Render -> Vercel) cannot be read by Vercel's server-side middleware.
  // Authentication is handled strictly on the client side by ProtectedRoute.tsx using Zustand.
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login', '/register'],
};
