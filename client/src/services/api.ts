import axios from 'axios';
import {
  User,
  Course,
  Quiz,
  Progress,
  Enrollment,
  QuizSubmission,
  DashboardAnalytics,
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; role?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Course API
export const courseAPI = {
  getCourses: async (): Promise<Course[]> => {
    const response = await api.get('/courses');
    return response.data;
  },
  getCourseById: async (id: string): Promise<Course> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  createCourse: async (data: { title: string; description: string; modules?: any[] }) => {
    const response = await api.post('/courses', data);
    return response.data;
  },
  updateCourse: async (id: string, data: Partial<Course>) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },
  deleteCourse: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

// Enrollment API
export const enrollmentAPI = {
  enroll: async (courseId: string): Promise<Enrollment> => {
    const response = await api.post('/enrollments', { courseId });
    return response.data;
  },
  getMyCourses: async (): Promise<Enrollment[]> => {
    const response = await api.get('/enrollments/my-courses');
    return response.data;
  },
};

// Quiz API
export const quizAPI = {
  getQuizzesByCourse: async (courseId: string): Promise<Quiz[]> => {
    const response = await api.get(`/quizzes/course/${courseId}`);
    return response.data;
  },
  getQuizById: async (id: string): Promise<Quiz> => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },
  createQuiz: async (data: {
    courseId: string;
    title: string;
    questions: any[];
    timeLimit?: number;
    passingScore?: number;
  }) => {
    const response = await api.post('/quizzes', data);
    return response.data;
  },
  submitQuiz: async (quizId: string, answers: number[]): Promise<QuizSubmission> => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { quizId, answers });
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  getProgress: async (courseId: string): Promise<Progress> => {
    const response = await api.get(`/progress/course/${courseId}`);
    return response.data;
  },
  updateProgress: async (data: { courseId: string; completedModules: string[] }) => {
    const response = await api.put('/progress', data);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getCourseAnalytics: async (courseId: string) => {
    const response = await api.get(`/analytics/course/${courseId}`);
    return response.data;
  },
  getDashboardAnalytics: async (): Promise<DashboardAnalytics> => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },
};

export default api;

