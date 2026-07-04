// src/api/auth.js
import { api } from "./client";

export const authApi = {
  register: (data) =>
    api.post("/auth/register", data).then((r) => r.data),

  login: (data) =>
    api.post("/auth/login", data).then((r) => r.data),

  verifyOTP: (data) =>
    api.post("/auth/verify-otp", data).then((r) => r.data),

  getUsers: () =>
    api.get("/auth/users").then((r) => r.data),

  getUserProfile: (id) =>
    api.get(`/auth/user/${id}`).then((r) => r.data),
};
