import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public routes that don't require authentication
  const publicRoutes = ['/sign-in', '/sign-up'];
  const isPublicRoute = publicRoutes.includes(path);
  
  // Get the token from cookies
  const token = request.cookies.get('access-token')?.value;
  
  // If user is trying to access a public route and is already authenticated
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If user is trying to access a protected route without token
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
  
  // Handle role-based redirect for dashboard (only if authenticated)
  if (token && path === '/') {
    try {
      // Decode the JWT token to get user role
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // If user role is 'USER', redirect to /create
      if (payload.role === 'USER') {
        return NextResponse.redirect(new URL('/create', request.url));
      }
    } catch (error) {
      // If token is invalid, redirect to sign-in
      console.error('Invalid token format:', error);
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
  
  // Continue with the request for all other cases
  return NextResponse.next();
}

// Configure the middleware to run on all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};