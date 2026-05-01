import React from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { http } from "../api/http.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("quizmaster_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("quizmaster_token"));

  const persistSession = ({ user: nextUser, token: nextToken }) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem("quizmaster_user", JSON.stringify(nextUser));
    localStorage.setItem("quizmaster_token", nextToken);
  };

  const login = async (payload) => {
    const { data } = await http.post("/auth/login", payload);
    persistSession(data);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await http.post("/auth/register", payload);
    console.log("LOGIN DATA 👉", data);
    persistSession(data);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("quizmaster_user");
    localStorage.removeItem("quizmaster_token");
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, register, logout }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
