// src/api/client.js
import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/authSlice";

// Priority: explicit env var → relative same-origin in production
// (backend serves the build) → localhost in local dev.
const baseURL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "/api/v1"
    : "http://localhost:5000/api/v1");

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — auto logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(err);
  }
);
