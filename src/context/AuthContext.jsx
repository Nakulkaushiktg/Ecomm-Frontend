import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user_info") || "null");
    } catch {
      return null;
    }
  });

  const save = (data) => {
    localStorage.setItem("user_token", data.access_token);
    localStorage.setItem("user_info", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    save(data);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/api/auth/register", payload);
    save(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_info");
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/api/auth/me", payload);
    localStorage.setItem("user_info", JSON.stringify(data));
    setUser(data);
    return data;
  };

  // set the user from a server response (e.g. after claiming a gift)
  const applyUser = (data) => {
    localStorage.setItem("user_info", JSON.stringify(data));
    setUser(data);
  };

  // refresh profile from server on load if logged in (keeps saved address fresh)
  useEffect(() => {
    if (!localStorage.getItem("user_token")) return;
    api
      .get("/api/auth/me")
      .then((r) => {
        localStorage.setItem("user_info", JSON.stringify(r.data));
        setUser(r.data);
      })
      .catch((e) => {
        if (e.response?.status === 401) logout();
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthed: !!user, login, register, logout, updateProfile, applyUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
