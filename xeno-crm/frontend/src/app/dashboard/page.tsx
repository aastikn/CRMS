'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // In a real app, you'd also want to remove the token from the URL
      // window.history.replaceState({}, document.title, "/dashboard");
      localStorage.setItem('jwt_token', token);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Xeno CRM</h1>
        <p className="text-lg text-gray-600 mb-8">Your mini Customer Relationship Management platform.</p>
        <Link href="/campaigns/create">
          <span className="px-8 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 cursor-pointer">
            Create a New Campaign
          </span>
        </Link>
      </div>
    </div>
  );
}