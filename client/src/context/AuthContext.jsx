import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("smartHomeUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("smartHomeToken"));

  const persist = (payload) => {
    localStorage.setItem("smartHomeToken", payload.token);
    localStorage.setItem("smartHomeUser", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    persist(data);
    return data.user;
  };

  const register = async (values) => {
    const { data } = await api.post("/auth/register", values);
    persist(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("smartHomeToken");
    localStorage.removeItem("smartHomeUser");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, login, register, logout, isAuthenticated: Boolean(token) }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
