  import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  googleId: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('User', UserSchema);