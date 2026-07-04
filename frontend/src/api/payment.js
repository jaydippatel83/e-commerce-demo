// src/api/payment.js
import { api } from "./client";

export const paymentApi = {
  // Create a Razorpay order on the backend → returns { id, amount, currency, ... }
  createRazorpayOrder: (amount, currency = "INR") =>
    api.post("/payment/order", { amount, currency }).then((r) => r.data),

  // Verify the payment signature after checkout
  verifyPayment: (payload) =>
    api.post("/payment/verify", payload).then((r) => r.data),
};
