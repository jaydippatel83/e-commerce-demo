import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Guards nested routes. Wrap a route element with <ProtectedRoute> for any
// logged-in user, or <ProtectedRoute adminOnly> for admins only.
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // remember where they were headed so Login can send them back
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
