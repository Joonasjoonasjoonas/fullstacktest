import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Log request
  console.log('Middleware handling:', request.method, request.nextUrl.pathname);
  
  const response = NextResponse.next();
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Origin', '*');
  
  return response;
}

// Be more specific with the matcher
export const config = {
  matcher: [
    '/api/customers/:path*',
  ],
}; 