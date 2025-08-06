'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function RefundPage() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: August 6, 2025</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">General Policy</h2>
                <p className="text-gray-700 mb-4">
                  At Bawaliya Seva Sansthan, we greatly appreciate your donations and support. 
                  Due to the nature of charitable giving and the immediate allocation of funds 
                  to our programs, all donations are generally final and non-refundable.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Exceptional Circumstances</h2>
                <p className="text-gray-700 mb-4">Refunds may be considered in the following exceptional circumstances:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Technical Errors:</strong> Duplicate charges due to website or payment processing errors</li>
                  <li><strong>Unauthorized Transactions:</strong> Donations made without the account holder's authorization</li>
                  <li><strong>Processing Errors:</strong> Incorrect donation amounts due to system errors</li>
                  <li><strong>Event Cancellations:</strong> Refunds for event tickets when events are cancelled by us</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
                <p className="text-gray-700 mb-4">To request a refund under exceptional circumstances:</p>
                <ol className="list-decimal pl-6 text-gray-700 mb-4">
                  <li>Contact us within 30 days of the transaction</li>
                  <li>Provide transaction details including date, amount, and payment method</li>
                  <li>Explain the reason for the refund request</li>
                  <li>Provide any supporting documentation</li>
                </ol>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Time</h2>
                <p className="text-gray-700 mb-4">
                  If a refund is approved, it will be processed within 7-10 business days. 
                  The refund will be credited to the original payment method used for the donation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tax Implications</h2>
                <p className="text-gray-700 mb-4">
                  Please note that if a donation receipt was issued for tax purposes, 
                  you may need to adjust your tax filings if a refund is processed. 
                  We recommend consulting with a tax professional regarding any implications.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Tickets</h2>
                <p className="text-gray-700 mb-4">
                  For paid events or workshops:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Cancellations made 7+ days before the event: Full refund</li>
                  <li>Cancellations made 3-6 days before: 50% refund</li>
                  <li>Cancellations made less than 3 days before: No refund</li>
                  <li>Event cancelled by us: Full refund</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact for Refunds</h2>
                <p className="text-gray-700 mb-4">
                  To request a refund or ask questions about our refund policy, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Email: refunds@bawaliyaseva.org<br />
                    Phone: +91 98765 43210<br />
                    Subject Line: "Refund Request - [Transaction ID]"<br />
                    Address: 123 Community Center Road, Mumbai, Maharashtra 400001
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Alternative Options</h2>
                <p className="text-gray-700 mb-4">
                  If you're unable to receive a refund, we offer these alternatives:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Transfer your donation to a different program or project</li>
                  <li>Convert your donation to a tax-deductible charitable contribution</li>
                  <li>Use the amount as credit for future events or programs</li>
                </ul>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
