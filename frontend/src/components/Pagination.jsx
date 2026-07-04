// Simple page navigator. Hidden when there's only one page.
function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const go = (p) => onChange(Math.min(pages, Math.max(1, p)));
  const numbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__btn"
        onClick={() => go(page - 1)}
        disabled={page === 1}
      >
        ← Prev
      </button>

      {numbers.map((n) => (
        <button
          key={n}
          className={`pagination__num ${n === page ? "is-active" : ""}`}
          onClick={() => go(n)}
        >
          {n}
        </button>
      ))}

      <button
        className="pagination__btn"
        onClick={() => go(page + 1)}
        disabled={page === pages}
      >
        Next →
      </button>
    </nav>
  );
}

export default Pagination;
