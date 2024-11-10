import mongoose, { Schema, model } from 'mongoose';

// Define the interface for the content document
export interface IContent {
  tokenId: Number;
  userAddress: string; 
  description?: string; 
  commentersAddress: string[]; 
  comments: string[]; 
  timestamp: Date; 
}

// Create the content schema
const contentSchema = new Schema<IContent>({
  tokenId: {
    type: Number,
    required: true, // Token ID is mandatory
  },
  userAddress: {
    type: String,
    required: true, // User address is mandatory
    match: /^0x[a-fA-F0-9]{40}$/, // Optional: Validate Ethereum address format
  },
  description: {
    type: String,
    required: false,
    maxlength: 500, // Description length is limited to 500 characters
  },
  commentersAddress: [{
    type: String,
    required: true, // Each commenter address is mandatory
    match: /^0x[a-fA-F0-9]{40}$/, // Validate Ethereum address format
  }],
  comments: [{
    type: String,
    maxlength: 500, // Limit comment length to 500 characters
  }],
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set timestamp to current time
  },
}, {
  // Mongoose option to add createdAt and updatedAt timestamps
  timestamps: true,
});

// Ensure the model is only compiled once, even in hot-reloading environments
const Content = mongoose.models.Content || mongoose.model<IContent>('Content', contentSchema);

export default Content;
