import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function SalesHistory() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = () => {
    api
      .get("/sales")
      .then((response) => {
        setSales(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="sales-container">
      <h1 className="sales-title">Sales History</h1>

      {sales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.invoice_number}</td>

                <td>
                  {new Date(sale.sale_date).toLocaleString()}
                </td>

                <td>{sale.total_items}</td>

                <td>₹{Number(sale.total_amount).toFixed(2)}</td>

                <td>
                  <Link
                    to={`/invoice/${sale.id}`}
                    className="edit-btn"
                  >
                    View Invoice
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SalesHistory;