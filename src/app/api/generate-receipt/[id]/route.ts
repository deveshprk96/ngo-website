import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { generateDonationReceipt } from '../../../../lib/pdf-generator';
import dbConnect from '../../../../lib/mongodb';
import { Donation } from '../../../../models/Donation';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Generate receipt API called for donation ID:', params.id);
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session ? 'authenticated' : 'not authenticated');
    
    if (!session) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.MONGODB_URI) {
      console.log('MongoDB URI not configured');
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected successfully');
    
    console.log('Fetching donation with ID:', params.id);
    const donation = await Donation.findById(params.id);
    if (!donation) {
      console.log('Donation not found for ID:', params.id);
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }
    
    console.log('Donation found:', donation.donorName, donation.amount);

    // For admin users, allow access to all donations
    // For regular users, only allow access to their own donations
    if (session.user.role !== 'admin' && session.user.email !== donation.donorEmail) {
      console.log('Access forbidden for user:', session.user.email);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate PDF receipt
    console.log('Generating PDF for donation:', donation._id);
    let pdfBuffer;
    try {
      pdfBuffer = await generateDonationReceipt(donation);
      console.log('PDF generated successfully, buffer length:', pdfBuffer.length);
    } catch (pdfError) {
      console.error('PDF generation failed:', pdfError);
      return NextResponse.json(
        { error: 'PDF generation failed', details: pdfError instanceof Error ? pdfError.message : 'Unknown PDF error' },
        { status: 500 }
      );
    }

    // Validate PDF buffer
    if (!pdfBuffer || pdfBuffer.length === 0) {
      console.error('Generated PDF buffer is empty or null');
      return NextResponse.json(
        { error: 'Generated PDF is empty' },
        { status: 500 }
      );
    }

    // Return PDF file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Donation_Receipt_${donation._id.toString().substring(0, 8).toUpperCase()}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error generating donation receipt:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to generate donation receipt', details: error instanceof Error ? error.message : 'Unknown error' },
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

    await dbConnect();
    
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
