import mongoose, { Schema } from 'mongoose';
import { ICourse, IModule } from '../types';

const ModuleSchema = new Schema<IModule>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  videoUrl: {
    type: String,
  },
  resources: [{
    type: String,
  }],
});

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    modules: [ModuleSchema],
    enrolledStudents: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICourse>('Course', CourseSchema);

