import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Gallery } from '@/models/Gallery';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { title, description, url, type } = body;

    const galleryItem = await Gallery.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        url,
        type: type || 'photo',
      },
      { new: true }
    );

    if (!galleryItem) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json({ galleryItem });

  } catch (error) {
    console.error('Update gallery item error:', error);
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
    
    const galleryItem = await Gallery.findByIdAndUpdate(
      params.id,
      { isPublic: false },
      { new: true }
    );

    if (!galleryItem) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Gallery item deleted successfully' });

  } catch (error) {
    console.error('Delete gallery item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
