import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['photo', 'video'], required: true },
  url: { type: String, required: true }, // For photos: file path, for videos: YouTube URL
  thumbnail: { type: String }, // Thumbnail for videos
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  tags: [{ type: String }],
  isPublic: { type: Boolean, default: true },
}, {
  timestamps: true
});

export const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);
