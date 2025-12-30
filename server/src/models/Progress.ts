import mongoose, { Schema } from 'mongoose';
import { IProgress } from '../types';

const ProgressSchema = new Schema<IProgress>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedModules: [{
      type: String,
    }],
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One progress record per student per course
ProgressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<IProgress>('Progress', ProgressSchema);

