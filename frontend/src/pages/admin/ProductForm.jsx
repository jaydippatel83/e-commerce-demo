import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useProduct,
  useCreateProduct,
  useUpdateProduct,
} from "../../hooks/useProduct";
import { getErrorMessage } from "../../utils/error";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  sizes: "",
};

const CATEGORIES = ["Men", "Women", "Kids", "Accessories"];

// Shared create/edit form. Edit mode when a :id route param is present.
function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);

  const { data: existing } = useProduct(id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  // prefill when editing
  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name ?? "",
        description: existing.description ?? "",
        price: existing.price ?? "",
        category: existing.category ?? "",
        stock: existing.stock ?? "",
        sizes: (existing.sizes || []).join(", "),
      });
    }
  }, [existing]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // image is optional on edit (keeps existing image if omitted)
    const payload = { ...form, image: image || undefined };
    const onSuccess = () => {
      toast.success(isEdit ? "Product updated" : "Product created");
      navigate("/admin/products");
    };
    const onError = (err) => toast.error(getErrorMessage(err));

    if (isEdit) {
      updateProduct.mutate({ id, data: payload }, { onSuccess, onError });
    } else {
      createProduct.mutate(payload, { onSuccess, onError });
    }
  };

  const mutation = isEdit ? updateProduct : createProduct;

  return (
    <section className="page">
      <h1 className="page__title">
        {isEdit ? "Edit product" : "New product"}
      </h1>

      <form className="form" onSubmit={handleSubmit}>
        <label className="form__field">
          <span>Name</span>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form__field">
          <span>Description</span>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>

        <div className="form__row">
          <label className="form__field">
            <span>Price ($)</span>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form__field">
            <span>Stock</span>
            <input
              type="number"
              min="0"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className="form__row">
          <label className="form__field">
            <span>Category</span>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select category…
              </option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="form__field">
            <span>Sizes (comma-separated)</span>
            <input
              name="sizes"
              value={form.sizes}
              onChange={handleChange}
              placeholder="S, M, L, XL  ·  or  4-5Y, 6-7Y"
            />
          </label>
        </div>

        <label className="form__field">
          <span>Image {isEdit && "(leave empty to keep current)"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0] || null)}
            {...(!isEdit ? { required: true } : {})}
          />
        </label>

        <div className="form__actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Saving…"
              : isEdit
              ? "Save changes"
              : "Create product"}
          </button>
        </div>

        {mutation.isError && (
          <p className="auth__error">{getErrorMessage(mutation.error)}</p>
        )}
      </form>
    </section>
  );
}

export default ProductForm;
