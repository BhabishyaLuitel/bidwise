import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType, Role, Permission } from '../types';
import { getRolePermissions } from '../lib/permissions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    role: 'buyer',
    permissions: getRolePermissions('buyer'),
    createdAt: new Date('2024-01-01'),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    bio: 'Passionate collector and tech enthusiast',
    location: 'New York, NY',
    phone: '+1 (555) 123-4567',
    totalBids: 45,
    wonAuctions: 12,
    activeListings: 3,
    completedSales: 8,
    rating: 4.8,
    reviewCount: 23,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual authentication
      const mockUser: User = {
        id: '1',
        username: 'johndoe',
        email,
        role: 'buyer',
        permissions: getRolePermissions('buyer'),
        createdAt: new Date(),
      };
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string, role: Role = 'buyer') => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual registration
      const mockUser: User = {
        id: '1',
        username,
        email,
        role,
        permissions: getRolePermissions(role),
        createdAt: new Date(),
      };
      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setError(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Implement actual profile update
      setUser(prev => prev ? { ...prev, ...data } : null);
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
      setUser(prev => {
        if (prev && prev.id === userId) {
          return {
            ...prev,
            role,
            permissions: getRolePermissions(role)
          };
        }
        return prev;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
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