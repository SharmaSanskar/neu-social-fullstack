// src/models/User.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  course: string;
  username: string;
  bio?: string;
  posts: number;
  friends: number;
  isPrivate: boolean;
  profilePicture?: string;
  friendsList: Types.ObjectId[];
  friendRequests: {
    sent: Types.ObjectId[];
    received: Types.ObjectId[];
  };
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  bio: {
    type: String,
    default: null
  },
  posts: {
    type: Number,
    default: 0
  },
  friends: {
    type: Number,
    default: 0
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String,
    default: null
  },
  friendsList: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  friendRequests: {
    sent: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    received: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  }
}, {
  timestamps: true
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;