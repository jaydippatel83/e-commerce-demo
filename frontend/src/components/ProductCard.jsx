import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../redux/cartSlice";

function ProductCard({ product }) {
  const { _id, name, price, category, imageUrl, rating, stock } = product;
  const outOfStock = stock === 0;
  const hasSizes = (product.sizes || []).length > 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddClick = (e) => {
    e.preventDefault(); // don't let the card's Link navigate
    if (hasSizes) {
      // can't choose a size on the card → go pick one on the detail page
      navigate(`/product/${_id}`);
      return;
    }
    dispatch(addToCart({ _id, name, price, imageUrl, size: "" }));
    toast.success(`${name} added to cart`);
  };

  return (
    <Link to={`/product/${_id}`} className="product-card">
      <div className="product-card__media">
        <img
          src={imageUrl}
          alt={name}
          className="product-card__img"
          loading="lazy"
        />
        {category && <span className="product-card__badge">{category}</span>}
        {outOfStock && (
          <span className="product-card__soldout">Sold out</span>
        )}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{name}</h3>

        <div className="product-card__meta">
          <span className="product-card__price">${price?.toFixed(2)}</span>
          {rating > 0 && (
            <span className="product-card__rating">★ {rating.toFixed(1)}</span>
          )}
        </div>

        <button
          type="button"
          className="product-card__btn"
          disabled={outOfStock}
          onClick={handleAddClick}
        >
          {outOfStock ? "Unavailable" : hasSizes ? "Select size" : "Add to cart"}
        </button>
      </div>
    </Link>
  );
}

export default ProductCard;
