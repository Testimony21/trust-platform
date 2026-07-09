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
// import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoutes";



function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register", "/dashboard"].includes(location.pathname);

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

        {/* Private Pages */}
        <Route path="/dashboard" element={<DashboardRouter />} />

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