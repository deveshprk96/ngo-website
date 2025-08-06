import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  bio: { type: String },
  photo: { type: String },
  email: { type: String },
  phone: { type: String },
  socialLinks: {
    linkedin: { type: String },
    facebook: { type: String },
    twitter: { type: String },
  },
  order: { type: Number, default: 0 }, // For ordering team members
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

export const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);
