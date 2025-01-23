import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add any global middleware logic here
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: '/api/:path*',
}; 