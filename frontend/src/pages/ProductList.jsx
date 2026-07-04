import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { useProducts } from "../hooks/useProduct";
import { getErrorMessage } from "../utils/error";

const LIMIT = 12;

const titleFor = (category) => {
  if (!category || category === "all") return "All products";
  return category.charAt(0).toUpperCase() + category.slice(1);
};

function ProductList() {
  const { category } = useParams(); // men | women | kids | accessories | undefined
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");

  // reset to page 1 whenever the category or search term changes
  useEffect(() => {
    setPage(1);
  }, [category, searchParams]);

  const { data, isLoading, isError, error, isFetching } = useProducts({
    page,
    limit: LIMIT,
    category: category || "all",
    keyword: searchParams.get("keyword") || "",
  });

  const products = data?.products ?? [];
  const pages = data?.pages ?? 1;
  const total = data?.total ?? 0;

  const handleSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (keyword.trim()) next.set("keyword", keyword.trim());
    else next.delete("keyword");
    setSearchParams(next);
  };

  return (
    <section className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">{titleFor(category)}</h1>
          {!isLoading && (
            <p className="products__state">{total} product{total === 1 ? "" : "s"}</p>
          )}
        </div>
        <form className="search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search products…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn--ghost">
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <p className="products__state">Loading products…</p>
      ) : isError ? (
        <p className="products__state">Error: {getErrorMessage(error)}</p>
      ) : products.length === 0 ? (
        <p className="products__state">No products found.</p>
      ) : (
        <>
          <div className={`products__grid ${isFetching ? "is-fetching" : ""}`}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}
    </section>
  );
}

export default ProductList;
