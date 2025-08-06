import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number, required: true },
  occupation: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  skills: [{ type: String }],
  interests: [{ type: String }],
  availability: {
    weekdays: { type: Boolean, default: false },
    weekends: { type: Boolean, default: false },
    evenings: { type: Boolean, default: false }
  },
  experience: { type: String },
  motivation: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'inactive'], 
    default: 'pending' 
  },
  approvedBy: { type: String },
  approvedAt: { type: Date },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relationship: { type: String }
  }
}, {
  timestamps: true
});

export const Volunteer = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);
