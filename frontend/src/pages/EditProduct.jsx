import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import ProductForm from "../components/products/ProductForm";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_name: "",
    category: "",
    size: "",
    purchase_price: "",
    selling_price: "",
    stock_quantity: "",
  });

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to load product.");
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/products/${id}`, formData);

      alert("Product updated successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to update product.");
    }
  };

  return (
    <div>
      <h1>Edit Product</h1>

      <ProductForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText="Update Product"
      />
    </div>
  );
}

export default EditProduct;