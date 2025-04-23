import mongoose, { Schema } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'sales' | 'user';
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  profileImage?: string;
  lastLogin?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User Schema with all needed profile fields
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true // Ensure emails are stored lowercase
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'sales', 'user'],
    default: 'user'
  },
  // Profile fields
  firstName: { type: String },
  lastName: { type: String },
  jobTitle: { type: String },
  phone: { type: String },
  timezone: { type: String, default: 'UTC' },
  language: { type: String, default: 'en' },
  profileImage: { type: String },
  lastLogin: { type: Date },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Check if the model already exists
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;