import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { authService } from "../services/authService";
import { storage } from "../utils/storage";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(storage.getToken());
  const [user, setUser] = useState(storage.getUser());
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token);
  const role = user?.role || null;

  const fetchMe = useCallback(async () => {
    const data = await authService.getMe();
    const currentUser = data?.user || data?.data || data;

    storage.setUser(currentUser);
    setUser(currentUser);

    return currentUser;
  }, []);

  const normalizeAuthResponse = useCallback(
    async (response) => {
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

      return fetchMe();
    },
    [fetchMe]
  );

  const register = useCallback(
    async (payload) => {
      const response = await authService.register(payload);
      await normalizeAuthResponse(response);
      return response;
    },
    [normalizeAuthResponse]
  );

  const login = useCallback(
    async (payload) => {
      const response = await authService.login(payload);
      await normalizeAuthResponse(response);
      return response;
    },
    [normalizeAuthResponse]
  );

  const logout = useCallback(async () => {
    try {
      if (storage.getToken()) {
        await authService.logout();
      }
    } finally {
      storage.clearAuth();
      setToken(null);
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(
    async (formData) => {
      const data = await authService.updateProfile(formData);
      const updatedUser = data?.user || data?.data || data;

      if (updatedUser) {
        storage.setUser(updatedUser);
        setUser(updatedUser);
      } else {
        await fetchMe();
      }

      return data;
    },
    [fetchMe]
  );

  useEffect(() => {
    const init = async () => {
      try {
        if (storage.getToken()) {
          await fetchMe();
        }
      } catch {
        storage.clearAuth();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [fetchMe]);

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
    [token, user, role, loading, isAuthenticated, register, login, logout, fetchMe, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
