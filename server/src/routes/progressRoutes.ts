import express from 'express';
import { getProgress, updateProgress } from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.get('/course/:courseId', authenticate, getProgress);
router.put('/', authenticate, updateProgress);

export default router;

