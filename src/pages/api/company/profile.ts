// src/pages/api/company/profile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth/authOptions';
import { connectToDatabase } from '../../../lib/mongoose/connect';
import mongoose from 'mongoose';

// Define a Company model if you don't have one
interface CompanyProfile {
  companyName: string;
  industry: string;
  size: string;
  website: string;
  address: string;
  phone: string;
  email: string;
  logo?: string | null;
}

// Simple company schema
const CompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: String },
  size: { type: String },
  website: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  logo: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the current session to verify authentication
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Connect to MongoDB
  await connectToDatabase();
  
  // Handle GET request
  if (req.method === 'GET') {
    try {
      // Find company by user ID
      const company = await Company.findOne({ userId: session.user.id });
      
      if (!company) {
        // Return default data if company doesn't exist
        return res.status(200).json({
          companyName: 'Suzali CRM',
          industry: 'Technology',
          size: '1-10 employees',
          website: '',
          address: '',
          phone: '',
          email: ''
        });
      }
      
      return res.status(200).json(company);
    } catch (error) {
      console.error('Error fetching company profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle PUT request
  else if (req.method === 'PUT') {
    try {
      const data: CompanyProfile = req.body;
      
      // Update or create company profile
      const updatedCompany = await Company.findOneAndUpdate(
        { userId: session.user.id },
        { ...data, userId: session.user.id },
        { upsert: true, new: true }
      );
      
      return res.status(200).json({ 
        success: true,
        message: 'Company profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating company profile:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle other HTTP methods
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}