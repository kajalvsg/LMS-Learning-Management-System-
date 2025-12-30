import mongoose, { Schema } from 'mongoose';
import { IForumPost, IForumReply } from '../types';

const ForumReplySchema = new Schema<IForumReply>({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ForumPostSchema = new Schema<IForumPost>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    replies: [ForumReplySchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IForumPost>('ForumPost', ForumPostSchema);

