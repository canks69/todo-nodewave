"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-check';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { token, hydrate } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  // Check auth status immediately without waiting for hydration
  const hasToken = isAuthenticated();

  useEffect(() => {
    // If no token detected immediately, redirect
    if (!hasToken) {
      router.replace('/sign-in');
      return;
    }
    
    // Hydrate the store
    hydrate();
    setIsHydrated(true);
  }, [hasToken, hydrate, router]);

  // Double check after hydration
  useEffect(() => {
    if (isHydrated && !token) {
      router.replace('/sign-in');
    }
  }, [isHydrated, token, router]);

  // Show nothing if not authenticated to prevent flash
  if (!hasToken || !isHydrated || !token) {
    return <div style={{ display: 'none' }} />;
  }

  return <>{children}</>;
}
