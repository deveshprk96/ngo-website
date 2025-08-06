import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Volunteer } from '@/models/Volunteer';

export async function GET() {
  try {
    await connectToDatabase();
    const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ volunteers });
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch volunteers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    const volunteer = new Volunteer({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      age: data.age,
      occupation: data.occupation,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      skills: data.skills || [],
      interests: data.interests || [],
      availability: data.availability || {},
      experience: data.experience,
      motivation: data.motivation,
      emergencyContact: data.emergencyContact || {}
    });

    await volunteer.save();
    return NextResponse.json({ 
      volunteer, 
      message: 'Volunteer application submitted successfully' 
    });
  } catch (error) {
    console.error('Error creating volunteer:', error);
    return NextResponse.json(
      { error: 'Failed to submit volunteer application' },
      { status: 500 }
    );
  }
}
