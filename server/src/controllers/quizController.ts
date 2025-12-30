import { Response } from 'express';
import Quiz from '../models/Quiz';
import QuizSubmission from '../models/QuizSubmission';
import Course from '../models/Course';
import { AuthRequest } from '../types';
import pool from '../config/postgres';

export const getQuizzesByCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quizzes = await Quiz.find({ courseId: req.params.courseId })
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuizById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return;
    }

    res.json(quiz);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, title, questions, timeLimit, passingScore } = req.body;

    // Verify course exists and user is instructor
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (course.instructor.toString() !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to create quiz for this course' });
      return;
    }

    const quiz = await Quiz.create({
      courseId,
      title,
      questions,
      timeLimit,
      passingScore: passingScore || 60,
    });

    // Initialize analytics
    await pool.query(
      'INSERT INTO quiz_analytics (quiz_id, course_id, total_submissions, average_score, pass_rate) VALUES ($1, $2, $3, $4, $5)',
      [quiz._id.toString(), courseId, 0, 0.00, 0.00]
    );

    res.status(201).json(quiz);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { quizId, answers } = req.body;
    const studentId = req.user!.id;

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      res.status(404).json({ message: 'Quiz not found' });
      return;
    }

    // Check if already submitted
    const existingSubmission = await QuizSubmission.findOne({ quizId, studentId });
    if (existingSubmission) {
      res.status(400).json({ message: 'Quiz already submitted' });
      return;
    }

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;

    quiz.questions.forEach((question, index) => {
      totalPoints += question.points;
      if (answers[index] === question.correctAnswer) {
        earnedPoints += question.points;
      }
    });

    const score = (earnedPoints / totalPoints) * 100;

    // Create submission
    const submission = await QuizSubmission.create({
      quizId,
      studentId,
      answers,
      score,
    });

    // Update analytics
    const result = await pool.query(
      'SELECT total_submissions, average_score FROM quiz_analytics WHERE quiz_id = $1',
      [quizId]
    );

    if (result.rows.length > 0) {
      const { total_submissions, average_score } = result.rows[0];
      const newTotal = total_submissions + 1;
      const newAverage = ((average_score * total_submissions) + score) / newTotal;
      const passed = score >= quiz.passingScore;
      const passRateResult = await pool.query(
        'SELECT COUNT(*) as passed FROM student_performance WHERE quiz_id = $1 AND score >= $2',
        [quizId, quiz.passingScore]
      );
      const passRate = (parseInt(passRateResult.rows[0].passed) / newTotal) * 100;

      await pool.query(
        'UPDATE quiz_analytics SET total_submissions = $1, average_score = $2, pass_rate = $3, updated_at = CURRENT_TIMESTAMP WHERE quiz_id = $4',
        [newTotal, newAverage, passRate, quizId]
      );
    }

    // Store in student performance
    await pool.query(
      'INSERT INTO student_performance (student_id, course_id, quiz_id, score, completed) VALUES ($1, $2, $3, $4, $5)',
      [studentId, quiz.courseId.toString(), quizId, score, true]
    );

    res.status(201).json({
      submission,
      score,
      passed: score >= quiz.passingScore,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

