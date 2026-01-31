import Review from '../models/Review.js';
import User from '../models/User.js';
import { getCodeReview } from '../services/geminiService.js';

/**
 * POST /api/reviews - Create new code review (protected)
 * Sends code to Gemini, saves review, increments user review count
 */
export const createReview = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    const userId = req.user._id;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    if (typeof code !== 'string' || code.length > 50000) {
      return res.status(400).json({ message: 'Invalid code or code too long' });
    }

    const aiResponse = await getCodeReview(code, language);

    const review = await Review.create({
      userId,
      code,
      language,
      aiResponse,
    });

    await User.findByIdAndUpdate(userId, { $inc: { reviewsCount: 1 } });

    res.status(201).json({
      _id: review._id,
      code: review.code,
      language: review.language,
      aiResponse: review.aiResponse,
      createdAt: review.createdAt,
    });
  } catch (error) {
    if (error.message?.includes('API key')) {
      return res.status(503).json({ message: 'AI service unavailable. Check GEMINI_API_KEY.' });
    }
    next(error);
  }
};

/**
 * GET /api/reviews - Get current user's reviews (protected)
 */
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
