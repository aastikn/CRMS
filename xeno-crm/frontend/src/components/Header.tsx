'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Function to update login state
    const updateLoginState = () => {
      const token = localStorage.getItem('jwt_token');
      setIsLoggedIn(!!token);
    };

    // Initial check
    updateLoginState();

    // Listen for changes in other tabs
    window.addEventListener('storage', updateLoginState);
    
    // Listen for changes in the same tab (custom event)
    window.addEventListener('local-storage', updateLoginState);

    return () => {
      window.removeEventListener('storage', updateLoginState);
      window.removeEventListener('local-storage', updateLoginState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    // Dispatch custom event to notify components in the same tab
    window.dispatchEvent(new Event('local-storage'));
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <span className="text-2xl font-bold text-gray-800 cursor-pointer">Xeno CRM</span>
          </Link>
          {isLoggedIn && (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/dashboard"><span className="font-semibold text-gray-600 hover:text-blue-600">Dashboard</span></Link>
              <Link href="/campaigns"><span className="font-semibold text-gray-600 hover:text-blue-600">Campaigns</span></Link>
              <Link href="/orders"><span className="font-semibold text-gray-600 hover:text-blue-600">Orders</span></Link>
              <Link href="/customers"><span className="font-semibold text-gray-600 hover:text-blue-600">Customers</span></Link>
            </div>
          )}
        </div>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 no-underline"
          >
            Logout
          </button>
        ) : (
          <a
            href="/api/v1/oauth2/authorization/google"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 no-underline"
          >
            Login with Google
          </a>
        )}
      </nav>
    </header>
  );
}
