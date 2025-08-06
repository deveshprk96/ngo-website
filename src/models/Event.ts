import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  maxParticipants: { type: Number },
  registeredParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
}, {
  timestamps: true
});

export const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
