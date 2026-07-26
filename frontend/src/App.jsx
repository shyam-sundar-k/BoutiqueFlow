import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Sales from "./pages/Sales";
import SalesHistory from "./pages/SalesHistory";
import Invoice from "./pages/Invoice";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import BarcodeLabels from "./pages/BarcodeLabels";
import "./styles/theme.css";

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />

          <Route path="/sales" element={<Sales />} />
          <Route path="/sales-history" element={<SalesHistory />} />

          <Route path="/reports" element={<Reports />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/barcode-labels" element={<BarcodeLabels />} />

          <Route path="/invoice/:saleId" element={<Invoice />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;