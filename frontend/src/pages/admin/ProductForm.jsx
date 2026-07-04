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
};

const CATEGORIES = ["Men", "Women", "Kids", "Accessories"];

// Shared create/edit form. Edit mode when a :id route param is present.
function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [image, setImage] = useState(null);
  const [hasSizes, setHasSizes] = useState(false);
  const [variants, setVariants] = useState([{ size: "", stock: "" }]);

  const { data: existing } = useProduct(id);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  // prefill when editing
  useEffect(() => {
    if (!existing) return;
    setForm({
      name: existing.name ?? "",
      description: existing.description ?? "",
      price: existing.price ?? "",
      category: existing.category ?? "",
      stock: existing.stock ?? "",
    });
    if (existing.variants?.length) {
      setHasSizes(true);
      setVariants(existing.variants.map((v) => ({ size: v.size, stock: v.stock })));
    } else if (existing.sizes?.length) {
      // legacy product with sizes but no per-size stock → let admin fill stock
      setHasSizes(true);
      setVariants(existing.sizes.map((s) => ({ size: s, stock: "" })));
    }
  }, [existing]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const updateVariant = (i, field, value) =>
    setVariants((vs) =>
      vs.map((v, idx) => (idx === i ? { ...v, [field]: value } : v))
    );
  const addVariant = () =>
    setVariants((vs) => [...vs, { size: "", stock: "" }]);
  const removeVariant = (i) =>
    setVariants((vs) => vs.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      price: form.price,
      category: form.category,
      image: image || undefined,
    };

    if (hasSizes) {
      const cleaned = variants
        .filter((v) => v.size.trim())
        .map((v) => ({ size: v.size.trim(), stock: Number(v.stock) || 0 }));
      if (cleaned.length === 0) {
        toast.error("Add at least one size with stock");
        return;
      }
      payload.variants = JSON.stringify(cleaned); // backend derives sizes + stock
    } else {
      payload.stock = form.stock;
    }

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
      <h1 className="page__title">{isEdit ? "Edit product" : "New product"}</h1>

      <form className="form" onSubmit={handleSubmit}>
        <label className="form__field">
          <span>Name</span>
          <input name="name" value={form.name} onChange={handleChange} required />
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
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={hasSizes}
            onChange={(e) => setHasSizes(e.target.checked)}
          />
          <span>This product comes in sizes (track stock per size)</span>
        </label>

        {hasSizes ? (
          <div className="form__field">
            <span>Sizes &amp; stock</span>
            <div className="variants">
              {variants.map((v, i) => (
                <div className="variant-row" key={i}>
                  <input
                    className="variant-row__size"
                    placeholder="Size (S, M, 4-5Y…)"
                    value={v.size}
                    onChange={(e) => updateVariant(i, "size", e.target.value)}
                  />
                  <input
                    className="variant-row__stock"
                    type="number"
                    min="0"
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) => updateVariant(i, "stock", e.target.value)}
                  />
                  <button
                    type="button"
                    className="variant-row__remove"
                    onClick={() => removeVariant(i)}
                    disabled={variants.length === 1}
                    aria-label="Remove size"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" className="btn btn--ghost" onClick={addVariant}>
                + Add size
              </button>
            </div>
          </div>
        ) : (
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
        )}

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
