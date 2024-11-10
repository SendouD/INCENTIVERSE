import mongoose from "mongoose";
require("dotenv").config();
const { MONGODB_URI } = process.env;


export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI as string);
    if (connection.readyState === 1) {
      console.log("connected");
      return Promise.resolve(true);
    }
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
