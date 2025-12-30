import { Response } from 'express';
import { AuthRequest } from '../types';
import pool from '../config/postgres';
import Course from '../models/Course';

export const getCourseAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    // Verify user is instructor or admin
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    if (course.instructor.toString() !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to view analytics' });
      return;
    }

    // Get course analytics
    const courseAnalytics = await pool.query(
      'SELECT * FROM course_analytics WHERE course_id = $1',
      [courseId]
    );

    // Get quiz analytics for this course
    const quizAnalytics = await pool.query(
      'SELECT * FROM quiz_analytics WHERE course_id = $1',
      [courseId]
    );

    res.json({
      course: courseAnalytics.rows[0] || null,
      quizzes: quizAnalytics.rows,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user!.role !== 'instructor' && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    // Get all courses by instructor
    const courses = await Course.find({
      instructor: req.user!.id,
    });

    const courseIds = courses.map(c => c._id.toString());

    if (courseIds.length === 0) {
      res.json({
        totalCourses: 0,
        totalEnrollments: 0,
        totalCompletions: 0,
        averageProgress: 0,
        courseAnalytics: [],
      });
      return;
    }

    // Get analytics for all instructor's courses
    const placeholders = courseIds.map((_, i) => `$${i + 1}`).join(',');
    const analytics = await pool.query(
      `SELECT * FROM course_analytics WHERE course_id IN (${placeholders})`,
      courseIds
    );

    const totalEnrollments = analytics.rows.reduce((sum, row) => sum + row.total_enrollments, 0);
    const totalCompletions = analytics.rows.reduce((sum, row) => sum + row.total_completions, 0);
    const avgProgress = analytics.rows.length > 0
      ? analytics.rows.reduce((sum, row) => sum + parseFloat(row.average_progress), 0) / analytics.rows.length
      : 0;

    res.json({
      totalCourses: courses.length,
      totalEnrollments,
      totalCompletions,
      averageProgress: avgProgress,
      courseAnalytics: analytics.rows,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

