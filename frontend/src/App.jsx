import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Home from "./pages/Home/Home";
import Login from "./pages/login/login";
import Register from "./pages/register/Register";
import VerifySeller from "./pages/VerifySeller/VerifySeller";
import BuyerDashboard from "./pages/Dashboard/BuyerDashboard";
import SellerDashboard from "./pages/Dashboard/SellerDashboard";
import DashboardRouter from "./pages/Dashboard/DashboardRouter";
import GetVerified from "./pages/GetVerified/GetVerified";
import Navbar from "./components/Navbar/Navbar";
import Deals from "./pages/Deals/Deals";
import DealRoom from "./pages/DealRoom/DealRoom";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";
import VerificationStatus from "./pages/Dashboard/VerificationStatus/VerificationStatus";
import AdminDashboard from "./components/admin/AdminVerificationPanel";
import AdminRoute from "./components/routing/AdminRoute";
import AdminVerificationPanel from "./components/admin/AdminVerificationPanel";


function Layout() {
  const location = useLocation();
  
  // FIXED: Changed to .startsWith() so the Navbar stays hidden on any sub-routes under /admin or /dashboard
  const hideNavbar = [
    "/login", 
    "/register"
  ].includes(location.pathname) || 
  location.pathname.startsWith("/dashboard") || 
  location.pathname.startsWith("/deals") || 
  location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/verify-seller" element={<VerifySeller />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/get-verified" element={<GetVerified />} />

        {/* Private User/Seller Pages */}
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/deals/:id" element={<DealRoom />} />
        <Route
          path="/dashboard/verification"
          element={
            <ProtectedRoute>
              <VerificationStatus />
            </ProtectedRoute>
          }
        />

        {/* FIXED: Swapped out ProtectedRoute wrapper for your nested AdminRoute gate component */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminVerificationPanel />} />
        </Route>

        {/* 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}