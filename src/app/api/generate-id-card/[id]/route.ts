import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { generateIdCard } from '../../../../lib/pdf-generator';
import connectToDatabase from '../../../../lib/mongodb';
import { Member } from '../../../../models/Member';

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
    
    const member = await Member.findById(params.id);
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Check if user can access this member's data
    if (session.user.email !== member.email && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Generate PDF
    const pdfBuffer = await generateIdCard(member);

    // Return PDF file
    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${member.firstName}_${member.lastName}_ID_Card.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating ID card:', error);
    return NextResponse.json(
      { error: 'Failed to generate ID card' },
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

    const { memberIds } = await request.json();

    if (!memberIds || !Array.isArray(memberIds)) {
      return NextResponse.json({ error: 'Invalid member IDs' }, { status: 400 });
    }

    await connectToDatabase();
    
    const members = await Member.find({ _id: { $in: memberIds } });
    
    if (members.length === 0) {
      return NextResponse.json({ error: 'No members found' }, { status: 404 });
    }

    // Generate ID cards for multiple members
    const pdfBuffers = await Promise.all(
      members.map((member: any) => generateIdCard(member))
    );

    // For bulk generation, you might want to create a ZIP file
    // For now, return the first PDF as an example
    const pdfBuffer = pdfBuffers[0];

    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Bulk_ID_Cards.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating bulk ID cards:', error);
    return NextResponse.json(
      { error: 'Failed to generate ID cards' },
      { status: 500 }
    );
  }
}
