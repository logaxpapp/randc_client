import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
  // Your authentication logic here (e.g., check if the user is logged in)
  // For demonstration purposes, we'll just return a boolean.
  const user = { loggedIn: false }; // Replace with actual user auth check
  return user && user.loggedIn;
};

const PrivateRoute = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
