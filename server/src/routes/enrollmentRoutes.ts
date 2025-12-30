import express from 'express';
import { enrollInCourse, getMyCourses } from '../controllers/enrollmentController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticate, authorize('student'), enrollInCourse);
router.get('/my-courses', authenticate, authorize('student'), getMyCourses);

export default router;

