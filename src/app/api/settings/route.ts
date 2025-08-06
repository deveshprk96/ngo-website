import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Settings } from '@/models/Settings';

export async function GET() {
  try {
    await dbConnect();
    
    const settings = await Settings.find().sort({ category: 1, key: 1 });

    return NextResponse.json(settings);

  } catch (error) {
    console.error('Get settings error:', error);
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
    const { key, value, description, category } = body;

    // Check if setting already exists
    const existingSetting = await Settings.findOne({ key });
    
    if (existingSetting) {
      // Update existing setting
      existingSetting.value = value;
      if (description) existingSetting.description = description;
      if (category) existingSetting.category = category;
      await existingSetting.save();
      
      return NextResponse.json({ 
        setting: existingSetting,
        message: 'Setting updated successfully' 
      });
    } else {
      // Create new setting
      const setting = new Settings({
        key,
        value,
        description,
        category: category || 'general',
        isEditable: true
      });

      await setting.save();

      return NextResponse.json({ 
        setting,
        message: 'Setting created successfully' 
      });
    }

  } catch (error) {
    console.error('Create/Update setting error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
