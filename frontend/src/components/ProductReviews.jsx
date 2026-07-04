import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAddReview } from "../hooks/useProduct";
import { getErrorMessage } from "../utils/error";

const Stars = ({ value }) => (
  <span className="stars" aria-label={`${value} out of 5`}>
    {"★★★★★".slice(0, Math.round(value))}
    <span className="stars__empty">{"★★★★★".slice(Math.round(value))}</span>
  </span>
);

function ProductReviews({ product }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const reviews = product.reviews || [];
  const addReview = useAddReview(product._id);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addReview.mutate(
      { rating, comment },
      {
        onSuccess: () => {
          toast.success("Thanks for your review!");
          setComment("");
          setRating(5);
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  };

  return (
    <section className="reviews">
      <div className="reviews__header">
        <h2 className="reviews__title">Customer reviews</h2>
        {product.numReviews > 0 && (
          <div className="reviews__summary">
            <Stars value={product.rating} />
            <span>
              {product.rating.toFixed(1)} · {product.numReviews} review
              {product.numReviews === 1 ? "" : "s"}
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="products__state">No reviews yet. Be the first!</p>
      ) : (
        <ul className="reviews__list">
          {reviews.map((r, i) => (
            <li className="review" key={r._id || i}>
              <div className="review__head">
                <span className="review__name">{r.name}</span>
                <Stars value={r.rating} />
              </div>
              {r.comment && <p className="review__comment">{r.comment}</p>}
            </li>
          ))}
        </ul>
      )}

      <div className="reviews__form-wrap">
        {isAuthenticated ? (
          <form className="review-form" onSubmit={handleSubmit}>
            <h3>Write a review</h3>
            <label className="form__field">
              <span>Rating</span>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </label>
            <label className="form__field">
              <span>Comment</span>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts…"
              />
            </label>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={addReview.isPending}
            >
              {addReview.isPending ? "Submitting…" : "Submit review"}
            </button>
          </form>
        ) : (
          <p className="products__state">
            <Link to="/login">Log in</Link> to write a review.
          </p>
        )}
      </div>
    </section>
  );
}

export default ProductReviews;
