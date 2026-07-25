import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ProductForm from "../components/products/ProductForm";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    size: "",
    purchase_price: "",
    selling_price: "",
    stock_quantity: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/products", formData);

      alert("Product added successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to add product.");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px",
          fontSize: "32px",
          color: "#333",
        }}
      >
        Add Product
      </h1>

      <ProductForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText="Add Product"
      />
    </div>
  );
}

export default AddProduct;