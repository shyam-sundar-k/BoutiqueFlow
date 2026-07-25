import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Sales() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api
      .get("/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Add product to cart
  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Subtotal
  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.selling_price) * item.quantity,
    0
  );

  // Discount
  const discountAmount = (subtotal * discount) / 100;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Checkout
  const checkout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    const payload = {
      subtotal: subtotal,
      total_amount: totalAmount,
      payment_method: "Cash",
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: Number(item.selling_price),
      })),
    };

    try {
      const response = await api.post("/sales", payload);

      const saleId = response.data.sale_id;

setCart([]);
setDiscount(0);
fetchProducts();

navigate(`/invoice/${saleId}`);
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Checkout failed.");
      }
    }
  };

  // Search filter
  const filteredProducts = products.filter((product) =>
    product.product_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="sales-container">
      <h1 className="sales-title">Sales & Billing</h1>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search products..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sales-layout">

        {/* Products */}
        <div className="product-panel">
          <h2>Products</h2>

          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-item"
              >
                <h3>{product.product_name}</h3>

                <p>Category: {product.category}</p>

                <p>Stock: {product.stock_quantity}</p>

                <p>Price: ₹{product.selling_price}</p>

                <button
                  className="add-btn"
                  onClick={() => addToCart(product)}
                >
                  Add
                </button>
              </div>
            ))
          )}
        </div>

        {/* Shopping Cart */}
        <div className="cart-panel">
          <h2>Shopping Cart</h2>

          {cart.length === 0 ? (
            <p>Cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="cart-item"
              >
                <h3>{item.product_name}</h3>

                <p>Price: ₹{item.selling_price}</p>

                <div className="qty-controls">
                  <button
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>
                </div>

                <p>
                  Subtotal: ₹
                  {(
                    Number(item.selling_price) *
                    item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))
          )}

          <div className="cart-total">

            <div className="bill-summary">

              <div className="bill-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="discount-section">
                <label>Discount (%)</label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(Number(e.target.value))
                  }
                  placeholder="Enter discount"
                />
              </div>

              <div className="bill-row">
                <span>Discount</span>
                <span>
                  ₹{discountAmount.toFixed(2)}
                </span>
              </div>

              <hr />

              <div className="bill-row grand-total">
                <span>Grand Total</span>
                <span>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>

            </div>

            <button
              className="checkout-btn"
              onClick={checkout}
            >
              Checkout
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Sales;