import { Response } from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import Progress from '../models/Progress';
import Notification from '../models/Notification';
import { AuthRequest } from '../types';
import pool from '../config/postgres';

export const enrollInCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.body;
    const studentId = req.user!.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      res.status(400).json({ message: 'Already enrolled in this course' });
      return;
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId,
      courseId,
    });

    // Add student to course's enrolledStudents array
    await Course.findByIdAndUpdate(courseId, {
      $addToSet: { enrolledStudents: studentId },
    });

    // Initialize progress
    await Progress.create({
      studentId,
      courseId,
      completedModules: [],
      progressPercentage: 0,
    });

    // Update analytics
    await pool.query(
      'UPDATE course_analytics SET total_enrollments = total_enrollments + 1 WHERE course_id = $1',
      [courseId]
    );

    // Create notification
    await Notification.create({
      userId: studentId,
      type: 'enrollment',
      title: 'Course Enrollment',
      message: `You have successfully enrolled in ${course.title}`,
      courseId,
    });

    res.status(201).json(enrollment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const enrollments = await Enrollment.find({ studentId: req.user!.id })
      .populate({
        path: 'courseId',
        populate: { path: 'instructor', select: 'name email' },
      })
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

