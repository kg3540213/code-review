import api from './axios';

export const createReview = (code, language) =>
  api.post('reviews', { code, language });

export const getMyReviews = () => api.get('reviews');
