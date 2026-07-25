import "../../styles/productForm.css";

function ProductForm({
  formData,
  handleChange,
  handleSubmit,
  buttonText,
}) {
  return (
    <div className="product-form-container">
      <div className="product-form-card">

        <form onSubmit={handleSubmit} className="product-form">

          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              required
            />
          </div>

          <div className="form-group">
            <label>Size</label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="Enter size"
            />
          </div>

          <div className="form-group">
            <label>Purchase Price</label>
            <input
              type="number"
              step="0.01"
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Selling Price</label>
            <input
              type="number"
              step="0.01"
              name="selling_price"
              value={formData.selling_price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {buttonText}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ProductForm;