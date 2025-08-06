import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { generateDonationReceipt } from '../../../../lib/pdf-generator';
import connectToDatabase from '../../../../lib/mongodb';
import { Donation } from '../../../../models/Donation';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const donation = await Donation.findById(params.id);
    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    // Check if user can access this donation's receipt
    if (session.user.email !== donation.donorEmail && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate PDF receipt
    const pdfBuffer = await generateDonationReceipt(donation);

    // Return PDF file
    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Donation_Receipt_${donation._id.toString().substring(0, 8).toUpperCase()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating donation receipt:', error);
    return NextResponse.json(
      { error: 'Failed to generate donation receipt' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { donationIds } = await request.json();

    if (!donationIds || !Array.isArray(donationIds)) {
      return NextResponse.json({ error: 'Invalid donation IDs' }, { status: 400 });
    }

    await connectToDatabase();
    
    const donations = await Donation.find({ _id: { $in: donationIds } });
    
    if (donations.length === 0) {
      return NextResponse.json({ error: 'No donations found' }, { status: 404 });
    }

    // Generate receipts for multiple donations
    const pdfBuffers = await Promise.all(
      donations.map((donation: any) => generateDonationReceipt(donation))
    );

    // For bulk generation, you might want to create a ZIP file
    // For now, return the first PDF as an example
    const pdfBuffer = pdfBuffers[0];

    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Bulk_Donation_Receipts.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating bulk donation receipts:', error);
    return NextResponse.json(
      { error: 'Failed to generate donation receipts' },
      { status: 500 }
    );
  }
}
