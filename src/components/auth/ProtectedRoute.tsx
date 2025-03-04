import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isTokenExpired } = useAuthStore();
  const location = useLocation();
  
  if (!isAuthenticated || isTokenExpired()) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;