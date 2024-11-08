import mongoose, { Schema, model } from 'mongoose';

// Define the interface for the content document
export interface IContent {
  tokenId: Number;
  userAddress: string; 
  comment: string; 
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
  comment: {
    type: String,
    required: true, // Comment content is mandatory
    maxlength: 500, // Limit comment length to 500 characters
  },
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
