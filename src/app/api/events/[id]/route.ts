import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Event } from '@/models/Event';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { 
      title, 
      description, 
      date, 
      time, 
      location, 
      organizer, 
      maxParticipants, 
      category, 
      status, 
      registrationRequired, 
      imageUrl 
    } = body;

    const event = await Event.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        date: new Date(date),
        time,
        venue: location,
        organizer,
        maxParticipants: maxParticipants || undefined,
        category: category || 'community',
        status: status || 'upcoming',
        registrationRequired: registrationRequired !== false,
        imageUrl,
      },
      { new: true }
    );

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });

  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const event = await Event.findByIdAndUpdate(
      params.id,
      { isActive: false },
      { new: true }
    );

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });

  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
