import { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { storage } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(storage.getToken());
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!token;
  const role = user?.role || null;

  const normalizeAuthResponse = async (response) => {
    const receivedToken = response?.token || response?.access_token || null;
    const receivedUser = response?.user || null;

    if (receivedToken) {
      storage.setToken(receivedToken);
      setToken(receivedToken);
    }

    if (receivedUser) {
      storage.setUser(receivedUser);
      setUser(receivedUser);
      return receivedUser;
    }

    return await fetchMe();
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    await normalizeAuthResponse(response);
    return response;
  };

  const login = async (payload) => {
    const response = await authService.login(payload);
    await normalizeAuthResponse(response);
    return response;
  };

  const logout = async () => {
    try {
      if (storage.getToken()) {
        await authService.logout();
      }
    } catch (error) {
      // on nettoie quand même le front
    } finally {
      storage.clearAuth();
      setToken(null);
      setUser(null);
    }
  };

  const fetchMe = async () => {
    const data = await authService.getMe();
    const currentUser = data?.user || data?.data || data;

    storage.setUser(currentUser);
    setUser(currentUser);

    return currentUser;
  };

  const updateProfile = async (formData) => {
    const data = await authService.updateProfile(formData);
    const updatedUser = data?.user || data?.data || data;

    if (updatedUser) {
      storage.setUser(updatedUser);
      setUser(updatedUser);
    } else {
      await fetchMe();
    }

    return data;
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (storage.getToken()) {
          await fetchMe();
        }
      } catch (error) {
        storage.clearAuth();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      role,
      loading,
      isAuthenticated,
      register,
      login,
      logout,
      fetchMe,
      updateProfile,
    }),
    [token, user, role, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
