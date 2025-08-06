'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Users, Heart, Award, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                About <span className="text-blue-600">Bawaliya Seva Sansthan</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dedicated to creating positive change in our community through compassionate service and sustainable development initiatives.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Bawaliya Seva Sansthan is committed to empowering communities through education, healthcare, and sustainable development. We believe in creating lasting change that improves lives and builds stronger communities.
                </p>
                <p className="text-lg text-gray-600">
                  Our work focuses on reaching the most vulnerable populations and providing them with the tools and resources they need to thrive.
                </p>
              </motion.div>
              
              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">Community</h3>
                  <p className="text-sm text-gray-600">Building stronger communities</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <Heart className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">Care</h3>
                  <p className="text-sm text-gray-600">Compassionate service</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">Excellence</h3>
                  <p className="text-sm text-gray-600">Quality in everything</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg text-center">
                  <Target className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900">Impact</h3>
                  <p className="text-sm text-gray-600">Measurable results</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Vision</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                To create a world where every individual has access to quality education, healthcare, and opportunities for growth, 
                fostering sustainable development and social justice for all.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-lg text-gray-600">The principles that guide our work and decisions</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Transparency",
                  description: "We maintain open and honest communication in all our operations and use of resources."
                },
                {
                  title: "Compassion",
                  description: "We approach every situation with empathy and understanding for those we serve."
                },
                {
                  title: "Sustainability",
                  description: "We focus on creating long-term solutions that will benefit communities for generations."
                },
                {
                  title: "Integrity",
                  description: "We uphold the highest ethical standards in all our interactions and decisions."
                },
                {
                  title: "Collaboration",
                  description: "We work together with communities, partners, and stakeholders to achieve common goals."
                },
                {
                  title: "Innovation",
                  description: "We embrace new ideas and approaches to create more effective solutions."
                }
              ].map((value, index) => (
                <motion.div
                  key={value.title}
                  className="bg-gray-50 p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
