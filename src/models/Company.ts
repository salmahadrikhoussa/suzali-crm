import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: { type: String },
  size: { type: String },
  address: { type: String },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
  deals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'prospect'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);