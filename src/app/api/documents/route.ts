import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Document } from '@/models/Document';

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    
    await connectToDatabase();
    const documents = await Document.find({ isPublic: true }).sort({ createdAt: -1 });
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }
    
    await connectToDatabase();
    const data = await request.json();
    
    const document = new Document({
      title: data.title,
      description: data.description,
      type: data.type,
      fileName: data.fileName,
      filePath: data.filePath,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      isPublic: data.isPublic !== undefined ? data.isPublic : true
    });

    await document.save();
    return NextResponse.json({ document, message: 'Document uploaded successfully' });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
