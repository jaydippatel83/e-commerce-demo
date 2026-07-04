import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useProduct } from "../hooks/useProduct";
import { addToCart } from "../redux/cartSlice";
import { getErrorMessage } from "../utils/error";

function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, isError, error } = useProduct(id);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) return <p className="page__state">Loading product…</p>;
  if (isError)
    return <p className="page__state">Error: {getErrorMessage(error)}</p>;
  if (!product) return <p className="page__state">Product not found.</p>;

  const { _id, name, price, description, imageUrl, category, stock, rating } =
    product;
  const sizes = product.sizes || [];
  const hasSizes = sizes.length > 0;
  const outOfStock = stock === 0;

  const handleAdd = () => {
    if (hasSizes && !size) {
      toast.error("Please select a size");
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
    <section className="pdp">
      <div className="pdp__media">
        <img src={imageUrl} alt={name} />
      </div>

      <div className="pdp__info">
        {category && <span className="pdp__category">{category}</span>}
        <h1 className="pdp__name">{name}</h1>

        <div className="pdp__meta">
          <span className="pdp__price">${price?.toFixed(2)}</span>
          {rating > 0 && <span className="pdp__rating">★ {rating.toFixed(1)}</span>}
        </div>

        <p className="pdp__desc">{description}</p>

        <p className={`pdp__stock ${outOfStock ? "pdp__stock--out" : ""}`}>
          {outOfStock ? "Out of stock" : `${stock} in stock`}
        </p>

        {hasSizes && (
          <div className="pdp__sizes">
            <span>Size</span>
            <div className="size-options">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`size-chip ${size === s ? "is-active" : ""}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
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
              <button onClick={() => setQty((q) => Math.min(stock, q + 1))}>
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

        <Link to="/" className="pdp__back">
          ← Back to products
        </Link>
      </div>
    </section>
  );
}

export default ProductDetail;
