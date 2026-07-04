import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../../assets/trendora-logo.svg";
import { logout } from "../../redux/authSlice";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/products/men", label: "Men" },
  { to: "/products/women", label: "Women" },
  { to: "/products/accessories", label: "Accessories" },
];

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Trendora home">
          <img src={logo} alt="Trendora" className="navbar__logo" />
        </Link>

        <nav className="navbar__links">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                "navbar__link" + (isActive ? " navbar__link--active" : "")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          {isAuthenticated && user ? (
            <>
              <span className="navbar__user">Hello, {user.name}</span>
              {user.role === "admin" && (
                <Link to="/admin/products" className="navbar__action">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="navbar__action">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar__action">
              Login
            </Link>
          )}
          <Link to="/cart" className="navbar__action navbar__action--cart">
            Cart ({cartItems.length})
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
