// src/types/global.d.ts
import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

// Extend Next-Auth types
import 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    role?: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
      image?: string | null;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export {};