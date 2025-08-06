'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Mail, Phone, Linkedin, Facebook, Twitter } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  bio: string;
  photo?: string;
  email?: string;
  phone?: string;
  socialLinks: {
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
  order: number;
  isActive: boolean;
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data.teamMembers);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Demo team members
  const demoTeamMembers = [
    {
      _id: '1',
      name: 'Dr. Amita Patel',
      designation: 'Founder & President',
      bio: 'A passionate social worker with over 15 years of experience in community development. Dr. Patel has dedicated her life to improving the lives of underprivileged communities.',
      photo: undefined as string | undefined,
      email: 'amita@hopefoundation.org',
      phone: '+91 98765 00001',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/amitapatel',
        facebook: 'https://facebook.com/amitapatel'
      },
      order: 1,
      isActive: true
    },
    {
      _id: '2',
      name: 'Rajesh Gupta',
      designation: 'Secretary',
      bio: 'Former corporate executive turned social entrepreneur, dedicated to education initiatives. Rajesh brings extensive management experience to our organization.',
      photo: undefined as string | undefined,
      email: 'rajesh@hopefoundation.org',
      phone: '+91 98765 00002',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/rajeshgupta'
      },
      order: 2,
      isActive: true
    },
    {
      _id: '3',
      name: 'Sunita Singh',
      designation: 'Treasurer',
      bio: 'Chartered Accountant with expertise in non-profit financial management. Sunita ensures transparency and accountability in all our financial operations.',
      photo: undefined as string | undefined,
      email: 'sunita@hopefoundation.org',
      phone: '+91 98765 00003',
      socialLinks: {},
      order: 3,
      isActive: true
    },
    {
      _id: '4',
      name: 'Dr. Vikram Shah',
      designation: 'Program Director',
      bio: 'Medical professional leading our healthcare and wellness programs. Dr. Shah coordinates all our health-related initiatives and medical camps.',
      photo: undefined as string | undefined,
      email: 'vikram@hopefoundation.org',
      phone: '+91 98765 00004',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/vikramshah'
      },
      order: 4,
      isActive: true
    },
    {
      _id: '5',
      name: 'Meera Reddy',
      designation: 'Education Coordinator',
      bio: 'Former school principal with 20+ years in education. Meera oversees all educational programs and scholarship initiatives.',
      photo: undefined as string | undefined,
      email: 'meera@hopefoundation.org',
      phone: '+91 98765 00005',
      socialLinks: {
        facebook: 'https://facebook.com/meerareddy'
      },
      order: 5,
      isActive: true
    },
    {
      _id: '6',
      name: 'Arjun Kumar',
      designation: 'Environmental Officer',
      bio: 'Environmental scientist leading our green initiatives. Arjun coordinates tree plantation drives and environmental awareness programs.',
      photo: undefined as string | undefined,
      email: 'arjun@hopefoundation.org',
      phone: '+91 98765 00006',
      socialLinks: {
        twitter: 'https://twitter.com/arjunkumar',
        linkedin: 'https://linkedin.com/in/arjunkumar'
      },
      order: 6,
      isActive: true
    }
  ];

  const displayTeamMembers = teamMembers.length > 0 ? teamMembers : demoTeamMembers;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Team
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the dedicated individuals who lead Hope Foundation's mission to create positive change in our communities.
            </p>
          </div>

          {/* Team Members Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                  <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayTeamMembers
                .sort((a, b) => a.order - b.order)
                .map((member) => (
                <div key={member._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 text-center">
                  {/* Profile Image */}
                  <div className="mb-6">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {getInitials(member.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name and Designation */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-semibold mb-4">
                    {member.designation}
                  </p>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  {/* Contact Information */}
                  <div className="space-y-2 mb-6">
                    {member.email && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-2" />
                        <a 
                          href={`mailto:${member.email}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {member.email}
                        </a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2" />
                        <a 
                          href={`tel:${member.phone}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4">
                    {member.socialLinks.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.socialLinks.facebook && (
                      <a
                        href={member.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {member.socialLinks.twitter && (
                      <a
                        href={member.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Join Our Leadership Team
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              We're always looking for passionate individuals to join our leadership team 
              and help us expand our impact in the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/volunteer"
                className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                Volunteer With Us
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-800 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Organization Structure */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Organization Structure
            </h2>
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👑</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Executive Board</h3>
                  <p className="text-sm text-gray-600">
                    Strategic leadership and governance oversight
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Program Directors</h3>
                  <p className="text-sm text-gray-600">
                    Program planning and implementation
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Volunteers</h3>
                  <p className="text-sm text-gray-600">
                    Ground-level execution and community engagement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
