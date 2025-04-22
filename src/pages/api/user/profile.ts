import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectToDatabase } from "../../../lib/mongoose/connect";
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
  updatedAt?: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the current session to verify authentication
  const session = await getSession({ req });
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Connect to MongoDB
  const { db } = await connectToDatabase();
  const usersCollection = db.collection('users');
  
  // Get the user ID from the session
  const userId = session.user.id;
  
  // Handle GET request to fetch user profile
  if (req.method === 'GET') {
    try {
      // Find the user by ID
      const user = await usersCollection.findOne({ _id: userId });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return only the necessary profile fields (exclude sensitive data)
      const profileData: UserProfile = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
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
      
      // Prepare update data with explicit type
      const updateData: { $set: UserProfile } = {
        $set: {
          firstName,
          lastName,
          email,
          jobTitle,
          phone,
          timezone,
          language,
          updatedAt: new Date()
        }
      };
      
      // Only update profile image if it's provided
      if (profileImage !== undefined) {
        updateData.$set.profileImage = profileImage;
      }
      
      // Update the user profile
      const result = await usersCollection.updateOne(
        { _id: userId },
        updateData,
        { upsert: true } // Create if not exists
      );
      
      if (result.modifiedCount === 0 && result.upsertedCount === 0) {
        return res.status(404).json({ error: 'User not found or no changes made' });
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
}