const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique:true
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    // in HOURS(hrs)
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["published", "draft"],
    default: "draft",
  },
});

// Index for faster searches on course name and category
courseSchema.index({ name: 1 });
courseSchema.index({ category: 1 });

// Optionally, index author if you need to frequently query by author
courseSchema.index({ author: 1 });

module.exports = mongoose.model("Course", courseSchema);
