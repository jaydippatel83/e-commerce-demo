import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Home() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [products, setProducts] = React.useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/products");
        const data = await response.json();
        // API may return an array or { products: [...] } — handle both
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        <h2 className="products__title">New arrivals</h2>

        {isLoading ? (
          <p className="products__state">Loading products…</p>
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
