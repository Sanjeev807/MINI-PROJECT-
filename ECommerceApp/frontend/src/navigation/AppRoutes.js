import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import WishlistScreen from '../screens/WishlistScreen';
import AdminDashboard from '../screens/AdminDashboard';

// Components
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Route Component (redirect based on user role if already logged in)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    // Redirect based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Regular User Route Component (block admin from accessing)
const UserRoute = ({ children }) => {
  const { user } = useAuth();
  
  // If admin tries to access user routes, redirect to admin dashboard
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginScreen />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterScreen />
            </PublicRoute>
          } 
        />

        {/* Home - Block admin from accessing */}
        <Route 
          path="/" 
          element={
            <UserRoute>
              <HomeScreen />
            </UserRoute>
          } 
        />
        <Route 
          path="/category/:category" 
          element={
            <UserRoute>
              <HomeScreen />
            </UserRoute>
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <ProtectedRoute>
              <UserRoute>
                <ProductDetailsScreen />
              </UserRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <UserRoute>
                <CartScreen />
              </UserRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <ProtectedRoute>
              <UserRoute>
                <CategoriesScreen />
              </UserRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserRoute>
                <ProfileScreen />
              </UserRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <UserRoute>
                <OrderHistoryScreen />
              </UserRoute>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute>
              <UserRoute>
                <WishlistScreen />
              </UserRoute>
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />

        {/* Catch all - redirect based on user role */}
        <Route 
          path="*" 
          element={
            user && user.role === 'admin' 
              ? <Navigate to="/admin" replace /> 
              : <Navigate to="/" replace />
          } 
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
