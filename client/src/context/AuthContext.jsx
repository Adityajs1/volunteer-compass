import { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi, loginApi, registerApi } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getMeApi();
          setUser(res.data.user);
        } catch (error) {
          console.error("Auth failed on load", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi(email, password);
    const { user: userData, token } = res.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const res = await registerApi(data);
    const { user: userData, token } = res.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('vc_page');
    setUser(null);
    // Dispatch a custom event so the SPA router can handle navigation
    window.dispatchEvent(new CustomEvent('vc:navigate', { detail: { page: 'login' } }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
