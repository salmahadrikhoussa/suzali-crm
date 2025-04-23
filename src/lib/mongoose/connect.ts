import mongoose from 'mongoose';
// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Type for cached mongoose
interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare the global variable
declare global {
  var mongoose: CachedMongoose | undefined;
}

// Check if the MongoDB URI exists
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables!');
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Initialize the cached connection
let cached: CachedMongoose = global.mongoose || { conn: null, promise: null };

// Set it on the global object if it's not there already
if (!global.mongoose) {
  global.mongoose = cached;
}

// Connection function
export async function connectToDatabase() {
  console.log('Connection function called, URI:', MONGODB_URI?.substring(0, 20) + '...');
  
  // If we have a connection already, return it
  if (cached.conn) {
    console.log('Using existing connection');
    return cached.conn;
  }

  // If a connection is being established, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    };

    console.log('Creating new MongoDB connection...');
    // Use non-null assertion (!) since we've checked it above
    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  } else {
    console.log('Using existing connection promise');
  }

  try {
    // Store the connection
    const mongooseInstance = await cached.promise;
    cached.conn = mongooseInstance;
    
    // Check if connection and db exist before accessing properties
    if (mongooseInstance.connection && mongooseInstance.connection.db) {
      console.log('Connected to MongoDB successfully, database:', 
        mongooseInstance.connection.db.databaseName);
    } else {
      console.log('Connected to MongoDB successfully, but database info not available');
    }
    
    return mongooseInstance;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    cached.promise = null;
    throw err;
  }
}