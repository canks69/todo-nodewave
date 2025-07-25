import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  hydrate: () => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  hydrate: () => {
    if (typeof window !== 'undefined') {
      const user = getStoredUser();
      const token = Cookies.get('access-token') || null;
      set({ user, token });
    }
  },

  setAuth: (user: User, token: string) => {
    Cookies.set('access-token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      token,
    });
  },
  clearAuth: () => {
    Cookies.remove('access-token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
    });
  },
}));