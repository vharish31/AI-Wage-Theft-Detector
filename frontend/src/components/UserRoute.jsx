import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserRoute({ children }) {
  const { isAuthenticated, role } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
