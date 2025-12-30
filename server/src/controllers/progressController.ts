import { Response } from 'express';
import Progress from '../models/Progress';
import Course from '../models/Course';
import { AuthRequest } from '../types';
import pool from '../config/postgres';

export const getProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const progress = await Progress.findOne({
      studentId: req.user!.id,
      courseId: req.params.courseId,
    }).populate('courseId', 'title description');

    if (!progress) {
      res.status(404).json({ message: 'Progress not found' });
      return;
    }

    res.json(progress);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId, completedModules } = req.body;
    const studentId = req.user!.id;

    // Get course to calculate total modules
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    const totalModules = course.modules.length;
    const progressPercentage = totalModules > 0
      ? (completedModules.length / totalModules) * 100
      : 0;

    const progress = await Progress.findOneAndUpdate(
      { studentId, courseId },
      {
        completedModules,
        progressPercentage,
        lastAccessed: new Date(),
      },
      { new: true, upsert: true }
    );

    // Update analytics
    const result = await pool.query(
      'SELECT total_completions, average_progress FROM course_analytics WHERE course_id = $1',
      [courseId]
    );

    if (result.rows.length > 0) {
      const { total_completions, average_progress } = result.rows[0];
      const allProgress = await Progress.find({ courseId });
      const newAverage = allProgress.reduce((sum, p) => sum + p.progressPercentage, 0) / allProgress.length;
      const newCompletions = allProgress.filter(p => p.progressPercentage === 100).length;

      await pool.query(
        'UPDATE course_analytics SET total_completions = $1, average_progress = $2, updated_at = CURRENT_TIMESTAMP WHERE course_id = $3',
        [newCompletions, newAverage, courseId]
      );
    }

    res.json(progress);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

