import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/SalesHistory.css";

function SalesHistory() {
  const [sales, setSales] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = () => {
    let url = "/sales";

    const params = [];

    if (fromDate) {
      params.push(`from_date=${fromDate}`);
    }

    if (toDate) {
      params.push(`to_date=${toDate}`);
    }

    if (params.length > 0) {
      url += "?" + params.join("&");
    }

    api
      .get(url)
      .then((response) => {
        setSales(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const resetFilter = () => {
    setFromDate("");
    setToDate("");

    api.get("/sales").then((response) => {
      setSales(response.data);
    });
  };

  const totalSales = sales.reduce(
    (sum, sale) => sum + Number(sale.total_amount),
    0
  );

  const totalItems = sales.reduce(
    (sum, sale) => sum + sale.total_items,
    0
  );

  return (
    <div className="sales-page">

      <h1 className="sales-title">Sales History</h1>

      <div className="sales-summary">

        <div className="summary-card">
          <h3>Total Sales</h3>
          <h2>₹{totalSales.toFixed(2)}</h2>
        </div>

        <div className="summary-card">
          <h3>Total Invoices</h3>
          <h2>{sales.length}</h2>
        </div>

        <div className="summary-card">
          <h3>Items Sold</h3>
          <h2>{totalItems}</h2>
        </div>

      </div>

      <div className="filter-card">

        <div className="filter-group">
          <label>From Date</label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <button
          className="filter-btn"
          onClick={fetchSales}
        >
          Filter
        </button>

        <button
          className="reset-btn"
          onClick={resetFilter}
        >
          Reset
        </button>

      </div>

      {sales.length === 0 ? (

        <div className="no-sales">
          No sales found.
        </div>

      ) : (

        <div className="table-wrapper">

          <table className="sales-table">

            <thead>

              <tr>

                <th>Invoice</th>

                <th>Date & Time</th>

                <th>Items</th>

                <th>Total</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {sales.map((sale) => (

                <tr key={sale.id}>

                  <td>{sale.invoice_number}</td>

                  <td>
                    {new Date(
                      sale.sale_date
                    ).toLocaleString()}
                  </td>

                  <td>{sale.total_items}</td>

                  <td>
                    ₹{Number(
                      sale.total_amount
                    ).toFixed(2)}
                  </td>

                  <td>

                    <Link
                      to={`/invoice/${sale.id}`}
                      className="view-btn"
                    >
                      View Invoice
                    </Link>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default SalesHistory;