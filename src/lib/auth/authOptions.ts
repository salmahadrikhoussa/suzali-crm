import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../mongoose/connect";
import User from "../../models/User";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }
      
        try {
          // Connect to the database first
          await connectToDatabase();
          console.log("Successfully connected to MongoDB");
          
          console.log("Attempting to find user with email:", credentials.email.toLowerCase());
          
          const user = await User.findOne({ email: credentials.email.toLowerCase() });
          console.log("User found:", !!user);
        
          if (!user) {
            console.log("No user found with this email");
            return null;
          }
          
          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          console.log("Password match:", passwordMatch);
          
          if (!passwordMatch) {
            console.log("Password does not match");
            return null;
          }
        
          console.log("Authentication successful");
          
          // Explicitly convert _id to string
          const userId = user._id instanceof mongoose.Types.ObjectId 
            ? user._id.toString() 
            : String(user._id);
      
          return {
            id: userId,
            email: user.email,
            name: user.name,
            role: user.role || 'user',
            firstName: user.firstName,
            lastName: user.lastName,
            jobTitle: user.jobTitle,
            timezone: user.timezone,
            language: user.language,
            profileImage: user.profileImage
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.sub || token.id;
        session.user.role = token.role as string;
        
        // Add additional profile fields to session
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.jobTitle = token.jobTitle;
        session.user.timezone = token.timezone;
        session.user.language = token.language;
        session.user.profileImage = token.profileImage;
      }
      return session;
    },
    jwt: async ({ token, user, trigger, session }) => {
      // On first login or user object creation
      if (user) {
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.jobTitle = user.jobTitle;
        token.timezone = user.timezone;
        token.language = user.language;
        token.profileImage = user.profileImage;
      }

      // Update token when profile is updated via session callback
      if (trigger === 'update') {
        // Merge updated fields
        token = { ...token, ...session.user };
      }

      return token;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};