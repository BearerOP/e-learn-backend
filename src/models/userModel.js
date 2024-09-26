const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String, // URL for the avatar image
    required: false, // Optional
  },
  provider: {
    type: String, // 'github', 'google', etc.
    required: true,
  },
  providerId: {
    type: String, // OAuth provider's user ID
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
  },
  myCourses: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
      }
    ],
    default: [], 
  },
  purchasedCourses: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
      }
    ],
    default: [], 
  },
  authKey: {
    type: String,
    default: ''
  },
  provider: {
    type: String, // 'github', 'google', etc.
    required: true,
  },
  providerId: {
    type: String, // OAuth provider's user ID
    required: true,
  },
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
