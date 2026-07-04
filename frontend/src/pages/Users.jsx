import { Link } from "react-router-dom";
import { useUsers } from "../hooks/useUsers";
import { getErrorMessage } from "../utils/error";

function Users() {
  const { data: users = [], isLoading, isError, error } = useUsers();

  if (isLoading) return <p className="page__state">Loading users…</p>;
  if (isError)
    return <p className="page__state">Error: {getErrorMessage(error)}</p>;

  return (
    <section className="page">
      <h1 className="page__title">All users</h1>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <Link to={`/user/${u._id}`}>{u.name}</Link>
                </td>
                <td>{u.email}</td>
                <td>
                  <span className={`chip chip--${u.role}`}>{u.role}</span>
                </td>
                <td>{u.verified ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Users;
