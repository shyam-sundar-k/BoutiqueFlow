import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/Invoice.css";

function Invoice() {
  const { saleId } = useParams();

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/sales/${saleId}`);
      setInvoice(response.data);
    } catch (error) {
      console.error(error);
      alert("Unable to load invoice.");
    }
  };

  if (!invoice) {
    return (
      <div className="invoice-page">
        <h2>Loading Invoice...</h2>
      </div>
    );
  }

  const discount =
    Number(invoice.subtotal) - Number(invoice.total_amount);

  return (
    <div className="invoice-page">
      <div className="invoice-card">
        <div className="invoice-header">
          <div>
            <h1>Sri Annur Readymades</h1>
            <p>Salem, Tamil Nadu</p>
            <p>
              <strong>GSTIN:</strong> XXXXXXXXXXXXXX
            </p>
          </div>

          <div className="invoice-info">
            <h2>TAX INVOICE</h2>

            <p>
              <strong>Invoice No:</strong>
              <br />
              {invoice.invoice_number}
            </p>

            <p>
              <strong>Date:</strong>
              <br />
              {new Date(invoice.sale_date).toLocaleString()}
            </p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.product_id}>
                <td>{item.product_name}</td>

                <td>{item.quantity}</td>

                <td>₹{Number(item.unit_price).toFixed(2)}</td>

                <td>₹{Number(item.line_total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-total">
          <table>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td>₹{Number(invoice.subtotal).toFixed(2)}</td>
              </tr>

              <tr>
                <td>Discount</td>
                <td>₹{discount.toFixed(2)}</td>
              </tr>

              <tr>
                <td>GST</td>
                <td>₹0.00</td>
              </tr>

              <tr className="grand-total">
                <td>Grand Total</td>
                <td>₹{Number(invoice.total_amount).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="invoice-footer">
          <p>Thank you for shopping with us.</p>
          <p>Goods once sold cannot be exchanged.</p>
          <h3>Visit Again!</h3>
        </div>

        <div className="print-area">
          <button
            className="print-btn"
            onClick={() => window.print()}
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default Invoice;