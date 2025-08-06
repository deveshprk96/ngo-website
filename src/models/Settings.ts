import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: String },
  category: { type: String, default: 'general' },
  isEditable: { type: Boolean, default: true },
}, {
  timestamps: true
});

export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
