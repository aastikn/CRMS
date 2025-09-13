'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <main className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              <span className="block">Supercharge Your Customer Relationships</span>
              <span className="block text-blue-600">with Xeno CRM</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
              The simple, powerful, and intuitive platform to understand and engage your customers like never before.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="/api/v1/oauth2/authorization/google"
                className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
              >
                Get Started for Free
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Features Built for Growth</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to build lasting customer relationships.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center">
              <Image src="https://placehold.co/600x400/e2e8f0/4a5568" alt="Audience Segmentation" width={600} height={400} className="rounded-lg shadow-lg mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-2">Advanced Audience Segmentation</h3>
              <p className="text-gray-600">
                Create dynamic audience segments with our powerful visual builder or write raw queries. Target the right customers with the right message, every time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <Image src="https://placehold.co/600x400/dbeafe/1e40af" alt="Marketing Campaigns" width={600} height={400} className="rounded-lg shadow-lg mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-2">Targeted Marketing Campaigns</h3>
              <p className="text-gray-600">
                Launch personalized email or SMS campaigns to your audience segments. Track delivery, opens, and clicks to measure your impact.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <Image src="https://placehold.co/600x400/cce7ff/004494" alt="Customer Insights" width={600} height={400} className="rounded-lg shadow-lg mb-6 mx-auto" />
              <h3 className="text-2xl font-bold mb-2">360-Degree Customer Insights</h3>
              <p className="text-gray-600">
                Get a complete view of your customers, including their total spending, visit history, and recent interactions, all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p>&copy; {new Date().getFullYear()} Xeno CRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
