import { useParams } from "react-router-dom";
import { useUserProfile } from "../hooks/useUsers";
import { getErrorMessage } from "../utils/error";

function UserProfile() {
  const { id } = useParams();
  const { data: user, isLoading, isError, error } = useUserProfile(id);

  if (isLoading) return <p className="page__state">Loading profile…</p>;
  if (isError)
    return <p className="page__state">Error: {getErrorMessage(error)}</p>;
  if (!user) return <p className="page__state">User not found.</p>;

  return (
    <section className="page">
      <div className="profile-card">
        <div className="profile-card__avatar">
          {user.name?.charAt(0)?.toUpperCase()}
        </div>
        <h1 className="profile-card__name">{user.name}</h1>
        <p className="profile-card__row">
          <span>Email</span> {user.email}
        </p>
        <p className="profile-card__row">
          <span>Role</span>{" "}
          <span className={`chip chip--${user.role}`}>{user.role}</span>
        </p>
        {"verified" in user && (
          <p className="profile-card__row">
            <span>Verified</span> {user.verified ? "✅" : "❌"}
          </p>
        )}
      </div>
    </section>
  );
}

export default UserProfile;
