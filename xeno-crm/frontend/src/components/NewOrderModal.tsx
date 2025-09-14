'use client';

import { useState, useEffect } from 'react';
import { createOrder, fetchCustomers } from '../lib/api';
import { Customer } from '../lib/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function NewOrderModal({ isOpen, onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [orderAmount, setOrderAmount] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (isOpen) {
      // Fetch customers for the dropdown
      fetchCustomers(0, 100) // Fetch up to 100 customers
        .then(data => setCustomers(data.content))
        .catch(err => setError('Failed to load customers for dropdown.'));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      setError('Please select a customer.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await createOrder({
        customerId: selectedCustomerId,
        orderAmount: parseFloat(orderAmount),
        orderDate: new Date(orderDate).toISOString(),
      });
      onSuccess();
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'An error occurred.');
      } else {
        setError('An error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold mb-6">Add New Order</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <select
              value={selectedCustomerId || ''}
              onChange={e => setSelectedCustomerId(Number(e.target.value))}
              required
              className="w-full px-4 py-2 border rounded-md bg-white"
            >
              <option value="" disabled>Select a customer...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="Order Amount" 
              value={orderAmount} 
              onChange={e => setOrderAmount(e.target.value)} 
              required 
              className="w-full px-4 py-2 border rounded-md" 
            />
            <input 
              type="date" 
              placeholder="Order Date" 
              value={orderDate} 
              onChange={e => setOrderDate(e.target.value)} 
              required 
              className="w-full px-4 py-2 border rounded-md" 
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400">
              {isLoading ? 'Saving...' : 'Save Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
