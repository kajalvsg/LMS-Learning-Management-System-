import express from 'express';
import {
  getCourseAnalytics,
  getDashboardAnalytics,
} from '../controllers/analyticsController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/course/:courseId', authenticate, authorize('instructor', 'admin'), getCourseAnalytics);
router.get('/dashboard', authenticate, authorize('instructor', 'admin'), getDashboardAnalytics);

export default router;

