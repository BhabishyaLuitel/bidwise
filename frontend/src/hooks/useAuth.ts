import { useState, useEffect } from 'react';
import api from '../lib/api/config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/user');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/login', { email, password });
    setUser(data.user);
    return data;
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/register', { name, email, password });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
} 