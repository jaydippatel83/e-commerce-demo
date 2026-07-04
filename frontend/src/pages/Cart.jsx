import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  decreaseQty,
  removeFromCart,
} from "../redux/cartSlice";

function Cart() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <section className="page">
        <div className="empty">
          <h1>Your cart is empty</h1>
          <p>Looks like you haven’t added anything yet.</p>
          <Link to="/" className="btn btn--primary">
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page cart">
      <h1 className="page__title">Your cart</h1>

      <div className="cart__grid">
        <div className="cart__items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>
              <img
                className="cart-item__img"
                src={item.imageUrl}
                alt={item.name}
              />
              <div className="cart-item__info">
                <Link to={`/product/${item._id}`} className="cart-item__name">
                  {item.name}
                </Link>
                <span className="cart-item__price">
                  ${item.price.toFixed(2)}
                </span>
              </div>

              <div className="qty-control">
                <button onClick={() => dispatch(decreaseQty(item._id))}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}>
                  +
                </button>
              </div>

              <span className="cart-item__subtotal">
                ${(item.price * item.quantity).toFixed(2)}
              </span>

              <button
                className="cart-item__remove"
                onClick={() => dispatch(removeFromCart(item._id))}
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <aside className="cart__summary">
          <h2>Order summary</h2>
          <div className="cart__row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart__row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="cart__row cart__row--total">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button
            className="btn btn--primary cart__checkout"
            onClick={() => navigate("/checkout")}
          >
            Proceed to checkout
          </button>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
