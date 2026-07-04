import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useProduct } from "../hooks/useProduct";
import { addToCart } from "../redux/cartSlice";
import ProductReviews from "../components/ProductReviews";
import { getErrorMessage } from "../utils/error";

// Generic size guide (cm). Shown in a toggle on the detail page.
const SIZE_GUIDE = [
  { size: "S", chest: "86-91", waist: "71-76" },
  { size: "M", chest: "96-101", waist: "81-86" },
  { size: "L", chest: "106-111", waist: "91-96" },
  { size: "XL", chest: "116-121", waist: "101-106" },
];

function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, isError, error } = useProduct(id);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) return <p className="page__state">Loading product…</p>;
  if (isError)
    return <p className="page__state">Error: {getErrorMessage(error)}</p>;
  if (!product) return <p className="page__state">Product not found.</p>;

  const { _id, name, price, description, imageUrl, category, stock, rating } =
    product;
  const variants = product.variants || [];
  const hasVariants = variants.length > 0;
  const legacySizes = !hasVariants ? product.sizes || [] : [];
  const hasSizes = hasVariants || legacySizes.length > 0;
  const outOfStock = stock === 0;

  // stock available for the current selection
  const selectedVariant = variants.find((v) => v.size === size);
  const maxQty = hasVariants ? selectedVariant?.stock || 0 : stock;

  const handleSelectSize = (s) => {
    setSize(s);
    setQty(1);
  };

  const handleAdd = () => {
    if (hasSizes && !size) {
      toast.error("Please select a size");
      return false;
    }
    if (hasVariants && maxQty === 0) {
      toast.error("That size is out of stock");
      return false;
    }
    dispatch(
      addToCart({ _id, name, price, imageUrl, size: size || "", quantity: qty })
    );
    toast.success(`${name} added to cart`);
    return true;
  };

  const handleBuyNow = () => {
    if (handleAdd()) navigate("/checkout");
  };

  return (
    <>
      <section className="pdp">
        <div className="pdp__media">
          <img src={imageUrl} alt={name} />
        </div>

        <div className="pdp__info">
          {category && <span className="pdp__category">{category}</span>}
          <h1 className="pdp__name">{name}</h1>

          <div className="pdp__meta">
            <span className="pdp__price">${price?.toFixed(2)}</span>
            {rating > 0 && (
              <span className="pdp__rating">
                ★ {rating.toFixed(1)} ({product.numReviews})
              </span>
            )}
          </div>

          <p className="pdp__desc">{description}</p>

          <p className={`pdp__stock ${outOfStock ? "pdp__stock--out" : ""}`}>
            {outOfStock ? "Out of stock" : `${stock} in stock`}
          </p>

          {hasSizes && (
            <div className="pdp__sizes">
              <div className="pdp__sizes-head">
                <span>Size</span>
                <button
                  type="button"
                  className="pdp__guide-toggle"
                  onClick={() => setShowGuide((s) => !s)}
                >
                  Size guide
                </button>
              </div>

              <div className="size-options">
                {hasVariants
                  ? variants.map((v) => (
                      <button
                        key={v.size}
                        type="button"
                        className={`size-chip ${size === v.size ? "is-active" : ""}`}
                        onClick={() => handleSelectSize(v.size)}
                        disabled={v.stock === 0}
                        title={v.stock === 0 ? "Out of stock" : `${v.stock} left`}
                      >
                        {v.size}
                      </button>
                    ))
                  : legacySizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`size-chip ${size === s ? "is-active" : ""}`}
                        onClick={() => handleSelectSize(s)}
                      >
                        {s}
                      </button>
                    ))}
              </div>

              {hasVariants && size && (
                <p className="pdp__size-stock">
                  {maxQty > 0 ? `${maxQty} left in ${size}` : `${size} is sold out`}
                </p>
              )}

              {showGuide && (
                <div className="size-guide">
                  <table>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Chest (cm)</th>
                        <th>Waist (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIZE_GUIDE.map((row) => (
                        <tr key={row.size}>
                          <td>{row.size}</td>
                          <td>{row.chest}</td>
                          <td>{row.waist}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="size-guide__note">
                    Measurements are approximate. Kids sizes are age-based (e.g.
                    4-5Y).
                  </p>
                </div>
              )}
            </div>
          )}

          {!outOfStock && (
            <div className="pdp__qty">
              <span>Quantity</span>
              <div className="qty-control">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </button>
                <span>{qty}</span>
                <button
                  onClick={() =>
                    setQty((q) => {
                      const cap = hasVariants ? maxQty || 1 : stock;
                      return Math.min(cap, q + 1);
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="pdp__actions">
            <button
              className="btn btn--ghost"
              onClick={handleAdd}
              disabled={outOfStock}
            >
              Add to cart
            </button>
            <button
              className="btn btn--primary"
              onClick={handleBuyNow}
              disabled={outOfStock}
            >
              Buy now
            </button>
          </div>

          <Link to="/products/all" className="pdp__back">
            ← Back to products
          </Link>
        </div>
      </section>

      <div className="pdp__reviews-wrap">
        <ProductReviews product={product} />
      </div>
    </>
  );
}

export default ProductDetail;
