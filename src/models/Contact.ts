import mongoose, { Schema } from 'mongoose';

export interface IContact {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: mongoose.Types.ObjectId;
  position?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    position: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

// Check if model exists to avoid "Cannot overwrite `Contact` model" error
const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;