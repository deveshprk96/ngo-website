import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Volunteer } from '@/models/Volunteer';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await request.json();
    
    const volunteer = await Volunteer.findByIdAndUpdate(
      id,
      {
        status: data.status,
        approvedBy: data.approvedBy,
        approvedAt: data.status === 'approved' ? new Date() : undefined
      },
      { new: true }
    );

    if (!volunteer) {
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      volunteer, 
      message: 'Volunteer status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating volunteer:', error);
    return NextResponse.json(
      { error: 'Failed to update volunteer status' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;
    
    const volunteer = await Volunteer.findByIdAndDelete(id);
    
    if (!volunteer) {
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Volunteer deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    return NextResponse.json(
      { error: 'Failed to delete volunteer' },
      { status: 500 }
    );
  }
}
