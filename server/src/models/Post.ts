// src/models/Post.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

// Define Comment Interface
export interface IComment {
  _id: any;
  content: string;
  author: Types.ObjectId;
  username: string;
  createdAt: Date;
}

export interface IPost extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  likes: number;
  likedBy: Types.ObjectId[];
  comments: number;
  commentsList: IComment[];
  trending: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: {
    type: Number,
    default: 0
  },
  commentsList: [CommentSchema],
  trending: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post;