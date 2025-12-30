import express from 'express';
import {
  getQuizzesByCourse,
  getQuizById,
  createQuiz,
  submitQuiz,
} from '../controllers/quizController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/course/:courseId', authenticate, getQuizzesByCourse);
router.get('/:id', authenticate, getQuizById);
router.post('/', authenticate, authorize('instructor', 'admin'), createQuiz);
router.post('/:id/submit', authenticate, authorize('student'), submitQuiz);

export default router;

