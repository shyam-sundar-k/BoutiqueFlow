import { useEffect, useState } from "react";
import api from "../services/api";
import ProductTable from "../components/products/ProductTable";

function Products() {
  const [products, setProducts] = useState([]);

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
        console.error("Error fetching products:", error);
      });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      setProducts(products.filter((product) => product.id !== id));

      alert("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div>
      <h1>Products</h1>

      <ProductTable
        products={products}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Products;