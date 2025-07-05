import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const url=process.env.MONGO_STRING;
    const conn = await mongoose.connect(url);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;