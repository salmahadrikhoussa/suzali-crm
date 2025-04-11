// src/lib/mongodb/connect.ts
import mongoose from 'mongoose';

// Ensure MONGODB_URI is defined or throw an error early
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined in environment variables');
}

// Define an interface for the global mongoose state
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Mongoose> | null;
}

// Extend the global object with our mongoose cache
declare global {
  var mongooseCache: MongooseCache | undefined;
}

// Use global variable or initialize
const globalMongoose = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = globalMongoose;
}

export async function connectMongoDB() {
  // Force non-null assertion since we've already checked MONGODB_URI
  const mongoUri = MONGODB_URI!;

  // If already connected, return the connection
  if (globalMongoose.conn) {
    return globalMongoose.conn;
  }

  // If no existing promise, create a new connection
  if (!globalMongoose.promise) {
    const opts: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    };

    globalMongoose.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    // Wait for the connection promise and store the connection
    const mongooseInstance = await globalMongoose.promise;
    globalMongoose.conn = mongooseInstance.connection;
    
    console.log('Connected to MongoDB');
    return globalMongoose.conn;
  } catch (error) {
    // Reset the promise on error
    globalMongoose.promise = null;
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Utility function to handle database operations safely
export async function runDatabaseOperation<T>(
  operation: () => Promise<T>
): Promise<T | null> {
  try {
    await connectMongoDB();
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    return null;
  }
}