import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

export type Role = 'user' | 'admin';

interface AuthUser {
  id: number;
  name: string;
  username: string;
  role: Role;
  nik: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { nik: string; nama: string; username: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'desaconnect_user';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      const { user, token } = response.data;
      
      const authUser: AuthUser = {
        id: user.id,
        name: user.nama,
        username: user.username,
        role: user.role,
        nik: user.nik
      };

      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      localStorage.setItem('desaconnect_token', token);
      
      return { ok: true };
    } catch (error: any) {
      return { 
        ok: false, 
        error: error.response?.data?.message || 'Gagal terhubung ke server' 
      };
    }
  };

  const register = async (data: { nik: string; nama: string; username: string; password: string }) => {
    try {
      await axios.post(`${API_URL}/auth/register`, data);
      return { ok: true };
    } catch (error: any) {
      return { 
        ok: false, 
        error: error.response?.data?.message || 'Gagal mendaftar' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('desaconnect_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
