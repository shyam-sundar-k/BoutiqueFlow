import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardCard from "../components/dashboard/DashboardCard";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    summary: {
      total_products: 0,
      total_stock: 0,
      inventory_value: 0,
      low_stock: 0,
    },
    low_stock_products: [],
    recent_products: [],
  });

  useEffect(() => {
    api
      .get("/dashboard")
      .then((response) => {
        setDashboard(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const { summary, low_stock_products, recent_products } = dashboard;

      return (
  <div className="dashboard-container">
    <h1 className="dashboard-title">Dashboard</h1>

    <div className="dashboard-grid">
      <DashboardCard
        title="Total Products"
        value={summary.total_products}
      />

      <DashboardCard
        title="Total Stock"
        value={summary.total_stock}
      />

      <DashboardCard
        title="Inventory Value"
        value={`₹ ${summary.inventory_value}`}
      />

      <DashboardCard
        title="Low Stock Products"
        value={summary.low_stock}
      />
    </div>

    <div className="dashboard-tables">
      {/* Low Stock */}
      <div className="dashboard-section">
        <h2>Low Stock Products</h2>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
            </tr>
          </thead>

          <tbody>
            {low_stock_products.map((product) => (
              <tr key={product.id}>
                <td>{product.product_name}</td>
                <td>{product.stock_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recently Added */}
      <div className="dashboard-section">
        <h2>Recently Added Products</h2>

        <table>
          <thead>
            <tr>
              <th>Product</th>
            </tr>
          </thead>

                    <tbody>
            {recent_products.map((product) => (
              <tr key={product.id}>
                <td>{product.product_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}

export default Dashboard;