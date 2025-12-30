import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courseAPI, enrollmentAPI, quizAPI, progressAPI } from '../services/api';
import { Course, Quiz, Progress } from '../types';
import { toast } from 'react-toastify';
import './CourseDetail.css';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const courseData = await courseAPI.getCourseById(id);
        setCourse(courseData);

        if (user?.role === 'student') {
          const quizzesData = await quizAPI.getQuizzesByCourse(id);
          setQuizzes(quizzesData);
          try {
            const progressData = await progressAPI.getProgress(id);
            setProgress(progressData);
            setIsEnrolled(true);
          } catch {
            setIsEnrolled(false);
          }
        } else {
          const quizzesData = await quizAPI.getQuizzesByCourse(id);
          setQuizzes(quizzesData);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!id) return;

    try {
      await enrollmentAPI.enroll(id);
      toast.success('Successfully enrolled in course!');
      setIsEnrolled(true);
      const progressData = await progressAPI.getProgress(id);
      setProgress(progressData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    }
  };

  const handleModuleComplete = async (moduleId: string) => {
    if (!id || !progress) return;

    const updatedModules = [...progress.completedModules, moduleId];
    try {
      await progressAPI.updateProgress({
        courseId: id,
        completedModules: updatedModules,
      });
      const updatedProgress = await progressAPI.getProgress(id);
      setProgress(updatedProgress);
      toast.success('Module marked as complete!');
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="course-detail">
      <div className="course-header">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <p className="instructor">Instructor: {course.instructor.name}</p>
        {user?.role === 'student' && (
          <>
            {!isEnrolled ? (
              <button className="btn-primary" onClick={handleEnroll}>
                Enroll in Course
              </button>
            ) : (
              progress && (
                <div className="progress-bar">
                  <label>Progress: {progress.progressPercentage.toFixed(1)}%</label>
                  <div className="progress-fill" style={{ width: `${progress.progressPercentage}%` }} />
                </div>
              )
            )}
          </>
        )}
        {(user?.role === 'instructor' || user?.role === 'admin') && (
          <button
            className="btn-primary"
            onClick={() => navigate(`/course/${id}/edit`)}
          >
            Edit Course
          </button>
        )}
      </div>

      <div className="course-content">
        <div className="modules-section">
          <h2>Modules</h2>
          {course.modules.length === 0 ? (
            <p>No modules available yet.</p>
          ) : (
            course.modules
              .sort((a, b) => a.order - b.order)
              .map((module, index) => (
                <div key={index} className="module-card">
                  <h3>{module.title}</h3>
                  <p>{module.content}</p>
                  {module.videoUrl && (
                    <a href={module.videoUrl} target="_blank" rel="noopener noreferrer">
                      Watch Video
                    </a>
                  )}
                  {user?.role === 'student' && isEnrolled && progress && (
                    <div className="module-actions">
                      {progress.completedModules.includes(module._id || '') ? (
                        <span className="completed">✓ Completed</span>
                      ) : (
                        <button
                          className="btn-secondary"
                          onClick={() => handleModuleComplete(module._id || '')}
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
          )}
        </div>

        <div className="quizzes-section">
          <h2>Quizzes</h2>
          {user?.role === 'instructor' || user?.role === 'admin' ? (
            <button
              className="btn-primary"
              onClick={() => navigate(`/quiz/create?courseId=${id}`)}
            >
              Create Quiz
            </button>
          ) : null}
          {quizzes.length === 0 ? (
            <p>No quizzes available yet.</p>
          ) : (
            quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="quiz-card"
                onClick={() => navigate(`/quiz/${quiz._id}`)}
              >
                <h3>{quiz.title}</h3>
                <p>{quiz.questions.length} questions</p>
                {quiz.timeLimit && <p>Time limit: {quiz.timeLimit} minutes</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

