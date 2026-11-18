import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { api, ApiError } from '../services/api';
import { getAuthToken, setAuthToken, removeAuthToken, getGuestToken } from '../lib/utils';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  const fetchCurrentUser = useCallback(async () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await api.get<User>('/auth/me');
      setUser(userData);
    } catch {
      removeAuthToken();
      setTokenState(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const mergeGuestCart = async () => {
    try {
      const guestToken = getGuestToken();
      if (guestToken) {
        await api.post('/cart/merge', { guest_token: guestToken });
      }
    } catch {
      // Ignore cart merge errors
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<{ access_token: string; user: User }>('/auth/login', {
        email,
        password,
      });
      setAuthToken(res.access_token);
      setTokenState(res.access_token);
      setUser(res.user);
      await mergeGuestCart();
      success('Welcome back', `Signed in as ${res.user.full_name}`);
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Failed to sign in';
      error('Authentication Error', msg);
      throw err;
    }
  };

  const register = async (fullName: string, email: string, password: string, phone?: string) => {
    try {
      const res = await api.post<{ access_token: string; user: User }>('/auth/register', {
        full_name: fullName,
        email,
        password,
        phone,
      });
      setAuthToken(res.access_token);
      setTokenState(res.access_token);
      setUser(res.user);
      await mergeGuestCart();
      success('Account created', `Welcome to MAPPLE, ${res.user.full_name}`);
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Registration failed';
      error('Registration Error', msg);
      throw err;
    }
  };

  const logout = () => {
    removeAuthToken();
    setTokenState(null);
    setUser(null);
    success('Signed out', 'You have been securely signed out.');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
