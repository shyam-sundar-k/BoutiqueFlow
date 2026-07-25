import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/dashboard.css";

export default function Reports() {
  const [report, setReport] = useState({
    today_sales: 0,
    week_sales: 0,
    month_sales: 0,
    today_items: 0,
    week_items: 0,
    month_items: 0,
  });

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/reports/summary"
      );

      setReport(res.data);
    } catch (err) {
      console.error("Error loading reports:", err);
    }
  };

  const formatCurrency = (value) =>
    Number(value).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Reports</h1>

      <h2 className="report-heading">Sales Amount</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <p className="card-title">Today's Sales</p>
          <h2 className="card-value">
            {formatCurrency(report.today_sales)}
          </h2>
        </div>

        <div className="dashboard-card">
          <p className="card-title">Weekly Sales</p>
          <h2 className="card-value">
            {formatCurrency(report.week_sales)}
          </h2>
        </div>

        <div className="dashboard-card">
          <p className="card-title">Monthly Sales</p>
          <h2 className="card-value">
            {formatCurrency(report.month_sales)}
          </h2>
        </div>
      </div>

      <h2 className="report-heading">Items Sold</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <p className="card-title">Today</p>
          <h2 className="card-value">
            {report.today_items}
          </h2>
        </div>

        <div className="dashboard-card">
          <p className="card-title">This Week</p>
          <h2 className="card-value">
            {report.week_items}
          </h2>
        </div>

        <div className="dashboard-card">
          <p className="card-title">This Month</p>
          <h2 className="card-value">
            {report.month_items}
          </h2>
        </div>
      </div>
    </div>
  );
}