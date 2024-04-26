import Review from '../models/review.model.js';
import User from '../models/user.model.js';
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content || !req.body.author) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '') + Math.random().toString(36).slice(-8);
  const newReview = new Review({
    ...req.body, slug, userId: req.user.id
  });
  try {
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    next(error);
  }
};

export const getreviews = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const reviews = await Review.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.reviewId && { _id: req.query.reviewId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' }},
          { content: { $regex: req.query.searchTerm, $options: 'i' }},
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    
    const totalReviews = await Review.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthReviews = await Review.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      reviews,
      totalReviews,
      lastMonthReviews
    });
  } catch (error) {
    next(error);
  }
};

export const deletereview = async (req, res, next) => {

  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this review'));
  };
  try {
    await Review.findByIdAndDelete(req.params.reviewId);
    res.status(200).json('The review has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updatereview = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this review'));
  }
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          category: req.body.category,
          rating: req.body.rating,
          content: req.body.content,
        }
      },
      { new: true });
    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
};

export const getuserinfo = async (req, res, next) => {
  try {
    const reviewInfo = await Review.findById(req.params.reviewId);
    const user = await User.findById(reviewInfo.userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};