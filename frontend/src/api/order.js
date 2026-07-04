// src/api/order.js
import { api } from "./client";

export const orderApi = {
  // Create an order after a successful payment
  createOrder: (data) => api.post("/orders", data).then((r) => r.data),

  // Current user's orders
  getMyOrders: () => api.get("/orders/my-orders").then((r) => r.data),

  // All orders (admin)
  getOrders: () => api.get("/orders").then((r) => r.data),

  // Single order — backend route is GET /orders/:id/status
  getOrder: (id) => api.get(`/orders/${id}/status`).then((r) => r.data),

  // Update status (admin) — PUT /orders/:id/status
  updateStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { status }).then((r) => r.data),

  // Delete (admin) — DELETE /orders/:id/status
  deleteOrder: (id) =>
    api.delete(`/orders/${id}/status`).then((r) => r.data),
};
