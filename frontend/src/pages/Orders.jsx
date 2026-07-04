import { Link } from "react-router-dom";
import { useMyOrders } from "../hooks/useOrder";
import { getErrorMessage } from "../utils/error";

const statusClass = (s) => `chip status--${(s || "").toLowerCase()}`;

function Orders() {
  const { data: orders = [], isLoading, isError, error } = useMyOrders();

  if (isLoading) return <p className="page__state">Loading orders…</p>;
  if (isError)
    return <p className="page__state">Error: {getErrorMessage(error)}</p>;

  if (orders.length === 0) {
    return (
      <section className="page">
        <div className="empty">
          <h1>No orders yet</h1>
          <p>When you place an order, it’ll show up here.</p>
          <Link to="/" className="btn btn--primary">
            Start shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <h1 className="page__title">My orders</h1>

      <div className="orders">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-card__head">
              <div>
                <span className="order-card__id">
                  Order #{order._id.slice(-8)}
                </span>
                <span className="order-card__date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <span className={statusClass(order.status)}>{order.status}</span>
            </div>

            <ul className="order-card__items">
              {order.orderItems.map((item, i) => (
                <li key={i}>
                  <span>
                    {item.name}
                    {item.size ? ` · ${item.size}` : ""} × {item.qty}
                  </span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div className="order-card__foot">
              <span>Total</span>
              <span className="order-card__total">
                ${order.totalAmount?.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Orders;
