// src/hooks/useProduct.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api/product";

// List all products
export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: productApi.getProducts,
  });
}

// Single product
export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
  });
}

// Create (admin) — refresh the list on success
export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

// Update (admin)
export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productApi.updateProduct(id, data),
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", id] });
    },
  });
}

// Delete (admin)
export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
