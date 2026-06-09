import axios from "axios";

export const api = axios.create({ baseURL: "/" });

// attach the logged-in customer's token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const rupee = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
