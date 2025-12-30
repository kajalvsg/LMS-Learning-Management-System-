import { Response } from 'express';
import Course from '../models/Course';
import { AuthRequest } from '../types';
import pool from '../config/postgres';

export const getCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email');

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, modules } = req.body;

    const course = await Course.create({
      title,
      description,
      instructor: req.user!.id,
      modules: modules || [],
    });

    // Initialize analytics in PostgreSQL
    await pool.query(
      'INSERT INTO course_analytics (course_id, total_enrollments, total_completions, average_progress) VALUES ($1, $2, $3, $4)',
      [course._id.toString(), 0, 0, 0.00]
    );

    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Check if user is instructor or admin
    if (course.instructor.toString() !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this course' });
      return;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCourse);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Check if user is instructor or admin
    if (course.instructor.toString() !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to delete this course' });
      return;
    }

    await Course.findByIdAndDelete(req.params.id);

    // Delete analytics
    await pool.query('DELETE FROM course_analytics WHERE course_id = $1', [req.params.id]);

    res.json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

