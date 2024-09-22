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
  password: {
    type: String,
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
  purchasedCourses:{
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        }
        ],
  },
  authKey:{
    type: String,
    default: ''
  }
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
