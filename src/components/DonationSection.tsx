'use client';

import { useState } from 'react';
import { Heart, QrCode, CreditCard, Copy, Check, Gift, Users, BookOpen, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, cardHover } from '@/lib/animations';

export default function DonationSection() {
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const copyToClipboard = (text: string, type: 'upi' | 'account') => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUPI(true);
      setTimeout(() => setCopiedUPI(false), 2000);
    } else {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const donationImpacts = [
    {
      amount: "₹500",
      impact: "Provides educational materials for 5 children",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600"
    },
    {
      amount: "₹1000",
      impact: "Funds a health checkup camp for 20 people",
      icon: Stethoscope,
      color: "from-green-500 to-green-600"
    },
    {
      amount: "₹2000",
      impact: "Sponsors meals for 50 underprivileged children",
      icon: Heart,
      color: "from-red-500 to-red-600"
    },
    {
      amount: "₹5000",
      impact: "Supports skill training for 10 women",
      icon: Users,
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            variants={fadeInLeft}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Support Our{' '}
                <motion.span 
                  className="bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Mission
                </motion.span>
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Your donation helps us continue our work in education, healthcare, and community development. 
                Every contribution, no matter the size, makes a meaningful difference.
              </motion.p>
            </motion.div>
            
            {/* Donation Impact Cards */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-gray-900 flex items-center">
                <Gift className="w-6 h-6 mr-2 text-yellow-500" />
                Your Impact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {donationImpacts.map((impact, index) => (
                  <motion.div
                    key={impact.amount}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                      <div className="flex items-start space-x-3">
                        <motion.div 
                          className={`w-12 h-12 bg-gradient-to-r ${impact.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <impact.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900 mb-1">
                            {impact.amount}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {impact.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Donate Button */}
            <motion.div
              className="pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/donate"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Now
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Donation Methods */}
          <motion.div 
            className="space-y-6"
            variants={fadeInRight}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Easy Ways to Donate
              </h3>
            </motion.div>
            
            {/* UPI Payment */}
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200"
              variants={cardHover}
              initial="initial"
              whileHover="hover"
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <motion.div 
                  className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <QrCode className="w-6 h-6 text-white" />
                </motion.div>
                <h4 className="text-xl font-semibold text-gray-900">UPI Payment</h4>
              </div>
              <p className="text-gray-600 mb-4">Scan QR code or use UPI ID for instant donation</p>
              <div className="bg-white p-4 rounded-xl border-2 border-dashed border-blue-300">
                <p className="text-sm text-gray-500 mb-2">UPI ID:</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-blue-600 font-semibold">hopefoundation@paytm</p>
                  <motion.button
                    onClick={() => copyToClipboard('hopefoundation@paytm', 'upi')}
                    className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {copiedUPI ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            {/* Bank Transfer */}
            <motion.div 
              className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200"
              variants={cardHover}
              initial="initial"
              whileHover="hover"
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <motion.div 
                  className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <CreditCard className="w-6 h-6 text-white" />
                </motion.div>
                <h4 className="text-xl font-semibold text-gray-900">Bank Transfer</h4>
              </div>
              <p className="text-gray-600 mb-4">Direct bank transfer for larger donations</p>
              <div className="bg-white p-4 rounded-xl border-2 border-dashed border-green-300 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Account Name:</p>
                    <p className="font-semibold text-gray-900">Bawaliya Seva Sansthan</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Account Number:</p>
                    <div className="flex items-center">
                      <p className="font-mono font-semibold text-gray-900">1234567890</p>
                      <motion.button
                        onClick={() => copyToClipboard('1234567890', 'account')}
                        className="ml-2 p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <AnimatePresence mode="wait">
                          {copiedAccount ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Check className="w-3 h-3 text-green-600" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Copy className="w-3 h-3" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">IFSC Code:</p>
                    <p className="font-mono font-semibold text-gray-900">SBIN0001234</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bank Name:</p>
                    <p className="font-semibold text-gray-900">State Bank of India</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security Note */}
            <motion.div 
              className="bg-yellow-50 p-4 rounded-xl border border-yellow-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">100% Transparent</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    All donations are tracked and receipts are provided. You'll receive updates on how your contribution is making a difference.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
