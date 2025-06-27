import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="text-xl font-bold">
                P2P Platform
              </Link>
              
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/dashboard')}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/orders"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/orders')}`}
                >
                  Orders
                </Link>
                <Link
                  to="/wallets"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/wallets')}`}
                >
                  Wallets
                </Link>
                <Link
                  to="/messages"
                  className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/messages')}`}
                >
                  Messages
                </Link>
                {user?.role === 'agent' && (
                  <Link
                    to="/pending-orders"
                    className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/pending-orders')}`}
                  >
                    Pending Orders
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin/users"
                      className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/admin/users')}`}
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/disputes"
                      className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/admin/disputes')}`}
                    >
                      Disputes
                    </Link>
                    <Link
                      to="/admin/kyc"
                      className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 ${isActive('/admin/kyc')}`}
                    >
                      KYC Reviews
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Welcome, {user?.username}
              </span>
              <Link
                to="/profile"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};