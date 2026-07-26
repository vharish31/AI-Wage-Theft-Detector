import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UserRoute from './components/UserRoute';
import AdminRoute from './components/AdminRoute';
import LoadingScreen from './components/LoadingScreen';

import ErrorBoundary from './components/ErrorBoundary';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Unauthorized from './pages/Unauthorized';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import VoiceLog from './pages/VoiceLog';
import VerificationMethod from './pages/VerificationMethod';
import Verification from './pages/Verification';
import Report from './pages/Report';

function RootRedirect() {
  const { isAuthenticated, role, isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingScreen message="Initializing session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/verify-method" replace />;
}

function AppContent() {
  const { isInitializing } = useAuth();
  const [workData, setWorkData] = useState(null);
  const [auditResult, setAuditResult] = useState(null);

  if (isInitializing) {
    return <LoadingScreen message="Verifying authentication credentials..." />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-[#0b1329] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        <ErrorBoundary>
          <div>
            <Navbar workData={workData} auditResult={auditResult} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
              {/* DEFAULT ROOT LANDING ROUTE REDIRECT */}
              <Route path="/" element={<RootRedirect />} />

              {/* PUBLIC ENTRY ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* PROTECTED DASHBOARDS & PROFILE */}
              <Route 
                path="/dashboard" 
                element={
                  <UserRoute>
                    <UserDashboard />
                  </UserRoute>
                } 
              />
              
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />

              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* PROTECTED WORKFLOW ROUTES */}
              <Route 
                path="/verify-method" 
                element={
                  <ProtectedRoute>
                    <VerificationMethod />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/voice-log" 
                element={
                  <ProtectedRoute>
                    <VoiceLog workData={workData} setWorkData={setWorkData} />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/verification" 
                element={
                  <ProtectedRoute>
                    <Verification workData={workData} setAuditResult={setAuditResult} />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/report" 
                element={
                  <ProtectedRoute>
                    <Report auditResult={auditResult} />
                  </ProtectedRoute>
                } 
              />

              {/* CATCH-ALL FALLBACK ROUTE */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </ErrorBoundary>
    </div>
  </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
