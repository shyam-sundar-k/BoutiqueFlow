import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/BarcodeLabels.css";

function BarcodeLabels() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api
      .get("/barcode/products/list")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSelect = (id, checked, stock) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { copies: stock }),
        selected: checked,
      },
    }));
  };

  const handleCopies = (id, copies) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { selected: false }),
        copies: Number(copies),
      },
    }));
  };

  const printLabels = async () => {
    const selected = Object.entries(selectedProducts)
      .filter(([_, value]) => value.selected)
      .map(([id, value]) => ({
        product_id: Number(id),
        copies: value.copies,
      }));

    if (selected.length === 0) {
      alert("Please select at least one product.");
      return;
    }

    try {
      const response = await api.post(
        "/barcode/print-labels",
        selected,
        {
          responseType: "text",
        }
      );

      const printWindow = window.open("", "_blank");

      printWindow.document.open();
      printWindow.document.write(response.data);
      printWindow.document.close();
    } catch (error) {
      console.error(error);
      alert("Failed to generate barcode labels.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const term = search.toLowerCase();

    return (
      product.product_name.toLowerCase().includes(term) ||
      product.barcode.toLowerCase().includes(term)
    );
  });

  const selectedCount = Object.values(selectedProducts).filter(
    (item) => item.selected
  ).length;

  return (
    <div className="barcode-page">
      <div className="barcode-header">
        <h2>Barcode Label Printing</h2>

        <div className="selected-count">
          Selected Products: <strong>{selectedCount}</strong>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search by product name or barcode..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="barcode-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Barcode</th>
              <th>Product</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Copies</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={
                        selectedProducts[product.id]?.selected || false
                      }
                      onChange={(e) =>
                        handleSelect(
                          product.id,
                          e.target.checked,
                          product.stock_quantity
                        )
                      }
                    />
                  </td>

                  <td>
                    <strong>{product.barcode}</strong>
                  </td>

                  <td>{product.product_name}</td>

                  <td>{product.stock_quantity}</td>

                  <td>₹{product.selling_price}</td>

                  <td>
                    <input
                      type="number"
                      min="1"
                      max={product.stock_quantity}
                      value={
                        selectedProducts[product.id]?.copies ??
                        product.stock_quantity
                      }
                      onChange={(e) =>
                        handleCopies(product.id, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="print-selected">
        <button onClick={printLabels}>
          🖨 Print Selected Labels
        </button>
      </div>
    </div>
  );
}

export default BarcodeLabels;