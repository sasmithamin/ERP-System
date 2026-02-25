import { Routes, Route } from "react-router-dom";

import { AppLayout } from "@/components/layout";
import { Dashboard } from "@/pages/dashboard";
import { Login, ForgotPassword } from "@/pages/auth";

import Deliveries from "@/pages/deliveries/Deliveries";
import Inventory from "@/pages/inventory/Inventory";
import Orders from "@/pages/orders/Orders";
import Suppliers from "@/pages/suppliers/Suppliers";
import Shops from "@/pages/shops/Shops";
import Reports from "@/pages/reports/Reports";
import Settings from "@/pages/settings/Settings";
import ProtectedRoute from "@/components/auth/ProtectedRoute";


function App() {
  return (
    <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />

  {/* ADMIN ROUTES */}
  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />

      <Route path="inventory/*" element={<Inventory />} />
      <Route path="orders" element={<Orders />} />
      <Route path="suppliers" element={<Suppliers />} />
      <Route path="shops" element={<Shops />} />
      <Route path="reports/*" element={<Reports />} />
      <Route path="settings" element={<Settings />} />
      <Route path="deliveries/*" element={<Deliveries />} />
    </Route>
  </Route>

  {/* MANAGER ROUTES */}
  <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
    <Route path="/" element={<AppLayout />}>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="reports/*" element={<Reports />} />
    </Route>
  </Route>

  {/* STAFF ROUTES */}
  <Route element={<ProtectedRoute allowedRoles={["staff"]} />}>
    <Route path="/" element={<AppLayout />}>
      <Route path="deliveries/*" element={<Deliveries />} />
    </Route>
  </Route>
</Routes>
  );
}

export default App