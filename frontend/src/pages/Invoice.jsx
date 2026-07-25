import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Invoice() {
  const { saleId } = useParams();

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    fetchInvoice();
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
    return <h2>Loading invoice...</h2>;
  }

  const discount = Number(invoice.subtotal) - Number(invoice.total_amount);

  return (
    <div className="invoice-container">

      <div className="invoice">

        <h1>Sri Annur Readymades</h1>

        <p>Salem, Tamil Nadu</p>

        <hr />

        <h2>Invoice</h2>

        <p>
          <strong>Invoice No:</strong> {invoice.invoice_number}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(invoice.sale_date).toLocaleString()}
        </p>

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

        <hr />

        <h3>
          Subtotal : ₹{Number(invoice.subtotal).toFixed(2)}
        </h3>

        <h3>
          Discount : ₹{discount.toFixed(2)}
        </h3>

        <h2>
          Grand Total : ₹{Number(invoice.total_amount).toFixed(2)}
        </h2>

        <button onClick={() => window.print()}>
          Print Invoice
        </button>

      </div>

    </div>
  );
}

export default Invoice;