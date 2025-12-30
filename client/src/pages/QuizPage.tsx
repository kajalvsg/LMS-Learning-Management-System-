import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI } from '../services/api';
import { Quiz } from '../types';
import { toast } from 'react-toastify';
import './QuizPage.css';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;

      try {
        const quizData = await quizAPI.getQuizById(id);
        setQuiz(quizData);
        setAnswers(new Array(quizData.questions.length).fill(-1));
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!id || !quiz) return;

    if (answers.some((a) => a === -1)) {
      toast.warning('Please answer all questions');
      return;
    }

    try {
      const response = await quizAPI.submitQuiz(id, answers);
      setScore(response.score);
      setSubmitted(true);
      toast.success(`Quiz submitted! Score: ${response.score.toFixed(1)}%`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <div className="quiz-page">
      <h1>{quiz.title}</h1>
      {quiz.timeLimit && <p className="time-limit">Time limit: {quiz.timeLimit} minutes</p>}

      {submitted && score !== null ? (
        <div className="quiz-result">
          <h2>Quiz Results</h2>
          <div className={`score ${score >= quiz.passingScore ? 'passed' : 'failed'}`}>
            <h3>Your Score: {score.toFixed(1)}%</h3>
            <p>{score >= quiz.passingScore ? 'Congratulations! You passed!' : 'You did not pass. Passing score: ' + quiz.passingScore + '%'}</p>
          </div>
          <button className="btn-primary" onClick={() => navigate(-1)}>
            Back to Course
          </button>
        </div>
      ) : (
        <>
          <div className="questions">
            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="question-card">
                <h3>
                  Question {qIndex + 1} ({question.points} points)
                </h3>
                <p>{question.question}</p>
                <div className="options">
                  {question.options.map((option, oIndex) => (
                    <label key={oIndex} className="option-label">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={oIndex}
                        checked={answers[qIndex] === oIndex}
                        onChange={() => handleAnswerChange(qIndex, oIndex)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            className="btn-primary submit-quiz"
            onClick={handleSubmit}
            disabled={answers.some((a) => a === -1)}
          >
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );
};

export default QuizPage;

