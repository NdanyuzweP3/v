import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { walletService } from '../services/walletService';
import { Order, Wallet } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersResponse, walletsResponse] = await Promise.all([
          orderService.getUserOrders(),
          walletService.getUserWallets()
        ]);
        
        setOrders(ordersResponse.orders.slice(0, 5)); // Show only recent 5 orders
        setWallets(walletsResponse.wallets);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome back, {user?.firstName || user?.username}!
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Total Balance</h3>
          <p className="text-2xl font-bold text-green-600">
            ${user?.walletBalance.toFixed(2)}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Active Orders</h3>
          <p className="text-2xl font-bold text-blue-600">
            {orders.filter(order => ['pending', 'matched', 'confirmed'].includes(order.status)).length}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Completed Orders</h3>
          <p className="text-2xl font-bold text-gray-600">
            {orders.filter(order => order.status === 'completed').length}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Wallets</h3>
          <p className="text-2xl font-bold text-purple-600">
            {wallets.length}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/orders/create"
            className="btn btn-primary text-center"
          >
            Create Order
          </Link>
          <Link
            to="/wallets"
            className="btn btn-secondary text-center"
          >
            View Wallets
          </Link>
          <Link
            to="/messages"
            className="btn btn-secondary text-center"
          >
            Messages
          </Link>
          <Link
            to="/profile"
            className="btn btn-secondary text-center"
          >
            Profile
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
          <Link to="/orders" className="text-blue-600 hover:text-blue-500">
            View All
          </Link>
        </div>
        
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};