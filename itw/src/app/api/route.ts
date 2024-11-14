import Content from '../models/contentSchema'; // Adjust the path if needed
import {connectDB} from '../lib/mongodb'; // Function to connect to MongoDB
import { NextRequest, NextResponse } from 'next/server';

// Connect to the database

async function handler(req: NextRequest, res: NextResponse) {
  await connectDB();
  if (req.method === 'POST') {
    const body = await req.json();
    const { tokenId, userAddress, description } = body;

    if (!userAddress) {
      return NextResponse.json({ message: 'Missing required fields: tokenId, userAddress.' });
    }

    try {
      const newContent = new Content({
        tokenId,
        userAddress,
        description,
      });

      const savedContent = await newContent.save();
      return NextResponse.json({ message: 'Content added successfully!', data: savedContent });
    } catch (error: any) {
      return NextResponse.json({ message: 'Error saving content.', error: error.message });
    }
  } 

}

export const POST = handler;

