import { useCallback, useMemo, useState } from "react";
import AuthContext from "../context/AuthContext";
import {
  getCurrentUser,
  getSession,
  loginUser,
  logoutUser,
  registerUser,
} from "../service/authStorage";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());
  const [session, setSession] = useState(() => getSession());

  const login = useCallback(async ({ email, password }) => {
    const result = await loginUser({ email, password });
    if (result.ok) {
      setUser(result.user);
      setSession(getSession());
    }
    return result;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const result = await registerUser({ name, email, password });
    if (result.ok) {
      setUser(result.user);
      setSession(getSession());
    }
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    setSession(null);
  }, []);

  const refresh = useCallback(() => {
    setUser(getCurrentUser());
    setSession(getSession());
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refresh,
    }),
    [login, logout, refresh, register, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
