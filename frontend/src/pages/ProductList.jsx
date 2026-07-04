import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import { useProducts } from "../hooks/useProduct";
import { getErrorMessage } from "../utils/error";

const LIMIT = 12;

// Common adult sizes for the filter. Kids sizes are custom per product.
const SIZE_FILTERS = ["S", "M", "L", "XL", "XXL"];

const titleFor = (category) => {
  if (!category || category === "all") return "All products";
  return category.charAt(0).toUpperCase() + category.slice(1);
};

function ProductList() {
  const { category } = useParams(); // men | women | kids | accessories | undefined
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  // debounce the search box → results narrow as you type (no button needed)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword.trim()), 350);
    return () => clearTimeout(t);
  }, [keyword]);

  const activeSize = searchParams.get("size") || "";

  // reset to page 1 whenever the query changes
  useEffect(() => {
    setPage(1);
  }, [category, debouncedKeyword, activeSize]);

  const { data, isLoading, isError, error, isFetching } = useProducts({
    page,
    limit: LIMIT,
    category: category || "all",
    keyword: debouncedKeyword,
    size: activeSize,
  });

  const products = data?.products ?? [];
  const pages = data?.pages ?? 1;
  const total = data?.total ?? 0;

  const toggleSize = (s) => {
    const next = new URLSearchParams(searchParams);
    if (activeSize === s) next.delete("size");
    else next.set("size", s);
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
        <div className="search">
          <input
            type="search"
            placeholder="Search products…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="size-filter">
        <span className="size-filter__label">Size:</span>
        {SIZE_FILTERS.map((s) => (
          <button
            key={s}
            className={`size-chip ${activeSize === s ? "is-active" : ""}`}
            onClick={() => toggleSize(s)}
          >
            {s}
          </button>
        ))}
        {activeSize && (
          <button className="size-filter__clear" onClick={() => toggleSize(activeSize)}>
            Clear
          </button>
        )}
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
