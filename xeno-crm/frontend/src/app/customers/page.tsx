'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchCustomers, searchCustomers } from '../../lib/api';
import { Customer, PaginatedResponse } from '../../lib/types';
import { RouteGuard } from '../../components/RouteGuard';
import { NewCustomerModal } from '../../components/NewCustomerModal';

const DEBOUNCE_DELAY = 500;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pageData, setPageData] = useState<PaginatedResponse<Customer> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    minSpending: '',
    maxVisits: '',
    inactiveDays: '',
  });

  const loadCustomers = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const data = await fetchCustomers(page, 10);
      setPageData(data);
      setCustomers(data.content);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (currentFilters: typeof filters) => {
    const activeFilters = Object.entries(currentFilters).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {} as { [key: string]: any });

    if (Object.keys(activeFilters).length > 0) {
      setIsSearching(true);
      setIsLoading(true);
      try {
        const searchResults = await searchCustomers(activeFilters);
        setCustomers(searchResults);
        setPageData(null); // No pagination for search results
      } catch (error) {
        console.error("Failed to search customers", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsSearching(false);
      loadCustomers(0);
    }
  }, [loadCustomers]);

  useEffect(() => {
    if (!isSearching) {
      loadCustomers(currentPage);
    }
  }, [currentPage, isSearching, loadCustomers]);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(filters);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, handleSearch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCreationSuccess = () => {
    // Reset to the first page and reload customers
    setCurrentPage(0);
    setIsSearching(false); // Exit search mode if active
    setFilters({ minSpending: '', maxVisits: '', inactiveDays: '' }); // Reset filters
    loadCustomers(0);
  };

  const renderPagination = () => {
    if (!pageData || isSearching) return null;

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
      <NewCustomerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleCreationSuccess} 
      />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 cursor-pointer"
            >
              + New Customer
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="number"
                name="minSpending"
                value={filters.minSpending}
                onChange={handleFilterChange}
                placeholder="Min Spending"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="maxVisits"
                value={filters.maxVisits}
                onChange={handleFilterChange}
                placeholder="Max Visits"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="inactiveDays"
                value={filters.inactiveDays}
                onChange={handleFilterChange}
                placeholder="Inactive for (days)"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            {isLoading ? (
              <p>Loading customers...</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Total Spending</th>
                    <th className="p-4">Visits</th>
                    <th className="p-4">Last Visit</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer.id} className="border-b">
                      <td className="p-4">{customer.name}</td>
                      <td className="p-4">{customer.email}</td>
                      <td className="p-4">${customer.totalSpending.toFixed(2)}</td>
                      <td className="p-4">{customer.visitCount}</td>
                      <td className="p-4">{customer.lastVisit ? new Date(customer.lastVisit).toLocaleDateString() : 'N/A'}</td>
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