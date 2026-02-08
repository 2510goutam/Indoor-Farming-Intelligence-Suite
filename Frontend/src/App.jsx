import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OTPVerification from './components/Auth/OTPVerification';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';
import Dashboard from './pages/Dashboard';
import Environment from './pages/Environment';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyProducts from './pages/MyProducts';
import MyListings from './pages/MyListings';
import Consultation from './pages/Consultation';
import AdminUsers from './pages/AdminUsers';
import AdminApprovals from './pages/AdminApprovals';
import VendorRegistration from './pages/VendorRegistration';
import PreSetupGuide from './pages/PreSetupGuide';

import { ThemeProvider } from './context/ThemeContext';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-slate-100 transition-colors duration-300">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<OTPVerification />} />


              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/consultation" element={
                <ProtectedRoute>
                  <Consultation />
                </ProtectedRoute>
              } />
              <Route path="/environment" element={
                <ProtectedRoute>
                  <Environment />
                </ProtectedRoute>
              } />
              <Route path="/marketplace" element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="/feedback" element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              } />
              <Route path="/my-products" element={
                <ProtectedRoute>
                  <MyProducts />
                </ProtectedRoute>
              } />
              <Route path="/my-listings" element={
                <ProtectedRoute>
                  <MyListings />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/approvals" element={
                <ProtectedRoute>
                  <AdminApprovals />
                </ProtectedRoute>
              } />
              <Route path="/vendor-register" element={
                <ProtectedRoute>
                  <VendorRegistration />
                </ProtectedRoute>
              } />
              <Route path="/pre-setup-advisor" element={
                <ProtectedRoute>
                  <PreSetupGuide />
                </ProtectedRoute>
              } />


              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

