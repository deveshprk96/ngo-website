import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { Event } from '@/models/Event';
import { Donation } from '@/models/Donation';
import { TeamMember } from '@/models/TeamMember';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Create admin user
    const existingAdmin = await Admin.findOne({ email: 'admin@bawaliyasevasansthan.org' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const admin = new Admin({
        name: 'Super Admin',
        email: 'admin@bawaliyasevasansthan.org',
        password: hashedPassword,
        role: 'super_admin',
        permissions: ['members', 'events', 'gallery', 'donations', 'posts', 'documents', 'team', 'settings'],
        isActive: true
      });
      await admin.save();
    }

    // Create demo events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      const events = [
        {
          title: 'Community Health Camp',
          description: 'Free medical checkup and consultation for all community members. Our qualified doctors will provide basic health screening, blood pressure checks, and general health advice.',
          date: new Date('2025-08-15'),
          time: '9:00 AM',
          venue: 'Community Center, Mumbai',
          maxParticipants: 100,
          isActive: true
        },
        {
          title: 'Tree Plantation Drive',
          description: 'Join us in making our city greener. Plant trees and spread awareness about environmental conservation. Refreshments and saplings will be provided.',
          date: new Date('2025-08-20'),
          time: '7:00 AM',
          venue: 'Shivaji Park, Mumbai',
          maxParticipants: 50,
          isActive: true
        },
        {
          title: 'Education Workshop',
          description: 'Digital literacy workshop for underprivileged children and their parents. Learn basic computer skills and internet safety.',
          date: new Date('2025-08-25'),
          time: '2:00 PM',
          venue: 'Bawaliya Seva Sansthan Center',
          maxParticipants: 30,
          isActive: true
        }
      ];

      await Event.insertMany(events);
    }

    // Create demo donations
    const donationCount = await Donation.countDocuments();
    if (donationCount === 0) {
      const donations = [
        {
          donorName: 'Anonymous',
          donorEmail: 'anonymous@example.com',
          amount: 5000,
          paymentMethod: 'UPI',
          receiptNumber: 'HF-RCP-2025-000001',
          purpose: 'General Donation',
          isAnonymous: true,
          status: 'Completed'
        },
        {
          donorName: 'Rajesh Kumar',
          donorEmail: 'rajesh@example.com',
          donorPhone: '+91 98765 11111',
          amount: 2500,
          paymentMethod: 'Bank Transfer',
          receiptNumber: 'HF-RCP-2025-000002',
          purpose: 'Education',
          isAnonymous: false,
          status: 'Completed'
        },
        {
          donorName: 'Priya Sharma',
          donorEmail: 'priya@example.com',
          donorPhone: '+91 98765 22222',
          amount: 1000,
          paymentMethod: 'UPI',
          receiptNumber: 'HF-RCP-2025-000003',
          purpose: 'Healthcare',
          isAnonymous: false,
          status: 'Completed'
        }
      ];

      await Donation.insertMany(donations);
    }

    // Create demo team members
    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0) {
      const teamMembers = [
        {
          name: 'Dr. Amita Patel',
          designation: 'Founder & President',
          bio: 'A passionate social worker with over 15 years of experience in community development.',
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
          name: 'Rajesh Gupta',
          designation: 'Secretary',
          bio: 'Former corporate executive turned social entrepreneur, dedicated to education initiatives.',
          email: 'rajesh@hopefoundation.org',
          phone: '+91 98765 00002',
          socialLinks: {
            linkedin: 'https://linkedin.com/in/rajeshgupta'
          },
          order: 2,
          isActive: true
        },
        {
          name: 'Sunita Singh',
          designation: 'Treasurer',
          bio: 'Chartered Accountant with expertise in non-profit financial management.',
          email: 'sunita@hopefoundation.org',
          phone: '+91 98765 00003',
          order: 3,
          isActive: true
        },
        {
          name: 'Dr. Vikram Shah',
          designation: 'Program Director',
          bio: 'Medical professional leading our healthcare and wellness programs.',
          email: 'vikram@hopefoundation.org',
          phone: '+91 98765 00004',
          order: 4,
          isActive: true
        }
      ];

      await TeamMember.insertMany(teamMembers);
    }

    return NextResponse.json({
      message: 'Demo data created successfully!',
      credentials: {
        admin: {
          email: 'admin@bawaliyasevasansthan.org',
          password: 'admin123'
        }
      }
    });

  } catch (error) {
    console.error('Seed data error:', error);
    return NextResponse.json(
      { error: 'Failed to create demo data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Seed endpoint ready. Send POST request to create demo data.'
  });
}
