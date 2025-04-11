// src/lib/mongodb/connect.ts
import mongoose from 'mongoose';

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Define the cached connection type correctly
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Use the type from global.d.ts
let cached: CachedConnection = (global as any).mongoose || { conn: null, promise: null };

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Use the non-null assertion operator to tell TypeScript that MONGODB_URI is definitely defined
    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

// Update the global cache
(global as any).mongoose = cached;