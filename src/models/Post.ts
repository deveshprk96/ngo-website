import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['notice', 'blog', 'announcement'], required: true },
  author: { type: String, required: true },
  image: { type: String },
  tags: [{ type: String }],
  isPublished: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
}, {
  timestamps: true
});

export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
