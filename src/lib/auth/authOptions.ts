// src/lib/auth/authOptions.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectMongoDB } from '../mongodb/connect';
import User from '../../models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Ensure credentials exist and have values
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Ensure MongoDB connection
          await connectMongoDB();

          // Find user by email
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            return null;
          }

          // TODO: Replace with proper password hashing
          const isValidPassword = credentials.password === user.password;

          if (!isValidPassword) {
            return null;
          }

          // Return user object for session
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role
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
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};