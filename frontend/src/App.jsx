import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/login/login";
import Register from "./pages/register/Register";
import BuyerDashboard from "./pages/Dashboard/BuyerDashboard";
import SellerDashboard from "./pages/Dashboard/SellerDashboard";
import DashboardRouter from "./pages/Dashboard/DashboardRouter";

// import NotFound from "./pages/NotFound/NotFound";

import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* Private Pages */}
        <Route
          path="/dashboard"
          element={
            <DashboardRouter />
          }
        />

        {/* 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </BrowserRouter>
  );
}