import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['certificate', 'report', 'financial', 'other'], required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number },
  mimeType: { type: String },
  isPublic: { type: Boolean, default: true },
  downloadCount: { type: Number, default: 0 },
}, {
  timestamps: true
});

export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);
