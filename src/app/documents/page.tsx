'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Eye } from 'lucide-react';

export default function DocumentsPage() {
  const documents = [
    {
      title: "Annual Report 2024",
      description: "Comprehensive overview of our activities and impact in 2024",
      type: "PDF",
      size: "2.1 MB",
      date: "2025-01-15",
      category: "Annual Reports"
    },
    {
      title: "Financial Statement 2024",
      description: "Detailed financial information and fund utilization",
      type: "PDF",
      size: "1.8 MB",
      date: "2025-01-10",
      category: "Financial"
    },
    {
      title: "Registration Certificate",
      description: "Official NGO registration certificate",
      type: "PDF",
      size: "856 KB",
      date: "2023-03-15",
      category: "Legal"
    },
    {
      title: "80G Tax Exemption Certificate",
      description: "Tax exemption certificate for donations",
      type: "PDF",
      size: "654 KB",
      date: "2024-04-01",
      category: "Legal"
    },
    {
      title: "Project Proposal Template",
      description: "Template for submitting new project proposals",
      type: "DOC",
      size: "245 KB",
      date: "2024-12-01",
      category: "Templates"
    },
    {
      title: "Volunteer Handbook",
      description: "Complete guide for volunteers",
      type: "PDF",
      size: "3.2 MB",
      date: "2024-11-20",
      category: "Guidelines"
    },
    {
      title: "Code of Conduct",
      description: "Organizational code of conduct and ethics",
      type: "PDF",
      size: "892 KB",
      date: "2024-01-15",
      category: "Guidelines"
    },
    {
      title: "Impact Report Q4 2024",
      description: "Quarterly impact assessment and metrics",
      type: "PDF",
      size: "1.5 MB",
      date: "2024-12-31",
      category: "Reports"
    }
  ];

  const categories = ["All", "Annual Reports", "Financial", "Legal", "Templates", "Guidelines", "Reports"];

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
                Document <span className="text-blue-600">Library</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Access important documents, reports, and resources related to our organization and programs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  className="px-4 py-2 rounded-full border border-gray-300 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Documents Grid */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.title}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {doc.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{doc.type}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{doc.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(doc.date).toLocaleDateString()}</span>
                    </div>
                    <span>{doc.size}</span>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Document Access Information</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Public Documents</h3>
                  <p className="text-gray-600 text-sm">Most documents are publicly available for transparency</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Free Downloads</h3>
                  <p className="text-gray-600 text-sm">All documents are available for free download</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Regular Updates</h3>
                  <p className="text-gray-600 text-sm">Documents are updated regularly with latest information</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Online Preview</h3>
                  <p className="text-gray-600 text-sm">Preview documents before downloading</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
