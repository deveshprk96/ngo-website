'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  User, Download, Calendar, CreditCard, FileText, 
  Activity, Award, Bell, Settings, Edit, Eye,
  Mail, Phone, MapPin, Users, BookOpen, Heart
} from 'lucide-react';

interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  dateOfBirth: Date;
  occupation: string;
  interests: string[];
  membershipType: 'basic' | 'premium' | 'lifetime';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  joinedAt: Date;
  membershipNumber?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

interface DashboardStats {
  eventsAttended: number;
  volunteerHours: number;
  donationsAmount: number;
  certificatesEarned: number;
}

export default function MemberDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Demo member data (in real app, fetch from API based on session)
  const demoMember: Member = {
    _id: '1',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    address: {
      street: '123 Gandhi Nagar',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    dateOfBirth: new Date('1995-06-15'),
    occupation: 'Software Engineer',
    interests: ['education', 'environment', 'healthcare'],
    membershipType: 'premium',
    status: 'approved',
    joinedAt: new Date('2023-01-15'),
    membershipNumber: 'HF2023001',
    emergencyContact: {
      name: 'Rakesh Sharma',
      relationship: 'Father',
      phone: '+91 98765 43211'
    }
  };

  const demoStats: DashboardStats = {
    eventsAttended: 12,
    volunteerHours: 45,
    donationsAmount: 25000,
    certificatesEarned: 3
  };

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/signin?callbackUrl=/dashboard');
      return;
    }

    // In real app, fetch member data from API
    // fetchMemberData(session.user.id);
    
    // Using demo data
    setMember(demoMember);
    setStats(demoStats);
    setLoading(false);
  }, [session, status, router]);

  const handleDownloadIdCard = async () => {
    if (!member) return;
    
    try {
      // In real app, call API to generate and download ID card
      // const response = await fetch(`/api/generate-id-card/${member._id}`);
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `${member.firstName}_${member.lastName}_ID_Card.pdf`;
      // a.click();
      
      // Demo alert
      alert('ID Card download will be implemented with PDF generation API');
    } catch (error) {
      console.error('Error downloading ID card:', error);
      alert('Error downloading ID card. Please try again.');
    }
  };

  const handleDownloadCertificate = async (type: string) => {
    if (!member) return;
    
    try {
      // In real app, call API to generate certificate
      alert(`${type} certificate download will be implemented with PDF generation API`);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Error downloading certificate. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Member not found</h3>
            <p className="text-gray-600">Unable to load member information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {member.firstName} {member.lastName}
                </h1>
                <p className="text-gray-600">Member ID: {member.membershipNumber}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : member.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.membershipType === 'lifetime'
                      ? 'bg-purple-100 text-purple-800'
                      : member.membershipType === 'premium'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.membershipType.charAt(0).toUpperCase() + member.membershipType.slice(1)} Member
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleDownloadIdCard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download ID Card
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.eventsAttended}</div>
              <div className="text-sm text-gray-600">Events Attended</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.volunteerHours}</div>
              <div className="text-sm text-gray-600">Volunteer Hours</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">₹{stats.donationsAmount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Donations</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.certificatesEarned}</div>
              <div className="text-sm text-gray-600">Certificates</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'activities', label: 'Activities', icon: Activity },
                { id: 'notifications', label: 'Notifications', icon: Bell }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
              
              {/* Recent Activities */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Attended Healthcare Camp</p>
                      <p className="text-sm text-gray-600">February 20, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                    <Heart className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Donated ₹5,000</p>
                      <p className="text-sm text-gray-600">February 15, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Volunteered at Tree Plantation</p>
                      <p className="text-sm text-gray-600">February 10, 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div className="flex-1">
                      <p className="font-medium">Monthly Health Camp</p>
                      <p className="text-sm text-gray-600">March 5, 2024 • Rampur Village</p>
                    </div>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Register
                    </button>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div className="flex-1">
                      <p className="font-medium">Environment Day Celebration</p>
                      <p className="text-sm text-gray-600">June 5, 2024 • Multiple Locations</p>
                    </div>
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{member.firstName} {member.lastName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{member.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-medium">{member.dateOfBirth.toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Occupation</p>
                        <p className="font-medium">{member.occupation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Address & Emergency Contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">
                          {member.address.street}<br />
                          {member.address.city}, {member.address.state}<br />
                          {member.address.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Emergency Contact</p>
                        <p className="font-medium">
                          {member.emergencyContact.name} ({member.emergencyContact.relationship})
                        </p>
                        <p className="text-sm text-gray-600">{member.emergencyContact.phone}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Interests</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.interests.map(interest => (
                          <span key={interest} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Documents & Certificates</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Membership ID Card</h3>
                      <p className="text-sm text-gray-600">Digital membership card with QR code</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadIdCard}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download ID Card
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Appointment Letter</h3>
                      <p className="text-sm text-gray-600">Official appointment as member</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadCertificate('Appointment Letter')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Letter
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="h-8 w-8 text-yellow-600" />
                    <div>
                      <h3 className="font-semibold">Volunteer Certificate</h3>
                      <p className="text-sm text-gray-600">Certificate for volunteer service</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadCertificate('Volunteer Certificate')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Certificate
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Participation Certificate</h3>
                      <p className="text-sm text-gray-600">Certificate for event participation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadCertificate('Participation Certificate')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download Certificate
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Activity History</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Healthcare Camp - Rampur Village</h3>
                    <span className="text-sm text-gray-600">Feb 20, 2024</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">Participated in medical camp as volunteer assistant</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">Completed</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">8 hours</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Monthly Donation</h3>
                    <span className="text-sm text-gray-600">Feb 15, 2024</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">Contributed ₹5,000 for education program</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">Received</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-md">₹5,000</span>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Tree Plantation Drive</h3>
                    <span className="text-sm text-gray-600">Feb 10, 2024</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">Planted 25 saplings in community garden</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">Completed</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md">6 hours</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold">New Event: Environment Day Celebration</h3>
                    <p className="text-gray-600 text-sm">Join us for World Environment Day celebration with tree plantation drive.</p>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Bell className="h-5 w-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Donation Receipt Generated</h3>
                    <p className="text-gray-600 text-sm">Your donation receipt for ₹5,000 has been generated and sent to your email.</p>
                    <span className="text-xs text-gray-500">5 days ago</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Bell className="h-5 w-5 text-yellow-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Volunteer Certificate Ready</h3>
                    <p className="text-gray-600 text-sm">Your volunteer service certificate is ready for download.</p>
                    <span className="text-xs text-gray-500">1 week ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
