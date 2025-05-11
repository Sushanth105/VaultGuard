import mongoose from "mongoose";

// Define the cached connection interface
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the global variable with proper typing
declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: CachedConnection | undefined;
}

// Initialize the connection object
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Global variable to maintain the connection across hot reloads in development
const cached: CachedConnection = global.mongooseConnection || { conn: null, promise: null };

// Set the global variable if it doesn't exist yet
if (!global.mongooseConnection) {
  global.mongooseConnection = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("Successfully connected to MongoDB 🥂");
        return mongoose;
      })
      .catch((error) => {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;