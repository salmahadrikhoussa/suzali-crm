import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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

export default mongoose.models.User || mongoose.model('User', UserSchema);