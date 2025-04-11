// src/pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';

// Simple database connection function
const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  console.log("Connecting to MongoDB...");
  return mongoose.connect(process.env.MONGODB_URI!, {
    retryWrites: true,
    w: 'majority'
  });
};

// Import User model
const User = mongoose.models.User || require('../../../models/User');

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          // Connect to MongoDB
          await connectToDB();

          // Find user by email
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            console.log("User not found:", credentials.email);
            return null;
          }

          // Simple password check
          const isValidPassword = credentials.password === user.password;

          if (!isValidPassword) {
            console.log("Invalid password for:", credentials.email);
            return null;
          }

          console.log("Login successful for:", credentials.email);
          
          // Update last login time
          await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
          
          // Return user data
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user'
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirect after sign in
      // If the URL starts with the base URL or is a relative URL
      if (url.startsWith(baseUrl) || url.startsWith('/')) {
        // If it's a callback URL and doesn't contain a specific path, redirect to dashboard
        if (url.includes('/api/auth/callback') && !url.includes('?callbackUrl=')) {
          return `${baseUrl}/dashboard`;
        }
        return url;
      } 
      // Otherwise, redirect to base URL
      return baseUrl;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
});