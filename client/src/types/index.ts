export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  modules: Module[];
  enrolledStudents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  _id?: string;
  title: string;
  content: string;
  order: number;
  videoUrl?: string;
  resources?: string[];
}

export interface Quiz {
  _id: string;
  courseId: string;
  title: string;
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface QuizSubmission {
  _id: string;
  quizId: string;
  studentId: string;
  answers: number[];
  score: number;
  submittedAt: string;
}

export interface Progress {
  _id: string;
  studentId: string;
  courseId: string;
  completedModules: string[];
  progressPercentage: number;
  lastAccessed: string;
}

export interface Enrollment {
  _id: string;
  studentId: string;
  courseId: Course;
  enrolledAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'course_update' | 'quiz_deadline' | 'forum_reply' | 'enrollment';
  title: string;
  message: string;
  courseId?: string;
  read: boolean;
  createdAt: string;
}

export interface CourseAnalytics {
  course_id: string;
  total_enrollments: number;
  total_completions: number;
  average_progress: number;
}

export interface QuizAnalytics {
  quiz_id: string;
  course_id: string;
  total_submissions: number;
  average_score: number;
  pass_rate: number;
}

export interface DashboardAnalytics {
  totalCourses: number;
  totalEnrollments: number;
  totalCompletions: number;
  averageProgress: number;
  courseAnalytics: CourseAnalytics[];
}

