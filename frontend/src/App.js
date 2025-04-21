import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/Settings";
import Config from "./pages/Config";
import Users from "./pages/Users.js";
import Backlog from "./pages/Backlog";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute"; 
import PublicRoute from "./components/PublicRoute";
import ChangePassword from "./components/ChangePassword";
import MuiDashboardPage from "./pages/MuiDashboardPage";

const NotFoundRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"} replace />;
  }
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        {/* ✅ Public Routes (Login & Password Recovery) */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* ✅ Protected Routes (Only for Logged-in Users) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mui-dashboard" element={<MuiDashboardPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/backlog" element={<Backlog />} />
        </Route>

        {/* Direct access for testing - remove in production */}
        <Route path="/test-dashboard" element={<MuiDashboardPage />} />
        <Route path="/test-backlog" element={<Backlog />} />

        {/* ✅ Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/config" element={<Config />} />
          <Route path="/users" element={<Users />} />
        </Route>

        {/* ✅ Catch-All Route for 404 */}
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
