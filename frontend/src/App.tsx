import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Auth pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Main pages
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';
import { CreateOrder } from './pages/CreateOrder';
import { Wallets } from './pages/Wallets';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { PendingOrders } from './pages/PendingOrders';

// Admin pages
import { AdminUsers } from './pages/admin/Users';
import { AdminDisputes } from './pages/admin/Disputes';
import { AdminKYC } from './pages/admin/KYC';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <ProtectedRoute>
                <Layout>
                  <Orders />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/orders/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateOrder />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/wallets" element={
              <ProtectedRoute>
                <Layout>
                  <Wallets />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/messages" element={
              <ProtectedRoute>
                <Layout>
                  <Messages />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Agent routes */}
            <Route path="/pending-orders" element={
              <ProtectedRoute requiredRole={['agent', 'admin']}>
                <Layout>
                  <PendingOrders />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole={['admin']}>
                <Layout>
                  <AdminUsers />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/disputes" element={
              <ProtectedRoute requiredRole={['admin']}>
                <Layout>
                  <AdminDisputes />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/kyc" element={
              <ProtectedRoute requiredRole={['admin']}>
                <Layout>
                  <AdminKYC />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;