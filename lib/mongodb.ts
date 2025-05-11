import mongoose from "mongoose";
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI as string);
    isConnected = db.connections[0].readyState === 1;
    console.log("Successfully connected to MongoDB 🥂");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error("An unknown error occurred while connecting to MongoDB.");
    }
  }
};

export default connectDB;