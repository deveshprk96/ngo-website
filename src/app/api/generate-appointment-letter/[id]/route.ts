import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { generateAppointmentLetter } from '../../../../lib/pdf-generator';
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

    // Only generate appointment letter for approved members
    if (member.status !== 'approved') {
      return NextResponse.json({ error: 'Member must be approved to generate appointment letter' }, { status: 400 });
    }

    // Generate PDF appointment letter
    const pdfBuffer = await generateAppointmentLetter(member);

    // Return PDF file
    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${member.firstName}_${member.lastName}_Appointment_Letter.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating appointment letter:', error);
    return NextResponse.json(
      { error: 'Failed to generate appointment letter' },
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
    
    const members = await Member.find({ 
      _id: { $in: memberIds },
      status: 'approved' // Only approved members can get appointment letters
    });
    
    if (members.length === 0) {
      return NextResponse.json({ error: 'No approved members found' }, { status: 404 });
    }

    // Generate appointment letters for multiple members
    const pdfBuffers = await Promise.all(
      members.map((member: any) => generateAppointmentLetter(member))
    );

    // For bulk generation, you might want to create a ZIP file
    // For now, return the first PDF as an example
    const pdfBuffer = pdfBuffers[0];

    return new NextResponse(pdfBuffer as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Bulk_Appointment_Letters.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating bulk appointment letters:', error);
    return NextResponse.json(
      { error: 'Failed to generate appointment letters' },
      { status: 500 }
    );
  }
}
