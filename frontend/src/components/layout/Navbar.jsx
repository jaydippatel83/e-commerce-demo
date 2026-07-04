import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import logo from "../../assets/trendora-logo.svg";
import { logout } from "../../redux/authSlice";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/products/men", label: "Men" },
  { to: "/products/women", label: "Women" },
  { to: "/products/kids", label: "Kids" },
  { to: "/products/accessories", label: "Accessories" },
];

function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    toast.info("You’ve been logged out");
    navigate("/login");
  };

  const links = navLinks.map(({ to, label, end }) => (
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
  ));

  const actions = (
    <>
      {isAuthenticated && user ? (
        <>
          <Link to="/profile" className="navbar__user">
            Hello, {user.name}
          </Link>
          <Link to="/orders" className="navbar__action">
            Orders
          </Link>
          {user.role === "admin" && (
            <Link to="/admin" className="navbar__action">
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
    </>
  );

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="Trendora home">
          <img src={logo} alt="Trendora" className="navbar__logo" />
        </Link>

        {/* desktop */}
        <nav className="navbar__links">{links}</nav>
        <div className="navbar__actions">{actions}</div>

        {/* mobile hamburger */}
        <button
          className={`navbar__toggle ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* mobile drawer */}
      {menuOpen && (
        <div className="navbar__mobile">
          <nav className="navbar__mobile-links">{links}</nav>
          <div className="navbar__mobile-actions">{actions}</div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
