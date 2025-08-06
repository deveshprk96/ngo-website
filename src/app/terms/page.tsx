'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last updated: August 6, 2025</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using the Bawaliya Seva Sansthan website and services, you accept 
                  and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Services</h2>
                <p className="text-gray-700 mb-4">You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Use the service in any way that violates applicable laws or regulations</li>
                  <li>Transmit any harmful or malicious content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use the service for any fraudulent purposes</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Donations</h2>
                <p className="text-gray-700 mb-4">
                  All donations made through our website are final and non-refundable except in cases of:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Technical errors resulting in duplicate charges</li>
                  <li>Unauthorized use of payment methods</li>
                  <li>Other exceptional circumstances at our discretion</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Volunteer Services</h2>
                <p className="text-gray-700 mb-4">
                  Volunteer participation is subject to approval and background verification. 
                  We reserve the right to refuse volunteer applications or terminate volunteer 
                  relationships at our discretion.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  The content, organization, graphics, design, compilation, magnetic translation, 
                  digital conversion and other matters related to the site are protected under 
                  applicable copyrights, trademarks and other proprietary rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  Bawaliya Seva Sansthan shall not be liable for any indirect, incidental, special, 
                  consequential, or punitive damages, including without limitation, loss of profits, 
                  data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these terms at any time. Changes will be posted 
                  on this page with an updated revision date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Email: legal@bawaliyaseva.org<br />
                    Phone: +91 98765 43210<br />
                    Address: 123 Community Center Road, Mumbai, Maharashtra 400001
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
