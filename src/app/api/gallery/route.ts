import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Gallery } from '@/models/Gallery';

export async function GET() {
  try {
    await dbConnect();
    
    const galleryItems = await Gallery.find({ isActive: true })
      .sort({ createdAt: -1 });

    // Transform for admin panel compatibility
    const transformedItems = galleryItems.map(item => ({
      _id: item._id.toString(),
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      type: item.type || 'image',
      category: item.category || 'general',
      uploadedAt: item.createdAt
    }));

    return NextResponse.json(transformedItems);

  } catch (error) {
    console.error('Get gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { title, description, url, type, category } = body;

    const galleryItem = new Gallery({
      title,
      description,
      url,
      type: type || 'photo',
      isPublic: true
    });

    await galleryItem.save();

    return NextResponse.json({ 
      galleryItem,
      message: 'Gallery item added successfully' 
    });

  } catch (error) {
    console.error('Create gallery item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
