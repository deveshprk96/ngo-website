'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Heart, QrCode, CreditCard, Download, User, Mail, Phone } from 'lucide-react';

export default function DonatePage() {
  const [donationData, setDonationData] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    amount: '',
    paymentMethod: 'UPI',
    transactionId: '',
    purpose: 'General Donation',
    isAnonymous: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setDonationData({
      ...donationData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Donation recorded successfully!');
        setReceiptNumber(data.receiptNumber);
        setDonationData({
          donorName: '',
          donorEmail: '',
          donorPhone: '',
          amount: '',
          paymentMethod: 'UPI',
          transactionId: '',
          purpose: 'General Donation',
          isAnonymous: false
        });
      } else {
        setMessage(data.error || 'Failed to record donation');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = async () => {
    try {
      const response = await fetch('/api/generate-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiptNumber,
          donorName: donationData.isAnonymous ? 'Anonymous' : donationData.donorName,
          amount: donationData.amount,
          paymentMethod: donationData.paymentMethod,
          purpose: donationData.purpose,
          transactionId: donationData.transactionId
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donation-receipt-${receiptNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Make a Donation
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your generous contribution helps us continue our mission of creating positive change in communities. 
              Every donation makes a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Donation Methods */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Donate</h2>
                
                {/* UPI Payment */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <QrCode className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">UPI Payment</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Scan QR code or use UPI ID for instant donation</p>
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <div className="w-32 h-32 bg-gray-200 mx-auto mb-4 rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                    <p className="font-mono text-sm text-blue-600 font-semibold">hopefoundation@paytm</p>
                  </div>
                </div>

                {/* Bank Transfer */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <CreditCard className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Bank Transfer</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500">Account Name:</span>
                        <p className="font-medium">Hope Foundation</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Account Number:</span>
                        <p className="font-mono">1234567890</p>
                      </div>
                      <div>
                        <span className="text-gray-500">IFSC Code:</span>
                        <p className="font-mono">SBIN0001234</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Bank:</span>
                        <p className="font-medium">State Bank of India</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impact Section */}
                <div className="bg-blue-600 text-white p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Your Impact</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>₹500 - Educate 1 child for a month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>₹1,000 - Medical care for 5 people</span>
                    </div>
                    <div className="flex justify-between">
                      <span>₹2,000 - Plant and maintain 50 trees</span>
                    </div>
                    <div className="flex justify-between">
                      <span>₹5,000 - Meals for 100 people</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Donation Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Record Your Donation
              </h3>

              {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message}
                  {receiptNumber && (
                    <div className="mt-2">
                      <button
                        onClick={generateReceipt}
                        className="inline-flex items-center space-x-2 text-green-700 hover:text-green-800 font-medium"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Receipt</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Donor Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">Donor Information</h4>
                  </div>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      id="isAnonymous"
                      name="isAnonymous"
                      checked={donationData.isAnonymous}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isAnonymous" className="text-sm font-medium text-gray-700">
                      Make this donation anonymous
                    </label>
                  </div>

                  {!donationData.isAnonymous && (
                    <>
                      <div>
                        <label htmlFor="donorName" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="donorName"
                          name="donorName"
                          required={!donationData.isAnonymous}
                          value={donationData.donorName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="donorEmail" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="donorEmail"
                          name="donorEmail"
                          required={!donationData.isAnonymous}
                          value={donationData.donorEmail}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="donorPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="donorPhone"
                          name="donorPhone"
                          value={donationData.donorPhone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Donation Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Heart className="w-5 h-5 text-red-500" />
                    <h4 className="font-medium text-gray-900">Donation Details</h4>
                  </div>
                  
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Amount (₹) *
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      required
                      min="1"
                      value={donationData.amount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter donation amount"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method *
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      required
                      value={donationData.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction ID (if applicable)
                    </label>
                    <input
                      type="text"
                      id="transactionId"
                      name="transactionId"
                      value={donationData.transactionId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter transaction ID"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose
                    </label>
                    <select
                      id="purpose"
                      name="purpose"
                      value={donationData.purpose}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="General Donation">General Donation</option>
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Environment">Environment</option>
                      <option value="Women Empowerment">Women Empowerment</option>
                      <option value="Emergency Relief">Emergency Relief</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Recording...' : 'Record Donation'}
                </button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> This form is for recording your donation after you have made the payment. 
                  You will receive a receipt that can be used for tax purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
