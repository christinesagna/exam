import { createContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storage.getUser());
  const [token, setToken] = useState(storage.getToken());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;
  const role = user?.role || null;

  const login = async (credentials) => {
    const response = await authService.login(credentials);

    // Ajuste ces clés selon la vraie réponse backend
    const receivedToken = response?.token || response?.access_token;
    const receivedUser = response?.user;

    if (receivedToken) {
      storage.setToken(receivedToken);
      setToken(receivedToken);
    }

    if (receivedUser) {
      storage.setUser(receivedUser);
      setUser(receivedUser);
    } else {
      await fetchMe();
    }

    return response;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);

    const receivedToken = response?.token || response?.access_token;
    const receivedUser = response?.user;

    if (receivedToken) {
      storage.setToken(receivedToken);
      setToken(receivedToken);
    }

    if (receivedUser) {
      storage.setUser(receivedUser);
      setUser(receivedUser);
    }

    return response;
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      // Même si l'API échoue, on nettoie le front
    } finally {
      storage.clearAuth();
      setToken(null);
      setUser(null);
    }
  };

  const fetchMe = async () => {
    try {
      const data = await authService.getMe();
      const currentUser = data?.user || data?.data || data;
      storage.setUser(currentUser);
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      storage.clearAuth();
      setUser(null);
      setToken(null);
      throw error;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (storage.getToken()) {
          await fetchMe();
        }
      } catch (error) {
        // géré dans fetchMe
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      fetchMe,
      setUser,
    }),
    [user, token, role, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
