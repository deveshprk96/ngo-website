import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Event } from '@/models/Event';

export async function POST(request: NextRequest) {
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

    const event = new Event({
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
      isActive: true,
    });

    await event.save();

    return NextResponse.json({ event });

  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const events = await Event.find({ isActive: true })
      .sort({ createdAt: -1 });

    // Transform for admin panel compatibility
    const transformedEvents = events.map(event => ({
      _id: event._id.toString(),
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.venue,
      organizer: event.organizer || 'Bawaliya Seva Sansthan',
      maxParticipants: event.maxParticipants,
      currentParticipants: event.registeredParticipants?.length || 0,
      category: event.category || 'community',
      status: event.status || 'upcoming',
      imageUrl: event.imageUrl,
      registrationRequired: event.registrationRequired !== false,
      createdAt: event.createdAt
    }));

    return NextResponse.json(transformedEvents);

  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
