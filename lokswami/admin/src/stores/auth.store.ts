import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem('adminToken', token);
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('adminToken');
      }
    }),
    {
      name: 'lokswami-auth'
    }
  )
);

// Helper to get token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('adminToken');
};