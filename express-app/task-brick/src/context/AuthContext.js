// context/AuthContext.js
import React, { createContext, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../features/auth/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const login = useCallback((userData) => {
    dispatch(loginUser(userData));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const value = {
    ...auth,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
