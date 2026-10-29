import mongoose from "mongoose";

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const mongoUrl = process.env.MONGODB_URL;

  if (!mongoUrl) {
    throw new Error("MONGODB_URL is not defined in environment variables");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(mongoUrl, opts)
      .then((mongooseInstance) => {
        console.log("MongoDB connected successfully");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }

  return cached.conn;
};

export default connectDB;
