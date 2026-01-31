import express from 'express';
import { protect } from '../middleware/auth.js';
import { createReview, getMyReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/', protect, getMyReviews);

export default router;
