import mongoose, { Schema } from 'mongoose';
import { IQuizSubmission } from '../types';

const QuizSubmissionSchema = new Schema<IQuizSubmission>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [{
      type: Number,
      required: true,
    }],
    score: {
      type: Number,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate submissions
QuizSubmissionSchema.index({ quizId: 1, studentId: 1 }, { unique: true });

export default mongoose.model<IQuizSubmission>('QuizSubmission', QuizSubmissionSchema);

