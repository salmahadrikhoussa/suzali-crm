import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../../../lib/auth/authOptions";
import { connectToDatabase } from "../../../lib/mongoose/connect";
import User from "../../../models/User";
import mongoose from 'mongoose';

// Define interface for user profile data
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  profileImage?: string | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the current session to verify authentication
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Handle GET request to fetch user profile
    if (req.method === 'GET') {
      try {
        // Find the user by ID
        const user = await User.findById(userId);
        
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        // Return only the necessary profile fields (exclude sensitive data)
        const profileData: UserProfile = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          jobTitle: user.jobTitle || '',
          phone: user.phone || '',
          timezone: user.timezone || 'UTC',
          language: user.language || 'en',
          profileImage: user.profileImage || null
        };
        
        return res.status(200).json(profileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
    
    // Handle PUT request to update user profile
    else if (req.method === 'PUT') {
      try {
        // Explicitly type the request body
        const {
          firstName,
          lastName,
          email,
          jobTitle,
          phone,
          timezone,
          language,
          profileImage
        }: UserProfile = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email) {
          return res.status(400).json({ error: 'Required fields are missing' });
        }
        
        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            firstName,
            lastName,
            email,
            jobTitle,
            phone,
            timezone,
            language,
            profileImage,
            updatedAt: new Date()
          },
          { new: true, upsert: true } // Return the updated document and create if it doesn't exist
        );
        
        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        // Return success response
        return res.status(200).json({ 
          success: true,
          message: 'Profile updated successfully'
        });
      } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
    
    // Handle other HTTP methods
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ error: 'Failed to connect to the database' });
  }
}