import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Settings } from '@/models/Settings';

export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { value, description, category } = body;

    const setting = await Settings.findOneAndUpdate(
      { key: params.key },
      {
        value,
        ...(description && { description }),
        ...(category && { category })
      },
      { new: true }
    );

    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      setting,
      message: 'Setting updated successfully' 
    });

  } catch (error) {
    console.error('Update setting error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await dbConnect();
    
    const setting = await Settings.findOneAndDelete({ key: params.key });

    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Setting deleted successfully' });

  } catch (error) {
    console.error('Delete setting error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
