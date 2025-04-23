// src/pages/api/user/notifications.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth/authOptions';
import { connectToDatabase } from '../../../lib/mongoose/connect';
import mongoose from 'mongoose';

// Define the notification settings interface
interface NotificationSettings {
  emailNotifications: {
    dealUpdates: boolean;
    contactActivity: boolean;
    taskReminders: boolean;
    teamMentions: boolean;
  };
  systemNotifications: {
    systemUpdates: boolean;
    securityAlerts: boolean;
  };
  notificationFrequency: 'realtime' | 'daily' | 'weekly';
}

// Schema for notification settings
const NotificationSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  emailNotifications: {
    dealUpdates: { type: Boolean, default: true },
    contactActivity: { type: Boolean, default: true },
    taskReminders: { type: Boolean, default: true },
    teamMentions: { type: Boolean, default: true }
  },
  systemNotifications: {
    systemUpdates: { type: Boolean, default: true },
    securityAlerts: { type: Boolean, default: true }
  },
  notificationFrequency: { 
    type: String, 
    enum: ['realtime', 'daily', 'weekly'],
    default: 'realtime'
  }
});

const NotificationSettings = mongoose.models.NotificationSettings || 
  mongoose.model('NotificationSettings', NotificationSettingsSchema);

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
      // Find notification settings by user ID
      const settings = await NotificationSettings.findOne({ userId: session.user.id });
      
      if (!settings) {
        // Return default settings if not found
        return res.status(200).json({
          emailNotifications: {
            dealUpdates: true,
            contactActivity: true,
            taskReminders: true,
            teamMentions: true
          },
          systemNotifications: {
            systemUpdates: true,
            securityAlerts: true
          },
          notificationFrequency: 'realtime'
        });
      }
      
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle PUT request
  else if (req.method === 'PUT') {
    try {
      const data: NotificationSettings = req.body;
      
      // Update or create notification settings
      const updatedSettings = await NotificationSettings.findOneAndUpdate(
        { userId: session.user.id },
        { ...data, userId: session.user.id },
        { upsert: true, new: true }
      );
      
      return res.status(200).json({ 
        success: true,
        message: 'Notification settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Handle other HTTP methods
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}