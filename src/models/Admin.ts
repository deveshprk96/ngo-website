import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin', 'moderator'], default: 'admin' },
  permissions: [{
    type: String,
    enum: ['members', 'events', 'gallery', 'donations', 'posts', 'documents', 'team', 'settings']
  }],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
}, {
  timestamps: true
});

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
