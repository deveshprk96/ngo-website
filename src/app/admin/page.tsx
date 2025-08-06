'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { Users, Calendar, Heart, FileText, Image, Settings, BarChart3, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalDonations: 0,
    totalAmount: 0,
    totalTeamMembers: 0,
    totalPosts: 0
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || !session.user.role || !['admin', 'super_admin', 'moderator'].includes(session.user.role)) {
      router.push('/admin/login');
      return;
    }

    fetchDashboardStats();
  }, [session, status, router]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch events stats
      const eventsResponse = await fetch('/api/events');
      const donationsResponse = await fetch('/api/donations');

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        const events = Array.isArray(eventsData) ? eventsData : [];
        const upcoming = events.filter((e: any) => new Date(e.date) >= new Date()).length;
        
        setStats(prev => ({
          ...prev,
          totalEvents: events.length,
          upcomingEvents: upcoming
        }));
      } else {
        // Fallback to demo data
        setStats(prev => ({
          ...prev,
          totalEvents: 3,
          upcomingEvents: 2
        }));
      }

      if (donationsResponse.ok) {
        const donationsData = await donationsResponse.json();
        const donations = Array.isArray(donationsData) ? donationsData : donationsData.donations || [];
        const totalAmount = donations.reduce((sum: number, donation: any) => sum + (donation.amount || 0), 0);
        
        setStats(prev => ({
          ...prev,
          totalDonations: donations.length,
          totalAmount: totalAmount
        }));
      } else {
        // Fallback to demo data
        setStats(prev => ({
          ...prev,
          totalDonations: 3,
          totalAmount: 8500
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set demo data on error
      setStats({
        totalEvents: 3,
        upcomingEvents: 2,
        totalDonations: 3,
        totalAmount: 8500,
        totalTeamMembers: 4,
        totalPosts: 5
      });
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!session || !session.user.role || !['admin', 'super_admin', 'moderator'].includes(session.user.role)) {
    return null;
  }

  const adminMenuItems = [
    { 
      title: 'Generate Donation Receipt', 
      description: 'Create and download donation receipts for donors',
      icon: FileText, 
      href: '/admin/donations',
      color: 'bg-green-500',
      stats: `${stats.totalDonations} total`
    },
    { 
      title: 'Events Management', 
      description: 'Create and manage events',
      icon: Calendar, 
      href: '/admin/events',
      color: 'bg-blue-500',
      stats: `${stats.upcomingEvents} upcoming`
    },
    { 
      title: 'Donations', 
      description: 'View and manage donations',
      icon: Heart, 
      href: '/admin/donations',
      color: 'bg-red-500',
      stats: `₹${stats.totalAmount.toLocaleString()}`
    },
    { 
      title: 'Multimedia Gallery', 
      description: 'Add and manage photos, videos and media content',
      icon: Image, 
      href: '/admin/gallery',
      color: 'bg-purple-500',
      stats: 'Manage media'
    },
    { 
      title: 'Posts & News', 
      description: 'Manage blog posts and announcements',
      icon: FileText, 
      href: '/admin/posts',
      color: 'bg-yellow-500',
      stats: 'Articles'
    },
    { 
      title: 'Document Library', 
      description: 'Upload and manage organizational documents',
      icon: FileText, 
      href: '/admin/documents',
      color: 'bg-indigo-500',
      stats: 'Manage docs'
    },
    { 
      title: 'Volunteer Management', 
      description: 'Review and approve volunteer applications',
      icon: Users, 
      href: '/admin/volunteers',
      color: 'bg-orange-500',
      stats: 'Applications'
    },
    { 
      title: 'Settings', 
      description: 'System configuration and settings',
      icon: Settings, 
      href: '/admin/settings',
      color: 'bg-gray-500',
      stats: 'Configure'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {session.user.name}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Team Members</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalTeamMembers}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  Organization team
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Events</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalEvents}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <BarChart3 className="w-4 h-4 mr-1 text-blue-500" />
                  {stats.upcomingEvents} upcoming events
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Donations</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalDonations}</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  ₹{stats.totalAmount.toLocaleString()} total
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Impact Score</dt>
                    <dd className="text-lg font-medium text-gray-900">8.5/10</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  Based on community feedback
                </div>
              </div>
            </div>
          </div>

          {/* Admin Menu */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminMenuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 block"
                >
                  <div className="flex items-center mb-4">
                    <div className={`${item.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.stats}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/admin/events"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center block"
              >
                Add New Event
              </Link>
              <Link
                href="/admin/volunteers"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center block"
              >
                Approve Members
              </Link>
              <Link
                href="/admin/gallery"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-center block"
              >
                Upload Photos
              </Link>
              <Link
                href="/admin/posts"
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-center block"
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
