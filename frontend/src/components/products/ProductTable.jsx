import { Link } from "react-router-dom";

function ProductTable({ products, onDelete }) {
  const printBarcode = (id) => {
    window.open(
      `http://127.0.0.1:8000/barcode/${id}`,
      "_blank"
    );
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Barcode</th>
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

            <td>
              <strong>{product.barcode}</strong>
            </td>

            <td>{product.product_name}</td>
            <td>{product.category}</td>
            <td>{product.size}</td>
            <td>₹{product.selling_price}</td>
            <td>{product.stock_quantity}</td>

            <td>
              <Link to={`/edit-product/${product.id}`}>
                <button>Edit</button>
              </Link>

              {" "}

              <button onClick={() => onDelete(product.id)}>
                Delete
              </button>

              {" "}

              <button onClick={() => printBarcode(product.id)}>
                Print Barcode
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ProductTable;