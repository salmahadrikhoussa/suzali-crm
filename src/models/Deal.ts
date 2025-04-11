import mongoose from 'mongoose';

const DealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  stage: { 
    type: String, 
    enum: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'],
    default: 'prospecting'
  },
  value: { type: Number, required: true },
  expectedCloseDate: { type: Date },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.models.Deal || mongoose.model('Deal', DealSchema);