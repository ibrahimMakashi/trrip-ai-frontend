import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as loginApi, register as registerApi, getMe } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const persistUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const clearUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((data) => {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        })
        .catch(() => clearUser())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [clearUser]);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    persistUser(data.user, data.token);
    // Ensure we always have the latest user fields (e.g. avatar)
    try {
      const me = await getMe();
      setUser(me.user);
      localStorage.setItem('user', JSON.stringify(me.user));
    } catch {
      // ignore; interceptor may redirect if token invalid
    }
    return data;
  };

  const register = async (credentials) => {
    const data = await registerApi(credentials);
    persistUser(data.user, data.token);
    try {
      const me = await getMe();
      setUser(me.user);
      localStorage.setItem('user', JSON.stringify(me.user));
    } catch {
      // ignore
    }
    return data;
  };

  const logout = () => {
    clearUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
