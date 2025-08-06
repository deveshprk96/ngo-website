import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  membershipId: {
    type: String,
    required: true,
    unique: true
  },
  membershipType: {
    type: String,
    enum: ['regular', 'premium', 'lifetime'],
    default: 'regular'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  profileImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

memberSchema.index({ email: 1 });
memberSchema.index({ membershipId: 1 });

export const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);
