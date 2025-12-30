import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourse extends Document {
  _id: string;
  title: string;
  description: string;
  instructor: string; // User ID
  modules: IModule[];
  enrolledStudents: string[]; // Array of User IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface IModule extends Document {
  title: string;
  content: string;
  order: number;
  videoUrl?: string;
  resources?: string[];
}

export interface IQuiz extends Document {
  _id: string;
  courseId: string;
  title: string;
  questions: IQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  points: number;
}

export interface IQuizSubmission extends Document {
  _id: string;
  quizId: string;
  studentId: string;
  answers: number[]; // array of selected option indices
  score: number;
  submittedAt: Date;
}

export interface IProgress extends Document {
  _id: string;
  studentId: string;
  courseId: string;
  completedModules: string[]; // Array of module IDs
  progressPercentage: number;
  lastAccessed: Date;
  updatedAt: Date;
}

export interface IEnrollment extends Document {
  _id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Date;
}

export interface IForumPost extends Document {
  _id: string;
  courseId: string;
  authorId: string;
  title: string;
  content: string;
  replies: IForumReply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IForumReply {
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface INotification extends Document {
  _id: string;
  userId: string;
  type: 'course_update' | 'quiz_deadline' | 'forum_reply' | 'enrollment';
  title: string;
  message: string;
  courseId?: string;
  read: boolean;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

