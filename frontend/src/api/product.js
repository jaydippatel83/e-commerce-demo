// src/api/product.js
import { api } from "./client";

// Create/update send multipart/form-data because the backend uses multer
// (upload.single("image")). Build FormData from a plain object.
const toFormData = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    // skip empty values so an edit without a new file keeps the old image
    if (value === undefined || value === null || value === "") return;
    fd.append(key, value);
  });
  return fd;
};

export const productApi = {
  // params: { page, limit, category, keyword, size }
  // returns { products, page, pages, total }
  getProducts: (params = {}) =>
    api.get("/products", { params }).then((r) => r.data),

  getProduct: (id) => api.get(`/products/${id}`).then((r) => r.data),

  createProduct: (data) =>
    api
      .post("/products", toFormData(data), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  updateProduct: (id, data) =>
    api
      .put(`/products/${id}`, toFormData(data), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data),

  deleteProduct: (id) => api.delete(`/products/${id}`).then((r) => r.data),
};
