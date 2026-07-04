// src/api/analytics.js
import { api } from "./client";

export const analyticsApi = {
  // Admin dashboard stats → { users, orders, products, totalSales }
  getAnalytics: () => api.get("/analytics").then((r) => r.data),
};
