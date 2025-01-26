// src/components/common/ProtectedRoute/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  // e.g. isAuthenticated from Redux or context
  isAuthenticated: boolean;
  redirectPath?: string;
}

/**
 * If not authenticated => redirect. Otherwise => render child routes.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  redirectPath = '/login',
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
