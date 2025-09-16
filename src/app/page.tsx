'use client';


import Image from 'next/image';
import { LandingNav } from '../components/LandingNav';

export default function HomePage() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <LandingNav />
      {/* Hero Section */}
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
              <span className="block">Supercharge Your Customer Relationships</span>
              <span className="block text-indigo-600 mt-2">with Xeno CRM</span>
            </h1>
            <p className="mt-8 max-w-3xl mx-auto text-lg md:text-xl text-gray-600">
              The simple, powerful, and intuitive platform to understand and engage your customers like never before.
            </p>
            <div className="mt-12 flex justify-center">
              <a
                href="/api/v1/oauth2/authorization/google"
                className="inline-block px-12 py-5 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-xl hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Get Started for Free
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Features Built for Growth</h2>
            <p className="mt-5 text-lg text-gray-600">Everything you need to build lasting customer relationships.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transition-transform transform hover:-translate-y-2">
              <Image src="https://placehold.co/600x400/e2e8f0/4a5568" alt="Audience Segmentation" width={600} height={400} className="rounded-lg mb-8 mx-auto" />
              <h3 className="text-2xl font-bold mb-4">Advanced Audience Segmentation</h3>
              <p className="text-gray-600 text-lg">
                Create dynamic audience segments with our powerful visual builder or write raw queries. Target the right customers with the right message, every time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transition-transform transform hover:-translate-y-2">
              <Image src="https://placehold.co/600x400/dbeafe/1e40af" alt="Marketing Campaigns" width={600} height={400} className="rounded-lg mb-8 mx-auto" />
              <h3 className="text-2xl font-bold mb-4">Targeted Marketing Campaigns</h3>
              <p className="text-gray-600 text-lg">
                Launch personalized email or SMS campaigns to your audience segments. Track delivery, opens, and clicks to measure your impact.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transition-transform transform hover:-translate-y-2">
              <Image src="https://placehold.co/600x400/cce7ff/004494" alt="Customer Insights" width={600} height={400} className="rounded-lg mb-8 mx-auto" />
              <h3 className="text-2xl font-bold mb-4">360-Degree Customer Insights</h3>
              <p className="text-gray-600 text-lg">
                Get a complete view of your customers, including their total spending, visit history, and recent interactions, all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-5 text-lg text-gray-600">Choose the plan that&apos;s right for your business.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Pricing Plan 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-indigo-200">
              <h3 className="text-2xl font-bold mb-4">Starter</h3>
              <p className="text-gray-500 mb-6">For small teams just getting started.</p>
              <p className="text-5xl font-extrabold text-gray-900 mb-6">$49<span className="text-lg font-medium text-gray-500">/mo</span></p>
              <ul className="text-left space-y-4 text-gray-600 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> 1,000 Contacts</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> Unlimited Campaigns</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> Audience Segmentation</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> Email Support</li>
              </ul>
              <a href="#" className="w-full inline-block px-8 py-4 bg-indigo-100 text-indigo-700 font-bold rounded-lg hover:bg-indigo-200 transition-all">Choose Plan</a>
            </div>

            {/* Pricing Plan 2 (Most Popular) */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-t-4 border-indigo-600 relative">
              <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold">Most Popular</span>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-gray-500 mb-6">For growing businesses that need more power.</p>
              <p className="text-5xl font-extrabold text-gray-900 mb-6">$99<span className="text-lg font-medium text-gray-500">/mo</span></p>
              <ul className="text-left space-y-4 text-gray-600 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> 10,000 Contacts</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> Unlimited Campaigns</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> Advanced Segmentation</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> AI-Powered Insights</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> Priority Support</li>
              </ul>
              <a href="#" className="w-full inline-block px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all">Choose Plan</a>
            </div>

            {/* Pricing Plan 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-t-4 border-indigo-200">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <p className="text-gray-500 mb-6">For large organizations with custom needs.</p>
              <p className="text-5xl font-extrabold text-gray-900 mb-6">Contact Us</p>
              <ul className="text-left space-y-4 text-gray-600 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> Unlimited Contacts</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> Dedicated Account Manager</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> Custom Integrations</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">&#10003;</span> 24/7/365 Support</li>
              </ul>
              <a href="#" className="w-full inline-block px-8 py-4 bg-indigo-100 text-indigo-700 font-bold rounded-lg hover:bg-indigo-200 transition-all">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-28 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Get in Touch</h2>
            <p className="mt-5 text-lg text-gray-600">Have questions? We&apos;d love to hear from you.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <form action="#" method="POST">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                  <input type="text" name="first-name" id="first-name" autoComplete="given-name" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                  <input type="text" name="last-name" id="last-name" autoComplete="family-name" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input id="email" name="email" type="email" autoComplete="email" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea id="message" name="message" rows={4} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
              </div>
              <div className="mt-8 text-right">
                <button type="submit" className="inline-block px-10 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">Xeno CRM</h3>
                    <p className="text-gray-400">The best way to manage your customer relationships.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Product</h3>
                    <ul className="space-y-2">
                        <li><a href="#features" className="hover:text-indigo-400">Features</a></li>
                        <li><a href="#pricing" className="hover:text-indigo-400">Pricing</a></li>
                        <li><a href="#" className="hover:text-indigo-400">Integrations</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Company</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-indigo-400">About Us</a></li>
                        <li><a href="#" className="hover:text-indigo-400">Careers</a></li>
                        <li><a href="#contact" className="hover:text-indigo-400">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Resources</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-indigo-400">Blog</a></li>
                        <li><a href="#" className="hover:text-indigo-400">Help Center</a></li>
                        <li><a href="#" className="hover:text-indigo-400">API Docs</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-8 text-center">
                <p>&copy; {new Date().getFullYear()} Xeno CRM. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
