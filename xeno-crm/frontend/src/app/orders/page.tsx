'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchOrders } from '../../lib/api';
import { Order, PaginatedResponse } from '../../lib/types';
import { RouteGuard } from '../../components/RouteGuard';
import { NewOrderModal } from '../../components/NewOrderModal';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageData, setPageData] = useState<PaginatedResponse<Order> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadOrders = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const data = await fetchOrders(page, 10);
      setPageData(data);
      setOrders(data.content);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage, loadOrders]);

  const handleCreationSuccess = () => {
    loadOrders(currentPage);
  };

  const renderPagination = () => {
    if (!pageData) return null;

    return (
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {pageData.totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage >= pageData.totalPages - 1}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <RouteGuard>
      <NewOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleCreationSuccess} 
      />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
            <div className="flex space-x-4">
              <button 
                onClick={() => loadOrders(currentPage)}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 cursor-pointer disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 cursor-pointer"
              >
                + Add Order
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            {isLoading ? (
              <p>Loading orders...</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer ID</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Order Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b">
                      <td className="p-4">#{order.id}</td>
                      <td className="p-4">{order.customerId}</td>
                      <td className="p-4">${order.orderAmount.toFixed(2)}</td>
                      <td className="p-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs font-semibold text-white bg-gray-500 rounded-full">{order.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {renderPagination()}
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
