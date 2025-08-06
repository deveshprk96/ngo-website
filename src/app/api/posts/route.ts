import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Post } from '@/models/Post';

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const data = await request.json();
    
    const post = new Post({
      title: data.title,
      content: data.content,
      type: data.type,
      author: data.author,
      image: data.image,
      tags: data.tags || [],
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      isPinned: data.isPinned || false
    });

    await post.save();
    return NextResponse.json({ 
      post, 
      message: 'Post created successfully' 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
