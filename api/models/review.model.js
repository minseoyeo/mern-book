import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'uncategorized'
  },
  rating: {
    type: Number,
    required: true,
    default: 5
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  }
}, { timestamps: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;