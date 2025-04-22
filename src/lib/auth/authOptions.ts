// In src/lib/auth/authOptions.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../mongoose/connect";
import bcrypt from "bcryptjs";
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
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
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
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  }
}

function connectToMongoose() {
  throw new Error("Function not implemented.");
}
