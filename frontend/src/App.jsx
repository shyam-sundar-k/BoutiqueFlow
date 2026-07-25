import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Products */}
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />

          {/* Sales */}
          <Route path="/sales" element={<Sales />} />
          <Route path="/sales-history" element={<SalesHistory />} />

          {/* Reports */}
          <Route path="/reports" element={<Reports />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          
          {/* Barcode Labels */}
          <Route path="/barcode-labels" element={<BarcodeLabels />} />

          {/* Invoice */}
          <Route path="/invoice/:saleId" element={<Invoice />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;