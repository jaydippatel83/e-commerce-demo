import { useOrders, useUpdateOrderStatus } from "../../hooks/useOrder";
import { getErrorMessage } from "../../utils/error";

const STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const { data: orders = [], isLoading, isError, error } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  if (isLoading) return <p className="page__state">Loading orders…</p>;
  if (isError)
    return <p className="page__state">Error: {getErrorMessage(error)}</p>;

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
              <tr key={order._id}>
                <td>#{order._id.slice(-8)}</td>
                <td>
                  {order.user?.name || "—"}
                  <br />
                  <small>{order.user?.email}</small>
                </td>
                <td>{order.orderItems?.length}</td>
                <td>${order.totalAmount?.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    disabled={updateStatus.isPending}
                    onChange={(e) =>
                      updateStatus.mutate({
                        id: order._id,
                        status: e.target.value,
                      })
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
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminOrders;
