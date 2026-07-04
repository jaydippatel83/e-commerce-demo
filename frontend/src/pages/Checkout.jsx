import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { clearCart } from "../redux/cartSlice";
import { useCreateOrder } from "../hooks/useOrder";
import { paymentApi } from "../api/payment";
import { loadRazorpay } from "../utils/loadRazorpay";
import { getErrorMessage } from "../utils/error";

const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;

function Checkout() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const placeOrder = async (paymentId) => {
    const orderItems = cartItems.map((i) => ({
      product: i._id,
      name: i.name,
      price: i.price,
      qty: i.quantity,
    }));
    await createOrder.mutateAsync({
      orderItems,
      totalAmount: total,
      shippingAddress: address,
      paymentId,
    });
    dispatch(clearCart());
    toast.success("Payment successful — your order is placed!");
    navigate("/order-success");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!RAZORPAY_KEY) {
      setError(
        "Razorpay key is not configured. Add REACT_APP_RAZORPAY_KEY_ID to frontend/.env and restart."
      );
      return;
    }

    setProcessing(true);
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Failed to load Razorpay. Check your connection.");

      // 1. create a Razorpay order on our backend
      const rzpOrder = await paymentApi.createRazorpayOrder(total, "INR");

      // 2. open the Razorpay checkout modal
      const options = {
        key: RAZORPAY_KEY,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Trendora",
        description: "Order payment",
        order_id: rzpOrder.id,
        prefill: {
          name: user?.name || address.fullName,
          email: user?.email || "",
        },
        theme: { color: "#111111" },
        handler: async (response) => {
          try {
            // 3. verify the signature server-side
            const result = await paymentApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (!result.success) throw new Error("Payment verification failed");

            // 4. persist the order in our DB
            await placeOrder(response.razorpay_payment_id);
          } catch (err) {
            setError(getErrorMessage(err));
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        const msg = resp.error?.description || "Payment failed";
        setError(msg);
        toast.error(msg);
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setError(getErrorMessage(err));
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section className="page">
        <div className="empty">
          <h1>Nothing to check out</h1>
          <p>Your cart is empty.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page checkout">
      <h1 className="page__title">Checkout</h1>

      <div className="checkout__grid">
        <form className="form" onSubmit={handleSubmit}>
          <h2 className="checkout__subtitle">Shipping address</h2>

          <label className="form__field">
            <span>Full name</span>
            <input
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form__field">
            <span>Street</span>
            <input
              name="street"
              value={address.street}
              onChange={handleChange}
              required
            />
          </label>

          <div className="form__row">
            <label className="form__field">
              <span>City</span>
              <input
                name="city"
                value={address.city}
                onChange={handleChange}
                required
              />
            </label>
            <label className="form__field">
              <span>Postal code</span>
              <input
                name="postalCode"
                value={address.postalCode}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="form__field">
            <span>Country</span>
            <input
              name="country"
              value={address.country}
              onChange={handleChange}
              required
            />
          </label>

          <button
            type="submit"
            className="btn btn--primary"
            disabled={processing || createOrder.isPending}
          >
            {processing || createOrder.isPending
              ? "Processing…"
              : `Pay $${total.toFixed(2)}`}
          </button>

          {error && <p className="auth__error">{error}</p>}
        </form>

        <aside className="cart__summary">
          <h2>Order summary</h2>
          {cartItems.map((i) => (
            <div className="cart__row" key={i._id}>
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>${(i.price * i.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="cart__row cart__row--total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;
