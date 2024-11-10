import type { NextApiRequest, NextApiResponse } from 'next';
// import mongoose from 'mongoose';
import Content from '../models/contentSchema'; // Adjust the path if needed
import {connectDB} from '../lib/mongodb'; // Function to connect to MongoDB
import { NextRequest, NextResponse } from 'next/server';
// Connect to the database
connectDB();

 async function handler(req: NextRequest, res: NextResponse) {
   
  if (req.method === 'POST') {

    const body=await req.json();
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

      console.log(newContent);

      // Save the comment in MongoDB
      const savedConnent = await newContent.save();
      console.log("saved comment", savedConnent);

      return NextResponse.json({ message: 'Comment added successfully!', data: savedConnent });
    } catch (error: any) {
      return NextResponse.json({ message: 'Error saving comment.', error: error.message });
    }
  } else {
    // Only accept POST requests
    return NextResponse.json({ message: 'Method Not Allowed' });
  }
}
export const POST= handler;


