import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, getreviews, deletereview, updatereview, getuserinfo } from '../controllers/review.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getreviews', getreviews);
router.delete('/deletereview/:reviewId/:userId', verifyToken, deletereview);
router.put('/updatereview/:reviewId/:userId', verifyToken, updatereview);
router.get('/getuserinfo/:reviewId', getuserinfo);

export default router;