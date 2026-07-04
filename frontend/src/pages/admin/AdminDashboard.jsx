import { Link } from "react-router-dom";
import { useAnalytics } from "../../hooks/useAnalytics";
import { getErrorMessage } from "../../utils/error";

const CARDS = [
  { key: "totalSales", label: "Total sales", prefix: "$", tone: "gold" },
  { key: "orders", label: "Orders", tone: "blue" },
  { key: "products", label: "Products", tone: "green" },
  { key: "users", label: "Users", tone: "dark" },
];

const format = (key, value) => {
  if (value == null) return "—";
  if (key === "totalSales") return value.toFixed(2);
  return value;
};

function AdminDashboard() {
  const { data, isLoading, isError, error } = useAnalytics();

  if (isLoading) return <p className="page__state">Loading dashboard…</p>;
  if (isError)
    return <p className="page__state">Error: {getErrorMessage(error)}</p>;

  return (
    <section className="page">
      <h1 className="page__title">Admin dashboard</h1>

      <div className="stats">
        {CARDS.map((c) => (
          <div className={`stat stat--${c.tone}`} key={c.key}>
            <span className="stat__label">{c.label}</span>
            <span className="stat__value">
              {c.prefix || ""}
              {format(c.key, data?.[c.key])}
            </span>
          </div>
        ))}
      </div>

      <div className="dash-links">
        <Link to="/admin/products" className="btn btn--ghost">
          Manage products
        </Link>
        <Link to="/admin/orders" className="btn btn--ghost">
          Manage orders
        </Link>
        <Link to="/admin/users" className="btn btn--ghost">
          Manage users
        </Link>
      </div>
    </section>
  );
}

export default AdminDashboard;
