import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb/connect';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth/authOptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  // Only allow authenticated users
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        // Only admin can see all users
        const currentUser = await User.findOne({ email: session.user?.email });
        if (currentUser?.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden' });
        }

        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
      }
      break;

    case 'POST':
      try {
        // Only admin can create users
        const currentUser = await User.findOne({ email: session.user?.email });
        if (currentUser?.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
          return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create user
        const user = await User.create({
          ...req.body,
          password: hashedPassword,
        });

        // Return user without password
        const userWithoutPassword = await User.findById(user._id).select('-password');
        res.status(201).json(userWithoutPassword);
      } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}