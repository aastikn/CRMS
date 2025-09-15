'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { fetchCustomerById, fetchOrdersByCustomer } from '../../../lib/api';
import { Customer, Order } from '../../../lib/types';
import { RouteGuard } from '../../../components/RouteGuard';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomerData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [customerData, ordersData] = await Promise.all([
        fetchCustomerById(id),
        fetchOrdersByCustomer(id),
      ]);
      setCustomer(customerData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch customer data", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCustomerData();
  }, [loadCustomerData]);

  if (isLoading) {
    return (
      <RouteGuard>
        <div className="min-h-screen bg-gray-50 p-8">
          <p>Loading customer details...</p>
        </div>
      </RouteGuard>
    );
  }

  if (!customer) {
    return (
      <RouteGuard>
        <div className="min-h-screen bg-gray-50 p-8">
          <p>Customer not found.</p>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Customer Details Card */}
          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{customer.name}</h1>
            <p className="text-lg text-gray-600">{customer.email}</p>
            <p className="text-lg text-gray-600">{customer.phone}</p>
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div>
                <p className="text-sm text-gray-500">Total Spending</p>
                <p className="text-2xl font-semibold">${customer.totalSpending.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Visits</p>
                <p className="text-2xl font-semibold">{customer.visitCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Visit</p>
                <p className="text-2xl font-semibold">{customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Order History</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Order Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="p-4">#{order.id}</td>
                    <td className="p-4">${order.orderAmount.toFixed(2)}</td>
                    <td className="p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-full">{order.status}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">No orders found for this customer.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
