import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb/connect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Ensure database connection
  await connectToDatabase();

  // Extract user details from request body
  const { name, email, password } = req.body;

  // Validate input fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Log incoming registration attempt
    console.log("Registration Request Body:", { name, email, password });

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();
    console.log("Registration - Original Email:", email);
    console.log("Registration - Normalized Email:", normalizedEmail);

    // Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail });
    console.log("Existing User Check:", userExists);

    // Return error if user already exists
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password for secure storage
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine user role (first user becomes admin)
    const isFirstUser = (await User.countDocuments({})) === 0;
    
    // Create new user in database
    const user = await User.create({
      name,
      email: normalizedEmail, // Store email in lowercase
      password: hashedPassword,
      role: isFirstUser ? 'admin' : 'user',
    });

    // Log created user details (excluding password)
    console.log("User Created:", {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Return user information (without sensitive data)
    res.status(201).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    // Log and handle any registration errors
    console.error('Full Registration error:', error);
    
    // Provide detailed error response
    if (error instanceof Error) {
      return res.status(500).json({ 
        message: 'Error registering user', 
        details: error.message 
      });
    }
    
    // Fallback error response
    return res.status(500).json({ message: 'Unknown error occurred' });
  }
}