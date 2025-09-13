'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RouteGuard } from '../../components/RouteGuard';
import { CampaignHistoryItem, Order } from '../../lib/types';
import { fetchCampaigns, fetchRecentOrders } from '../../lib/api';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<CampaignHistoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('jwt_token', tokenFromUrl);
      window.dispatchEvent(new Event('local-storage'));
      router.replace('/dashboard');
    }

    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [campaignsData, ordersData] = await Promise.all([
          fetchCampaigns(),
          fetchRecentOrders(),
        ]);
        setCampaigns(campaignsData.slice(0, 5));
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }

    // The RouteGuard ensures a token exists, so we can always try to load data.
    loadDashboardData();
  }, [searchParams, router]);

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Link href="/campaigns/create">
              <span className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 cursor-pointer">
                + New Campaign
              </span>
            </Link>
          </div>
          
          {isLoading ? (
            <p>Loading dashboard...</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Latest Campaigns */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Latest Campaigns</h2>
                <div className="space-y-4">
                  {campaigns.length > 0 ? campaigns.map(campaign => (
                    <div key={campaign.id} className="bg-white p-4 rounded-lg shadow">
                      <p className="font-bold truncate">{campaign.name}</p>
                      <p className="text-sm text-gray-600">Sent to {campaign.audienceSize} people on {new Date(campaign.createdAt).toLocaleDateString()}</p>
                    </div>
                  )) : <p className="text-gray-500">No campaigns found.</p>}
                </div>
              </div>

              {/* Latest Orders */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Latest Orders</h2>
                <div className="space-y-4">
                  {orders.length > 0 ? orders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-lg shadow">
                      <p className="font-bold">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">Amount: ${order.orderAmount.toFixed(2)} on {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                  )) : <p className="text-gray-500">No orders found.</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RouteGuard>
  );
}