import { Link } from "react-router-dom";
import { useProducts, useDeleteProduct } from "../../hooks/useProduct";
import { getErrorMessage } from "../../utils/error";

function AdminProducts() {
  const { data: products = [], isLoading, isError, error } = useProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteProduct.mutate(id);
    }
  };

  if (isLoading) return <p className="page__state">Loading products…</p>;
  if (isError)
    return <p className="page__state">Error: {getErrorMessage(error)}</p>;

  return (
    <section className="page">
      <div className="page__head">
        <h1 className="page__title">Manage products</h1>
        <Link to="/admin/products/new" className="btn btn--primary">
          + New product
        </Link>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img className="table__thumb" src={p.imageUrl} alt={p.name} />
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price?.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td className="table__actions">
                  <Link
                    to={`/admin/products/${p._id}/edit`}
                    className="btn btn--ghost"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn--danger"
                    onClick={() => handleDelete(p._id, p.name)}
                    disabled={deleteProduct.isPending}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminProducts;
