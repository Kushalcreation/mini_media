import mongoose from 'mongoose';
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, trim: true, maxlength: 2000, default: '' },
  image: { type: String, trim: true, default: '' },
  imagePublicId: { type: String, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });


postSchema.pre('validate', function(next) {
  if (!this.text && !this.image) this.invalidate('text', 'A post must contain text or an image.');
  next();
});
export default mongoose.model('Post', postSchema);
