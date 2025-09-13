'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-2xl font-bold text-gray-800 cursor-pointer">Xeno CRM</span>
        </Link>
        <a
          href="/api/v1/oauth2/authorization/google"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 no-underline"
        >
          Login with Google
        </a>
      </nav>
    </header>
  );
}
