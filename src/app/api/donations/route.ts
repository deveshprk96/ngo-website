import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Donation } from '@/models/Donation';

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/donations called');
    await dbConnect();
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { 
      donorName, 
      donorEmail, 
      donorPhone, 
      amount, 
      paymentMethod, 
      donationType,
      status,
      date 
    } = body;

    // Validate required fields
    if (!donorName || !donorEmail || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: donorName, donorEmail, amount' },
        { status: 400 }
      );
    }

    // Generate receipt number
    const donationCount = await Donation.countDocuments();
    const receiptNumber = `BSS-RCP-${new Date().getFullYear()}-${(donationCount + 1).toString().padStart(6, '0')}`;

    const donation = new Donation({
      donorName,
      donorEmail,
      donorPhone,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'Cash',
      donationType: donationType || 'General Donation',
      receiptNumber,
      isAnonymous: false,
      status: status || 'Completed',
      createdAt: date ? new Date(date) : new Date(),
    });

    console.log('Saving donation:', donation);
    const savedDonation = await donation.save();
    console.log('Donation saved successfully:', savedDonation._id);

    return NextResponse.json({ 
      success: true,
      donation: savedDonation,
      message: 'Donation recorded successfully',
      receiptNumber 
    });

  } catch (error) {
    console.error('Create donation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/donations called');
    await dbConnect();
    
    const donations = await Donation.find()
      .sort({ createdAt: -1 });

    console.log(`Found ${donations.length} donations`);

    // Transform for admin panel compatibility
    const transformedDonations = donations.map(donation => ({
      _id: donation._id.toString(),
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      donorPhone: donation.donorPhone,
      amount: donation.amount,
      purpose: donation.donationType || donation.purpose || 'General Donation',
      paymentMethod: donation.paymentMethod,
      transactionId: donation.transactionId,
      receiptNumber: donation.receiptNumber,
      isAnonymous: donation.isAnonymous,
      status: donation.status,
      createdAt: donation.createdAt,
      updatedAt: donation.updatedAt
    }));

    return NextResponse.json(transformedDonations);

  } catch (error) {
    console.error('Get donations error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
