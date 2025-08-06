import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Donation } from '@/models/Donation';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { donorName, email, phone, amount, paymentMode, purpose, date } = body;

    // Generate receipt number
    const donationCount = await Donation.countDocuments();
    const receiptNumber = `BSS-RCP-${new Date().getFullYear()}-${(donationCount + 1).toString().padStart(6, '0')}`;

    const donation = new Donation({
      donorName,
      donorEmail: email,
      donorPhone: phone,
      amount,
      paymentMethod: paymentMode,
      receiptNumber,
      purpose: purpose || 'General Donation',
      isAnonymous: false,
      status: 'Completed',
      createdAt: date || new Date(),
    });

    await donation.save();

    return NextResponse.json({ 
      donation,
      message: 'Donation recorded successfully',
      receiptNumber 
    });

  } catch (error) {
    console.error('Create donation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const donations = await Donation.find()
      .sort({ createdAt: -1 });

    // Transform for admin panel compatibility
    const transformedDonations = donations.map(donation => ({
      _id: donation._id.toString(),
      donorName: donation.donorName,
      email: donation.donorEmail,
      phone: donation.donorPhone,
      amount: donation.amount,
      purpose: donation.purpose,
      paymentMode: donation.paymentMethod,
      date: donation.createdAt,
      receiptGenerated: donation.receiptNumber ? true : false
    }));

    return NextResponse.json(transformedDonations);

  } catch (error) {
    console.error('Get donations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
