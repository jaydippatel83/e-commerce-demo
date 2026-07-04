// src/hooks/useOrder.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../api/order";

// Current user's orders
export function useMyOrders() {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: orderApi.getMyOrders,
  });
}

// All orders (admin)
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getOrders,
  });
}

// Create an order
export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-orders"] }),
  });
}

// Update order status (admin)
export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => orderApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
