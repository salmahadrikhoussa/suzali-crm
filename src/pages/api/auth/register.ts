import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb/connect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectToDatabase();

  const { name, email, password } = req.body;

  // Validate inputs
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    // First user is automatically an admin
    const isFirstUser = (await User.countDocuments({})) === 0;
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: isFirstUser ? 'admin' : 'user',
    });

    // Return user without password
    res.status(201).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Provide more detailed error information
    if (error instanceof Error) {
      return res.status(500).json({ 
        message: 'Error registering user', 
        details: error.message 
      });
    }
    return res.status(500).json({ message: 'Unknown error occurred' });
  }
}