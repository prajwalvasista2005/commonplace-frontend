import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import api, { getErrorMessage } from '../api/axios';

export const AuthContext = createContext(null);

const fetchProfile = async () => {
  try {
    const { data } = await api.get('/users/me');
    return data;
  } catch {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const decoded = jwtDecode(token);
    const userId = decoded.sub ?? decoded.user_id ?? decoded.id;
    if (!userId) {
      throw new Error('Invalid token');
    }

    const { data } = await api.get(`/users/${userId}`);
    return data;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  }, []);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await fetchProfile();
      setUser(profile);
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const handleLogout = () => clearSession();
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [clearSession]);

  const login = useCallback(async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const { data } = await api.post('/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    const profile = await fetchProfile();
    setUser(profile);
    return profile;
  }, []);

  const register = useCallback(async (email, password, username) => {
    await api.post('/users/', { email, password, username });
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    try {
      if (refreshToken) {
        await api.post('/logout', { refresh_token: refreshToken });
      }
    } catch {
      // Clear local session even if server logout fails
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser: loadUser,
      getErrorMessage,
    }),
    [user, loading, login, register, logout, loadUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
