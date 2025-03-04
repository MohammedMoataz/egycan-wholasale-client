import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const AdminRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, isTokenExpired } = useAuthStore();
  const location = useLocation();
  
  if (!isAuthenticated || !isAdmin || isTokenExpired()) {
    // Redirect to admin login page
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export default AdminRoute;