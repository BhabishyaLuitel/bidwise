import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, Permission, User } from '../types';
import api from '../lib/api/config';

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
  signIn: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  signUp: (email: string, password: string, username: string, role: Role) => Promise<void>;
  signOut: () => void;
  hasPermission: (permission: Permission) => boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateUserRole: (userId: string, role: Role) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  refetchUser: () => Promise<void>;
  fetchUsers: () => Promise<User[]>;
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

      signIn: async (email: string, password: string, isAdmin?: boolean) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/login', { 
            email: isAdmin ? 'admin@gmail.com' : email, 
            password: isAdmin ? 'Password@123' : password 
          });
          
          const { user: userData, token } = response.data;
          
          localStorage.setItem('token', token);
          
          set({
            user: {
              ...userData,
              role: userData.role as Role,
              permissions: userData.permissions as Permission[],
              createdAt: new Date(userData.created_at),
            },
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'An error occurred during login',
            loading: false,
          });
          throw err;
        }
      },

      signUp: async (email: string, password: string, username: string, role: Role) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post('/register', {
            email,
            password,
            username,
            role,
            password_confirmation: password
          });
          
          const { user: userData, token } = response.data;
          
          set({
            user: {
              ...userData,
              role: userData.role as Role,
              permissions: userData.permissions as Permission[],
              createdAt: new Date(userData.created_at),
            },
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'An error occurred during registration',
            loading: false,
          });
          throw err;
        }
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
        return user?.permissions?.includes(permission) ?? false;
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          set({ loading: true, error: null });
          const response = await api.put('/users/profile', data);
          const { data: userData } = response.data;
          set({
            user: {
              ...userData,
              role: userData.role as Role,
              permissions: userData.permissions as Permission[],
              createdAt: new Date(userData.created_at),
            },
            loading: false,
            error: null,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'An error occurred while updating profile',
            loading: false,
          });
          throw err;
        }
      },

      updateUserRole: async (userId: string, role: Role) => {
        try {
          set({ loading: true, error: null });
          await api.put(`/users/${userId}/role`, { role });
          await get().refetchUser();
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'An error occurred while updating user role',
            loading: false,
          });
          throw err;
        }
      },

      deleteUser: async (userId: string) => {
        try {
          set({ loading: true, error: null });
          await api.delete(`/users/${userId}`);
          set({ loading: false, error: null });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting user';
          set({
            error: errorMessage,
            loading: false,
          });
          throw err;
        }
      },

      refetchUser: async () => {
        try {
          set({ loading: true, error: null });
          const response = await api.get('/user');
          const userData = response.data;
          set({
            user: {
              ...userData,
              role: userData.role as Role,
              permissions: userData.permissions as Permission[],
              createdAt: new Date(userData.created_at),
            },
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (err) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: err instanceof Error ? err.message : 'An error occurred during authentication check',
          });
          throw err;
        }
      },

      fetchUsers: async () => {
        try {
          set({ loading: true, error: null });
          const response = await api.get('/users');
          const users = response.data.map((userData: any) => ({
            ...userData,
            role: userData.role as Role,
            permissions: userData.permissions as Permission[],
            createdAt: new Date(userData.created_at),
          }));
          set({ loading: false, error: null });
          return users;
        } catch (err) {
          set({
            loading: false,
            error: err instanceof Error ? err.message : 'An error occurred while fetching users',
          });
          throw err;
        }
      },
    }),
    {
      name: 'user-storage',
    }
  )
);