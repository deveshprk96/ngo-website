import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  donorPhone: { type: String },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['UPI', 'Bank Transfer', 'Cash'], required: true },
  transactionId: { type: String },
  receiptNumber: { type: String, unique: true },
  purpose: { type: String, default: 'General Donation' },
  isAnonymous: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Completed' },
}, {
  timestamps: true
});

export const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);
