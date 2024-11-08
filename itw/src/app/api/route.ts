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
    const { tokenId, userAddress, comment } = body;
    if (!userAddress || !comment) {
      return NextResponse.json({ message: 'Missing required fields: tokenId, userAddress, comment.' });
    }

    try {
      const newComment = new Content({
        tokenId,
        userAddress,
        comment,
      });
      console.log(newComment);

      // Save the comment in MongoDB
      const savedComment = await newComment.save();
      console.log("saved comment", savedComment);

      return NextResponse.json({ message: 'Comment added successfully!', data: savedComment });
    } catch (error: any) {
      return NextResponse.json({ message: 'Error saving comment.', error: error.message });
    }
  } else {
    // Only accept POST requests
    return NextResponse.json({ message: 'Method Not Allowed' });
  }
}
export const POST= handler;


