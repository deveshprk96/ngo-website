import { NextRequest, NextResponse } from 'next/server';
import { generateDonationReceipt } from '../../../lib/pdf-generator';

export async function GET() {
  try {
    // Create a test donation object
    const testDonation = {
      _id: '507f1f77bcf86cd799439011',
      donorName: 'Test Donor',
      donorEmail: 'test@example.com',
      donorPhone: '+91 9876543210',
      amount: 1000, // Ensure this is a proper number
      donationType: 'General',
      paymentMethod: 'UPI',
      transactionId: 'TXN123456789',
      createdAt: new Date(),
      status: 'Completed'
    };

    console.log('Testing PDF generation...');
    const pdfBuffer = await generateDonationReceipt(testDonation);
    console.log('Test PDF generated successfully, buffer length:', pdfBuffer.length);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="test-receipt.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Test PDF generation failed:', error);
    return NextResponse.json(
      { 
        error: 'Test PDF generation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      },
      { status: 500 }
    );
  }
}
