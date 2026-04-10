import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, full_name: string, password: string, confirm_password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: !!localStorage.getItem('access'),
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state.access) {
      authAPI.profile()
        .then(({ data }) => setState((s) => ({ ...s, user: data, isAuthenticated: true })))
        .catch(() => {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          setState({ user: null, access: null, refresh: null, isAuthenticated: false });
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await authAPI.login(email, password);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      setState({ user: data.user, access: data.access, refresh: data.refresh, isAuthenticated: true });
      setError(null);
    } catch (err: any) {
      const msg = err.response?.data?.non_field_errors?.[0] || 'Login failed. Check your credentials.';
      setError(msg);
      throw err;
    }
  };

  const register = async (email: string, full_name: string, password: string, confirm_password: string) => {
    try {
      const { data } = await authAPI.register(email, full_name, password, confirm_password);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      setState({ user: data.user, access: data.access, refresh: data.refresh, isAuthenticated: true });
      setError(null);
    } catch (err: any) {
      const msgs = err.response?.data;
      const firstMsg = msgs ? Object.values(msgs).flat()[0] : 'Registration failed.';
      setError(firstMsg as string);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (state.refresh) await authAPI.logout(state.refresh);
    } finally {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setState({ user: null, access: null, refresh: null, isAuthenticated: false });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, error, clearError: () => setError(null) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
