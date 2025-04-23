// src/pages/api/user/password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { connectToDatabase } from "../../../lib/mongoose/connect";
import User from "../../../models/User";
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Password update API called with method:', req.method);
  
  // Only allow PUT method
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Get the current session to verify authentication
  const session = await getSession({ req });
  
  if (!session || !session.user) {
    console.log('Unauthorized user tried to access password API');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Get the user ID from the session
    const userId = session.user.id;
    console.log('User ID from session:', userId);
    
    try {
      // Extract password data from request body
      const { currentPassword, newPassword, confirmPassword } = req.body;
      
      // Validate request data
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'All password fields are required' });
      }
      
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: 'New passwords do not match' });
      }
      
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
      }
      
      // Retrieve user from database
      const user = await User.findById(userId);
      
      if (!user) {
        console.log('User not found during password update for ID:', userId);
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      // Update password in database
      user.password = hashedPassword;
      await user.save();
      
      console.log('Password updated successfully for user:', user.email);
      
      // Return success response
      return res.status(200).json({ 
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      console.error('Error updating password:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } catch (dbError) {
    console.error('Database connection error:', dbError);
    return res.status(500).json({ error: 'Database connection failed' });
  }
}