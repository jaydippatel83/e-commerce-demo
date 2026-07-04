import { useState, Fragment } from "react";
import { toast } from "react-toastify";
import { useOrders, useUpdateOrderStatus } from "../../hooks/useOrder";
import { getErrorMessage } from "../../utils/error";

const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function AdminOrders() {
  const { data: orders = [], isLoading, isError, error } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const [expanded, setExpanded] = useState(null);

  if (isLoading) return <p className="page__state">Loading orders…</p>;
  if (isError)
    return <p className="page__state">Error: {getErrorMessage(error)}</p>;

  const toggle = (id) => setExpanded((cur) => (cur === id ? null : id));

  return (
    <section className="page">
      <h1 className="page__title">All orders</h1>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <Fragment key={order._id}>
                <tr>
                  <td>#{order._id.slice(-8)}</td>
                  <td>
                    {order.user?.name || "—"}
                    <br />
                    <small>{order.user?.email}</small>
                  </td>
                  <td>
                    <button
                      className="link-btn"
                      onClick={() => toggle(order._id)}
                    >
                      {order.orderItems?.length} item
                      {order.orderItems?.length === 1 ? "" : "s"}{" "}
                      {expanded === order._id ? "▲" : "▼"}
                    </button>
                  </td>
                  <td>${order.totalAmount?.toFixed(2)}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      disabled={updateStatus.isPending}
                      onChange={(e) =>
                        updateStatus.mutate(
                          { id: order._id, status: e.target.value },
                          {
                            onSuccess: () =>
                              toast.success("Order status updated"),
                            onError: (err) =>
                              toast.error(getErrorMessage(err)),
                          }
                        )
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                {expanded === order._id && (
                  <tr className="order-detail-row">
                    <td colSpan={6}>
                      <div className="order-detail">
                        <div className="order-detail__items">
                          {order.orderItems.map((item, i) => (
                            <div className="order-detail__item" key={i}>
                              <span>
                                {item.name}
                                {item.size && (
                                  <span className="chip order-detail__size">
                                    Size: {item.size}
                                  </span>
                                )}
                              </span>
                              <span>
                                {item.qty} × ${item.price?.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        {order.shippingAddress && (
                          <div className="order-detail__ship">
                            <strong>Ship to:</strong>{" "}
                            {order.shippingAddress.fullName},{" "}
                            {order.shippingAddress.street},{" "}
                            {order.shippingAddress.city}{" "}
                            {order.shippingAddress.postalCode},{" "}
                            {order.shippingAddress.country}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminOrders;
