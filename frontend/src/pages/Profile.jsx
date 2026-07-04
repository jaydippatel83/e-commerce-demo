import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useMyProfile, useUpdateProfile } from "../hooks/useProfile";
import { useMyOrders } from "../hooks/useOrder";
import { getErrorMessage } from "../utils/error";

const statusClass = (s) => `chip status--${(s || "").toLowerCase()}`;

function Profile() {
  const { data: profile, isLoading } = useMyProfile();
  const { data: orders = [] } = useMyOrders();
  const updateProfile = useUpdateProfile();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [editing, setEditing] = useState(false);

  if (isLoading) return <p className="page__state">Loading account…</p>;
  if (!profile) return <p className="page__state">Couldn’t load your account.</p>;

  const startEdit = () => {
    setName(profile.name || "");
    setPassword("");
    setEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {};
    if (name && name !== profile.name) payload.name = name;
    if (password) payload.password = password;
    if (Object.keys(payload).length === 0) {
      setEditing(false);
      return;
    }
    updateProfile.mutate(payload, {
      onSuccess: () => {
        toast.success("Profile updated");
        setEditing(false);
        setPassword("");
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  return (
    <section className="page account">
      <h1 className="page__title">My account</h1>

      <div className="account__grid">
        {/* Details */}
        <div className="account__card">
          <div className="account__card-head">
            <h2>Profile details</h2>
            {!editing && (
              <button className="btn btn--ghost" onClick={startEdit}>
                Edit
              </button>
            )}
          </div>

          {!editing ? (
            <div className="account__details">
              <div className="account__row">
                <span>Name</span>
                {profile.name}
              </div>
              <div className="account__row">
                <span>Email</span>
                {profile.email}
              </div>
              <div className="account__row">
                <span>Role</span>
                <span className={`chip chip--${profile.role}`}>
                  {profile.role}
                </span>
              </div>
              <div className="account__row">
                <span>Verified</span>
                {profile.verified ? "✅ Verified" : "❌ Not verified"}
              </div>
            </div>
          ) : (
            <form className="form" onSubmit={handleSave}>
              <label className="form__field">
                <span>Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label className="form__field">
                <span>Email (read-only)</span>
                <input value={profile.email} disabled />
              </label>
              <label className="form__field">
                <span>New password (leave blank to keep)</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  placeholder="••••••••"
                />
              </label>
              <div className="form__actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Order history */}
        <div className="account__card">
          <div className="account__card-head">
            <h2>Order history</h2>
            <Link to="/orders" className="products__viewall">
              View all →
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="products__state">No orders yet.</p>
          ) : (
            <ul className="account__orders">
              {orders.slice(0, 5).map((order) => (
                <li key={order._id}>
                  <div>
                    <span className="account__order-id">
                      #{order._id.slice(-8)}
                    </span>
                    <span className="account__order-date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="account__order-right">
                    <span className={statusClass(order.status)}>
                      {order.status}
                    </span>
                    <span className="account__order-total">
                      ${order.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;
