'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Check, X, Eye, Trash2, Filter } from 'lucide-react';

interface Volunteer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  occupation?: string;
  city?: string;
  interests: string[];
  experience?: string;
  motivation?: string;
  availability: {
    weekdays: boolean;
    weekends: boolean;
    evenings: boolean;
  };
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  createdAt: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch('/api/volunteers');
      if (response.ok) {
        const data = await response.json();
        setVolunteers(data.volunteers);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateVolunteerStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/volunteers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          approvedBy: 'Admin' // In real app, this would be the current user
        }),
      });

      if (response.ok) {
        await fetchVolunteers();
        alert(`Volunteer ${status} successfully!`);
      } else {
        alert('Failed to update volunteer status');
      }
    } catch (error) {
      console.error('Error updating volunteer:', error);
      alert('Failed to update volunteer status');
    }
  };

  const deleteVolunteer = async (id: string) => {
    if (confirm('Are you sure you want to delete this volunteer application?')) {
      try {
        const response = await fetch(`/api/volunteers/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchVolunteers();
          alert('Volunteer deleted successfully!');
        } else {
          alert('Failed to delete volunteer');
        }
      } catch (error) {
        console.error('Error deleting volunteer:', error);
        alert('Failed to delete volunteer');
      }
    }
  };

  const filteredVolunteers = volunteers.filter(volunteer => 
    filter === 'all' || volunteer.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Volunteer Management</h1>
              <p className="text-gray-600 mt-2">Manage volunteer applications and approvals</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{volunteers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {volunteers.filter(v => v.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <X className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {volunteers.filter(v => v.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <X className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {volunteers.filter(v => v.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Volunteers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volunteer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {volunteer.firstName} {volunteer.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Age: {volunteer.age} • {volunteer.occupation || 'No occupation listed'}
                        </div>
                        {volunteer.city && (
                          <div className="text-sm text-gray-500">{volunteer.city}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{volunteer.email}</div>
                      <div className="text-sm text-gray-500">{volunteer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {volunteer.interests.slice(0, 2).map((interest, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {interest}
                          </span>
                        ))}
                        {volunteer.interests.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{volunteer.interests.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(volunteer.status)}`}>
                        {volunteer.status.charAt(0).toUpperCase() + volunteer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(volunteer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedVolunteer(volunteer)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {volunteer.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateVolunteerStatus(volunteer._id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateVolunteerStatus(volunteer._id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteVolunteer(volunteer._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVolunteers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No volunteers</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'No volunteer applications yet.' 
                  : `No volunteers with status: ${filter}`
                }
              </p>
            </div>
          )}
        </motion.div>

        {/* Volunteer Detail Modal */}
        {selectedVolunteer && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                  </h3>
                  <button
                    onClick={() => setSelectedVolunteer(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-sm text-gray-900">{selectedVolunteer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-sm text-gray-900">{selectedVolunteer.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age</label>
                      <p className="text-sm text-gray-900">{selectedVolunteer.age}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Occupation</label>
                      <p className="text-sm text-gray-900">{selectedVolunteer.occupation || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <p className="text-sm text-gray-900">{selectedVolunteer.city || 'Not specified'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Interests</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedVolunteer.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Availability</label>
                    <div className="flex space-x-4 mt-1">
                      {selectedVolunteer.availability.weekdays && (
                        <span className="text-sm text-green-600">Weekdays</span>
                      )}
                      {selectedVolunteer.availability.weekends && (
                        <span className="text-sm text-green-600">Weekends</span>
                      )}
                      {selectedVolunteer.availability.evenings && (
                        <span className="text-sm text-green-600">Evenings</span>
                      )}
                    </div>
                  </div>

                  {selectedVolunteer.experience && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience</label>
                      <p className="text-sm text-gray-900">{selectedVolunteer.experience}</p>
                    </div>
                  )}

                  {selectedVolunteer.motivation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Motivation</label>
                      <p className="text-sm text-gray-900">{selectedVolunteer.motivation}</p>
                    </div>
                  )}

                  {selectedVolunteer.emergencyContact && selectedVolunteer.emergencyContact.name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                      <p className="text-sm text-gray-900">
                        {selectedVolunteer.emergencyContact.name} ({selectedVolunteer.emergencyContact.relationship})
                        <br />
                        {selectedVolunteer.emergencyContact.phone}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    {selectedVolunteer.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            updateVolunteerStatus(selectedVolunteer._id, 'approved');
                            setSelectedVolunteer(null);
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            updateVolunteerStatus(selectedVolunteer._id, 'rejected');
                            setSelectedVolunteer(null);
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedVolunteer(null)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
