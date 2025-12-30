import mongoose, { Schema } from 'mongoose';
import { IQuiz, IQuestion } from '../types';

const QuestionSchema = new Schema<IQuestion>({
  question: {
    type: String,
    required: true,
  },
  options: [{
    type: String,
    required: true,
  }],
  correctAnswer: {
    type: Number,
    required: true,
  },
  points: {
    type: Number,
    default: 1,
  },
});

const QuizSchema = new Schema<IQuiz>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a quiz title'],
    },
    questions: [QuestionSchema],
    timeLimit: {
      type: Number, // in minutes
    },
    passingScore: {
      type: Number,
      default: 60,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuiz>('Quiz', QuizSchema);

