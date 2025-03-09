import axios from 'axios';
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('https://9c40-2400-1a00-b060-31ba-d890-7459-3ec6-3cd6.ngrok-free.app/api/login', { email, password });
      const { data } = response;
      const mockUser: User = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        createdAt: new Date(data.user.createdAt),
      };
      setUser(mockUser);
    } catch (err) {
      console.log(err)
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('https://9c40-2400-1a00-b060-31ba-d890-7459-3ec6-3cd6.ngrok-free.app/api/register', { email, password, name: username, role: "buyer" });
      const { data } = response;
      const mockUser: User = {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
        createdAt: new Date(data.user.createdAt),
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

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading, error }}>
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