import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Check if the path is the sign-in page
  const isSignInPage = path === '/sign-in';
  const isDashboardPage = path === '/';
  
  // Get the token from cookies
  const token = request.cookies.get('access-token')?.value;
  
  // If the user is authenticated (has token) and trying to access sign-in page
  if (token && isSignInPage) {
    // Redirect to the home page
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Handle role-based redirect for dashboard
  if (token && isDashboardPage) {
    try {
      // Decode the JWT token to get user role
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // If user role is 'USER', redirect to /create
      if (payload.role === 'USER') {
        return NextResponse.redirect(new URL('/create', request.url));
      }
    } catch (error) {
      // If token is invalid, continue with the request
      console.error('Invalid token format:', error);
    }
  }
  
  // Continue with the request for all other cases
  return NextResponse.next();
}

// Configure the middleware to only run on specific paths
export const config = {
  matcher: ['/sign-in', '/'],
};