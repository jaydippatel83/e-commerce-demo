import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProduct";
import { getErrorMessage } from "../utils/error";

function Home() {
  // just the newest 8 for the landing page
  const { data, isLoading, isError, error } = useProducts({ page: 1, limit: 8 });
  const products = data?.products ?? [];

  return (
    <>
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">Fashion for every you</p>
          <h1 className="home-hero__title">Discover the latest trends</h1>
          <p className="home-hero__text">
            Trendora brings the latest fashion trends to your wardrobe.
            Affordable, stylish and made for every you.
          </p>
          <Link to="/products/women" className="home-hero__cta">
            Shop the collection
          </Link>
        </div>
      </section>

      <section className="products">
        <div className="products__head">
          <h2 className="products__title">New arrivals</h2>
          <Link to="/products/all" className="products__viewall">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <p className="products__state">Loading products…</p>
        ) : isError ? (
          <p className="products__state">
            Couldn’t load products — {getErrorMessage(error)}
          </p>
        ) : products.length === 0 ? (
          <p className="products__state">No products found.</p>
        ) : (
          <div className="products__grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Home;
