import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { currencyService } from '../services/currencyService';
import { Currency } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const CreateOrder: React.FC = () => {
  const [formData, setFormData] = useState({
    currencyId: '',
    amount: '',
    price: '',
    type: 'buy' as 'buy' | 'sell',
    description: ''
  });
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await currencyService.getCurrencies();
      setCurrencies(response.currencies);
    } catch (err) {
      console.error('Error fetching currencies:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await orderService.createOrder({
        currencyId: parseInt(formData.currencyId),
        amount: parseFloat(formData.amount),
        price: parseFloat(formData.price),
        type: formData.type,
        description: formData.description || undefined
      });
      
      navigate('/orders');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  const totalValue = formData.amount && formData.price 
    ? (parseFloat(formData.amount) * parseFloat(formData.price)).toFixed(2)
    : '0.00';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
        <p className="text-gray-600 mt-2">Fill in the details to create a new trading order</p>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="form-label">
                Order Type
              </label>
              <select
                id="type"
                name="type"
                required
                className="form-input"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div>
              <label htmlFor="currencyId" className="form-label">
                Currency
              </label>
              <select
                id="currencyId"
                name="currencyId"
                required
                className="form-input"
                value={formData.currencyId}
                onChange={handleChange}
              >
                <option value="">Select Currency</option>
                {currencies.map((currency) => (
                  <option key={currency.id} value={currency.id}>
                    {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.00000001"
                min="0"
                required
                className="form-input"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00000000"
              />
            </div>

            <div>
              <label htmlFor="price" className="form-label">
                Price (USD)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                className="form-input"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="form-label">
              Total Value
            </label>
            <div className="text-2xl font-bold text-green-600">
              ${totalValue}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="form-input"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any additional details about your order..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};