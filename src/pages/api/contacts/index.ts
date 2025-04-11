import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb/connect';
import Contact from '../../../models/Contact'; // Make sure this file exists
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth/authOptions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        const contacts = await Contact.find()
          .populate('company', 'name')
          .sort({ createdAt: -1 });
        res.status(200).json(contacts);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts' });
      }
      break;

    case 'POST':
      try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
      } catch (error) {
        res.status(500).json({ message: 'Error creating contact' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}