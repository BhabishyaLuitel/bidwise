import { createContext, useContext, ReactNode } from 'react';
import { User, AuthContextType, Role, Permission } from '../types';
import { authApi } from '../lib/api/endpoints';
import { useUserStore } from '../stores/userStore';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    loading,
    error,
    signIn: storeSignIn,
    signUp: storeSignUp,
    signOut: storeSignOut,
    hasPermission,
    setLoading,
    setError,
  } = useUserStore();

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(email, password);
      const { data } = response.data;
      const { token, user: userData } = data;
      storeSignIn(userData, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string, role: Role = 'buyer') => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register({ email, password, username, role });
      const { data } = response.data;
      const { token, user: userData } = data;
      storeSignUp(userData, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    storeSignOut();
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual profile update
      // This will be implemented when we add the profile update API endpoint
      setError('Profile update not implemented yet');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: Role) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual role update
      // This will be implemented when we add the role update API endpoint
      setError('Role update not implemented yet');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, 
      signUp, 
      signOut, 
      loading, 
      error,
      updateProfile,
      updateUserRole,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}