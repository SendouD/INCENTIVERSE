import Content from '../../models/contentSchema'; // Adjust the path if needed
import {connectDB} from '../../lib/mongodb'; // Function to connect to MongoDB
import { NextRequest, NextResponse } from 'next/server';
import { comment } from 'postcss';

// Connect to the database

async function handler(req: NextRequest, res: NextResponse) {
    await  connectDB();

if(req.method === 'GET'){
  
    try {
      const content = await Content.find({},{tokenId:1,description:1});
  
      if (!content) {
        return NextResponse.json({ message: 'Content not found.' }, { status: 404 });
      }
      if(content){
        return NextResponse.json({ description:content}, { status: 200 });
      }
    } catch (error: any) {
      return NextResponse.json({ message: 'Error fetching comments.', error: error.message }, { status: 500 });
    }
  }
  else {
    // Only accept POST and PATCH requests
    return NextResponse.json({ message: 'Method Not Allowed' });
  }



  }


export const GET=handler;
