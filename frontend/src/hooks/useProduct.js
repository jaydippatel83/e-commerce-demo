// src/hooks/useProduct.js
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { productApi } from "../api/product";

// List products (paginated + filterable).
// params: { page, limit, category, keyword, size }
// Returns { products, page, pages, total }.
export function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productApi.getProducts(params),
    placeholderData: keepPreviousData, // smooth page transitions (v5)
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

// Add a review — refresh that product so the new review + rating show
export function useAddReview(id) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (review) => productApi.addReview(id, review),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product", id] }),
  });
}
