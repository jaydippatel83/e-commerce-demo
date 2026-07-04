import { Link } from "react-router-dom";
import icon from "../../assets/trendora-icon.svg";

const year = new Date().getFullYear();

const columns = [
  {
    title: "Shop",
    links: [
      { to: "/products/men", label: "Men" },
      { to: "/products/women", label: "Women" },
      { to: "/products/accessories", label: "Accessories" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/careers", label: "Careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/shipping", label: "Shipping" },
      { to: "/returns", label: "Returns" },
      { to: "/faq", label: "FAQ" },
    ],
  },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src={icon} alt="Trendora" className="footer__logo" />
          <p className="footer__tagline">
            Fashion for every you — affordable, stylish, and made to move.
          </p>
        </div>

        <div className="footer__columns">
          {columns.map((col) => (
            <div key={col.title} className="footer__col">
              <h4 className="footer__col-title">{col.title}</h4>
              <ul className="footer__list">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {year} Trendora. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
