import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen message="Loading..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'rescuer') return <Navigate to="/rescuer/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
