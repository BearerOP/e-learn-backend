const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "both"],
      default: "student",
    },
    purchasedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    archivedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }], // Courses archived by the user
    instructorDetails: {
      bio: { type: String },
      expertise: [{ type: String }],
    },
    accessToken: { type: String }, // Access token for authentication
    refreshToken: { type: String }, // Refresh token for renewing access
  },
  { timestamps: true }
);

const trackSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["folder", "video", "text"],
      required: true,
    },
    videoUrl: { type: String },
    content: { type: String }, // Optional textual content
    subTracks: [{ type: Schema.Types.ObjectId, ref: "Track" }], // Self-referencing for nested tracks
  },
  { timestamps: true }
);

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String },
    category: { type: String, required: true },
    subCategory: { type: String }, // New subCategory field
    tags: [{ type: String }], // New tags field
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the instructor
    tracks: [{ type: Schema.Types.ObjectId, ref: "Track" }], // Reference to tracks
    studentsEnrolled: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reviews: [
      {
        student: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cart: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Track = mongoose.model("Track", trackSchema);
const Course = mongoose.model("Course", courseSchema);
const Cart = mongoose.model("Cart", cartSchema);

module.exports = { Course, Track, User, Cart };
