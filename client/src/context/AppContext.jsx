import { createContext, useContext, useState, useEffect } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';

// ─── THEME ───────────────────────────────────────────────────────────────────
const ThemeCtx = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('hms-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hms-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);

// ─── AUTH ────────────────────────────────────────────────────────────────────
const AuthCtx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser, clearUser] = useSessionStorage('hms-user', null);

  const login = (userData) => setUser(userData);
  const logout = () => clearUser();

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);