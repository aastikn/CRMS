'use client';

import Link from 'next/link';

export function LandingNav() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <span className="text-2xl font-bold text-indigo-600">Xeno CRM</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-indigo-600 font-medium">Pricing</a>
            <a href="#contact" className="text-gray-600 hover:text-indigo-600 font-medium">Contact</a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/api/v1/oauth2/authorization/google" className="text-gray-600 hover:text-indigo-600 font-medium">Login</a>
            <a
              href="/api/v1/oauth2/authorization/google"
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
