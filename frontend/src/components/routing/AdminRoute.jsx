import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
  const token = localStorage.getItem('token');
  
  // Cleanly parse the JWT to check the user's role profile parameter payload
  let userRole = null;
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      userRole = payload.role; // Assumes your backend JWT sign function includes { role: user.role }
    } catch (e) {
      console.error("Invalid token parsing:", e);
    }
  }

  // If there's no token or the role isn't 'admin', bounce them back to the login page
  if (!token || userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  // If authenticated as admin, render the nested child components smoothly
  return <Outlet />;
}