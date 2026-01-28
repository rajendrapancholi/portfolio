import { ENV } from "@/config/env";
import mongoose from "mongoose";

let isConnected = 0;
export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB is already connected");
    return mongoose.connection;
  }

  try {
    const db = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      dbName: "portfolio",
      bufferCommands: false,
    });

    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected to: portfolio");
    return db;
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw new Error("Database connection failed");
  }
};

let blogConnection: mongoose.Connection;

export const connectToBlogDB = async () => {
  // If already connected, return the cached connection
  if (blogConnection && blogConnection.readyState === 1) return blogConnection;
  try {
    blogConnection = mongoose.createConnection(ENV.BLOG_MONGODB_URI!, {
      serverSelectionTimeoutMS: 5000,
      dbName: "blogdb",
      bufferCommands: false,
    });
    await blogConnection.asPromise();
    console.log("Connected to blogdb");
    return blogConnection;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to connect to Blog Database");
  }
};
