import Content from '../../../models/contentSchema'; // Adjust the path if needed
import {connectDB} from '../../../lib/mongodb'; // Function to connect to MongoDB
import { NextRequest, NextResponse } from 'next/server';
import { comment } from 'postcss';

// Connect to the database

async function handler(req: NextRequest, res: NextResponse) {
    await  connectDB();

  if (req.method === 'PATCH') {
    console.log("hitt")
    const contentID = req.url.split('/').pop(); // Extract content ID from the URL
    const body = await req.json();
    const { text, author } = body;

    if (!text || !author) {
      return NextResponse.json({ message: 'Missing required fields: text, author.' });
    }

    try {
      const updatedContent = await Content.findOneAndUpdate(
        {tokenId:contentID},
        {
          $push: { comments: text, commentersAddress: author },
        },
        { new: true } // Return the updated document
      );
      if (!updatedContent) {
        return NextResponse.json({ message: 'Content not found.' });
      }

      return NextResponse.json({ message: 'Comment updated successfully!', data: updatedContent });
    } catch (error: any) {
      return NextResponse.json({ message: 'Error updating comment.', error: error.message });
    }
  } 
  else if(req.method === 'GET'){
    const contentID = req.url.split('/').pop(); // Extract content ID from the URL
  
    try {
      const content = await Content.findOne({ tokenId: contentID });
      // console.log(content.comments);
  
      if (!content) {
        return NextResponse.json({ message: 'Content not found.' }, { status: 404 });
      }
      
        return NextResponse.json({ comments: content.comments, commentersAddress: content.commentersAddress}, { status: 200 });
      
    } catch (error: any) {
      return NextResponse.json({ message: 'Error fetching comments.', error: error.message }, { status: 500 });
    }
  }
  else {
    // Only accept POST and PATCH requests
    return NextResponse.json({ message: 'Method Not Allowed' });
  }



  }


export const PATCH = handler;
export const GET=handler;
