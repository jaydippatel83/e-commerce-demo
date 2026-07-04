import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <section className="page">
      <div className="empty">
        <div className="success-check">✓</div>
        <h1>Thank you for your order!</h1>
        <p>
          Your payment was successful and your order has been placed. A
          confirmation email is on its way.
        </p>
        <div className="empty__actions">
          <Link to="/orders" className="btn btn--primary">
            View my orders
          </Link>
          <Link to="/" className="btn btn--ghost">
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OrderSuccess;
