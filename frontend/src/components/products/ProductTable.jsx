import { Link } from "react-router-dom";
function ProductTable({ products, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Product</th>
          <th>Category</th>
          <th>Size</th>
          <th>Selling Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.product_name}</td>
            <td>{product.category}</td>
            <td>{product.size}</td>
            <td>{product.selling_price}</td>
            <td>{product.stock_quantity}</td>
            <td>
              <Link to={`/edit-product/${product.id}`}>
              <button>Edit</button>
              </Link>

              {" "}
              
              <button onClick={() => onDelete(product.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;