'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  Receipt, 
  Search, 
  Calendar, 
  Download, 
  Filter,
  Plus,
  Eye,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';

interface Donation {
  _id: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amount: number;
  purpose: string;
  paymentMethod: 'UPI' | 'Bank Transfer' | 'Cash';
  transactionId?: string;
  receiptNumber: string;
  isAnonymous: boolean;
  status: 'Pending' | 'Completed' | 'Failed';
  createdAt: string;
  updatedAt: string;
}

export default function DonationsManagement() {
  const { data: session, status } = useSession();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [generatingReceipt, setGeneratingReceipt] = useState<string | null>(null);

  // New donation form state
  const [newDonation, setNewDonation] = useState({
    donorName: '',
    email: '',
    phone: '',
    amount: '',
    purpose: 'General Donation',
    paymentMode: 'cash' as 'online' | 'cash' | 'cheque' | 'bank_transfer'
  });

  // Fetch donations
  useEffect(() => {
    fetchDonations();
  }, []);

  // Filter donations based on search and filters
  useEffect(() => {
    let filtered = donations;

    if (searchTerm) {
      filtered = filtered.filter(donation =>
        donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.donorEmail.includes(searchTerm) ||
        (donation.donorPhone && donation.donorPhone.includes(searchTerm))
      );
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(donation => {
        const donationDate = new Date(donation.createdAt);
        return donationDate.toDateString() === filterDate.toDateString();
      });
    }

    if (paymentFilter) {
      filtered = filtered.filter(donation => donation.paymentMethod === paymentFilter);
    }

    setFilteredDonations(filtered);
  }, [donations, searchTerm, dateFilter, paymentFilter]);

  // Check authentication
  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/donations');
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
        setFilteredDonations(data);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newDonation,
          amount: parseFloat(newDonation.amount),
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        await fetchDonations();
        setShowAddModal(false);
        setNewDonation({
          donorName: '',
          email: '',
          phone: '',
          amount: '',
          purpose: 'General Donation',
          paymentMode: 'cash'
        });
      }
    } catch (error) {
      console.error('Error adding donation:', error);
    }
  };

  const generateReceipt = async (donationId: string) => {
    setGeneratingReceipt(donationId);
    try {
      const response = await fetch(`/api/generate-receipt/${donationId}`, {
        method: 'GET', // Changed from POST to GET
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `donation-receipt-${donationId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Update the donation status
        await fetchDonations();
        alert('Receipt downloaded successfully!');
      } else {
        alert('Failed to generate receipt. Please try again.');
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt. Please try again.');
    } finally {
      setGeneratingReceipt(null);
    }
  };

  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalDonations = donations.length;
  const monthlyDonations = donations.filter(donation => {
    const donationDate = new Date(donation.createdAt); // Changed from date to createdAt
    const currentDate = new Date();
    return donationDate.getMonth() === currentDate.getMonth() && 
           donationDate.getFullYear() === currentDate.getFullYear();
  }).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || !session.user?.role || !['admin', 'super_admin', 'moderator'].includes(session.user.role)) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation Management</h1>
          <p className="text-gray-600">Manage donations and generate receipts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-semibold text-gray-900">₹{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-semibold text-gray-900">{totalDonations}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">{monthlyDonations}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Donors</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(donations.map(d => d.donorEmail)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>

              {/* Payment Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="">All Payment Modes</option>
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            {/* Add Donation Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Donation
            </button>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Mode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{donation.donorName}</div>
                        <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                        <div className="text-sm text-gray-500">{donation.donorPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">₹{donation.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{donation.purpose}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        donation.paymentMethod === 'UPI' ? 'bg-green-100 text-green-800' :
                        donation.paymentMethod === 'Cash' ? 'bg-blue-100 text-blue-800' :
                        donation.paymentMethod === 'Bank Transfer' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {donation.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => generateReceipt(donation._id)}
                          disabled={generatingReceipt === donation._id}
                          className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                            donation.receiptNumber // Changed from receiptGenerated
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          } ${generatingReceipt === donation._id ? 'opacity-50' : ''}`}
                        >
                          {generatingReceipt === donation._id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          {donation.receiptNumber ? 'Download' : 'Generate Receipt'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDonations.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No donations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || dateFilter || paymentFilter 
                  ? 'Try adjusting your filters'
                  : 'Get started by adding a new donation.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Donation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Donation</h3>
            
            <form onSubmit={handleAddDonation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Donor Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newDonation.donorName}
                  onChange={(e) => setNewDonation({ ...newDonation, donorName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newDonation.email}
                  onChange={(e) => setNewDonation({ ...newDonation, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newDonation.phone}
                  onChange={(e) => setNewDonation({ ...newDonation, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newDonation.amount}
                  onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newDonation.purpose}
                  onChange={(e) => setNewDonation({ ...newDonation, purpose: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Mode *
                </label>
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newDonation.paymentMode}
                  onChange={(e) => setNewDonation({ ...newDonation, paymentMode: e.target.value as any })}
                >
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                  <option value="cheque">Cheque</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
