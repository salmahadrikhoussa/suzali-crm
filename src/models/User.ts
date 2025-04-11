import mongoose, { Schema } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'sales' | 'user';
  lastLogin?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'sales', 'user'],
    default: 'user'
  },
  lastLogin: { type: Date },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// Check if the model already exists
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;