import Cookies from 'js-cookie';
import type { NextRequest } from 'next/server';

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = Cookies.get('access-token');
  return !!token;
};

export const getServerAuthStatus = (request?: NextRequest): boolean => {
  if (typeof window !== 'undefined') {
    return isAuthenticated();
  }
  
  // Server side check (for middleware)
  if (request?.cookies?.get) {
    const token = request.cookies.get('access-token')?.value;
    return !!token;
  }
  
  return false;
};
