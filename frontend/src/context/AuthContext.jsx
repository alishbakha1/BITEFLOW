import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  getCurrentUser,
  updateProfile as apiUpdateProfile,
} from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "biteflow_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount: if a token exists, fetch the current user to restore session
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    getCurrentUser()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { user: loggedInUser, token } = await apiLogin({ email, password });
      localStorage.setItem(TOKEN_KEY, token);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (payload) => {
    setError(null);
    try {
      const { user: newUser, token } = await apiRegister(payload);
      localStorage.setItem(TOKEN_KEY, token);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const updated = await apiUpdateProfile(payload);
    setUser(updated);
    return updated;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}