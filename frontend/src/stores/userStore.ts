import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role, Permission } from '../types';
import { api } from '../lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'seller';
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signIn: (user: User, token: string) => void;
  signUp: (user: User, token: string) => void;
  signOut: () => void;
  hasPermission: (permission: Permission) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
        set({ token });
      },
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      signIn: (user, token) => {
        localStorage.setItem('token', token);
        set({
          user: {
            ...user,
            role: user.role as Role,
            permissions: user.permissions as Permission[],
            createdAt: new Date(),
          },
          token,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      },

      signUp: (user, token) => {
        localStorage.setItem('token', token);
        set({
          user: {
            ...user,
            role: user.role as Role,
            permissions: user.permissions as Permission[],
            createdAt: new Date(),
          },
          token,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      },

      signOut: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },

      hasPermission: (permission: Permission): boolean => {
        const { user } = get();
        if (!user) return false;
        return user.permissions.includes(permission);
      },

      login: async (email: string, password: string) => {
        try {
          const response = await api.post('/login', { email, password });
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          set({ user });
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null });
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const response = await api.get('/user');
            set({ user: response.data });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);