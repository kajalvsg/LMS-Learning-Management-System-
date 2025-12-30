import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI, enrollmentAPI, analyticsAPI } from '../services/api';
import { Course, Enrollment, DashboardAnalytics } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'student') {
          const myCourses = await enrollmentAPI.getMyCourses();
          setEnrollments(myCourses);
        } else if (user?.role === 'instructor' || user?.role === 'admin') {
          const allCourses = await courseAPI.getCourses();
          const instructorCourses = allCourses.filter(
            (c) => c.instructor._id === user.id
          );
          setCourses(instructorCourses);
          const analyticsData = await analyticsAPI.getDashboardAnalytics();
          setAnalytics(analyticsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (user?.role === 'student') {
    return (
      <div className="dashboard">
        <h1>My Courses</h1>
        <div className="courses-grid">
          {enrollments.length === 0 ? (
            <p>You haven't enrolled in any courses yet.</p>
          ) : (
            enrollments.map((enrollment) => (
              <div
                key={enrollment._id}
                className="course-card"
                onClick={() => navigate(`/course/${enrollment.courseId._id}`)}
              >
                <h3>{enrollment.courseId.title}</h3>
                <p>{enrollment.courseId.description}</p>
                <p className="instructor">
                  Instructor: {enrollment.courseId.instructor.name}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Instructor Dashboard</h1>
      {analytics && (
        <div className="analytics-summary">
          <div className="stat-card">
            <h3>Total Courses</h3>
            <p>{analytics.totalCourses}</p>
          </div>
          <div className="stat-card">
            <h3>Total Enrollments</h3>
            <p>{analytics.totalEnrollments}</p>
          </div>
          <div className="stat-card">
            <h3>Total Completions</h3>
            <p>{analytics.totalCompletions}</p>
          </div>
          <div className="stat-card">
            <h3>Average Progress</h3>
            <p>{analytics.averageProgress.toFixed(1)}%</p>
          </div>
        </div>
      )}
      <div className="courses-section">
        <h2>My Courses</h2>
        <button
          className="btn-primary"
          onClick={() => navigate('/course/create')}
        >
          Create New Course
        </button>
        <div className="courses-grid">
          {courses.length === 0 ? (
            <p>You haven't created any courses yet.</p>
          ) : (
            courses.map((course) => (
              <div
                key={course._id}
                className="course-card"
                onClick={() => navigate(`/course/${course._id}`)}
              >
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p className="enrolled">
                  {course.enrolledStudents.length} students enrolled
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

