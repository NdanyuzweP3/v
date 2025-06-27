import React, { useState, useEffect } from 'react';
import { walletService } from '../services/walletService';
import { currencyService } from '../services/currencyService';
import { Wallet, Currency, Transaction } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const Wallets: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'wallets' | 'transactions'>('wallets');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [walletsResponse, currenciesResponse, transactionsResponse] = await Promise.all([
        walletService.getUserWallets(),
        currencyService.getCurrencies(),
        walletService.getTransactionHistory()
      ]);
      
      setWallets(walletsResponse.wallets);
      setCurrencies(currenciesResponse.currencies);
      setTransactions(transactionsResponse.transactions);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch wallet data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWallet = async (currencyId: number) => {
    try {
      await walletService.createWallet(currencyId);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create wallet');
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Wallets</h1>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('wallets')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'wallets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Wallets
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transaction History
          </button>
        </nav>
      </div>

      {activeTab === 'wallets' && (
        <div className="space-y-6">
          {/* Existing Wallets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {wallet.currency?.name || 'Unknown Currency'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {wallet.currency?.symbol}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    wallet.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {wallet.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Available:</span>
                    <span className="text-sm font-medium">{wallet.balance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Frozen:</span>
                    <span className="text-sm font-medium">{wallet.frozenBalance}</span>
                  </div>
                  {wallet.address && (
                    <div className="mt-3">
                      <span className="text-xs text-gray-500">Address:</span>
                      <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                        {wallet.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Create New Wallet */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Wallet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currencies
                .filter(currency => !wallets.some(wallet => wallet.currencyId === currency.id))
                .map((currency) => (
                  <div key={currency.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{currency.name}</h3>
                        <p className="text-sm text-gray-500">{currency.symbol}</p>
                      </div>
                      <button
                        onClick={() => handleCreateWallet(currency.id)}
                        className="btn btn-primary text-sm"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h2>
          
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
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
                      Fee
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
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === 'deposit' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.fee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};