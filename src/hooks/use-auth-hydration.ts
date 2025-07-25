import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function useAuthHydration() {
  const { user, hydrate } = useAuthStore();
  
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  
  return { user };
}
