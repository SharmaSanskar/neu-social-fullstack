// src/routes/postRoutes.ts
import express, { Request, Response, Router, RequestHandler } from 'express';
import Post, { IPost } from '../models/Post';
import User from '../models/User';
import mongoose from 'mongoose';

const router: Router = express.Router();

// Interface for Post Request
interface PostRequest {
  title: string;
  content: string;
  userId: string;
}


// // Create a new post
// const createPostHandler: RequestHandler = async (req, res): Promise<void> => {
//   try {
//     const { title, content, userId } = req.body as PostRequest;

//     // Validate user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }
// ///

// ///
//     // Create new post
//     const post = new Post({
//       title,
//       content,
//       author: userId
//     });

//     await post.save();

//     res.status(201).json({ 
//       message: 'Post created successfully', 
//       post: {
//         _id: post._id,
//         title: post.title,
//         content: post.content,
//         createdAt: post.createdAt
//       }
//     });
//   } catch (error) {
//     console.error('Error creating post:', error);
//     res.status(500).json({ message: 'Error creating post', error });
//   }
// };

const createPostHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { title, content, userId } = req.body as PostRequest;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Create new post
    const post = new Post({
      title,
      content,
      author: userId,
      likes: 0,
      comments: 0,
      trending: false
    });

    await post.save();

    // Increment user's post count
    user.posts += 1;
    await user.save();

    res.status(201).json({ 
      message: 'Post created successfully', 
      post: {
        _id: post._id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        likes: post.likes,
        comments: post.comments
      }
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error });
  }
};

// Get posts by User ID
const getPostsByUserIdHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const userId = req.params.userId;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const posts = await Post.find({ author: userId })
      .populate('author', 'firstName lastName username')
      .sort({ createdAt: -1 });

    res.json(posts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt,
      likes: post.likes,
      comments: post.comments
    })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user posts', error });
  }
};

// Get Trending Posts
const getTrendingPostsHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    // Ensure valid sorting and schema structure
    const trendingPosts = await Post.find()
      .populate('author', 'firstName lastName username')
      .sort({ likes: -1, comments: -1 }) // Sorting by likes and comments
      .limit(limit)
      .exec(); // Ensure the query executes properly

    res.json(trendingPosts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt,
      likes: post.likes,
      comments: post.comments, // Ensure comments are handled properly
    })));
  } catch (error) {
    console.error('Error fetching trending posts:', error); // Log error for debugging
    res.status(500).json({ message: 'Error fetching trending posts', error });
  }
};
// Get all posts
const getAllPostsHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const posts = await Post.find()
      .populate('author', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(posts.map(post => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt,
      likes: post.likes,
      comments: post.comments
    })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

// Get post by ID
const getPostByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'firstName lastName email');

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.json({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt,
      likes: post.likes,
      comments: post.comments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
};

// Update post
const updatePostHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { title, content, userId } = req.body as PostRequest;
    const postId = req.params.id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to update this post' });
      return;
    }

    // Update post
    post.title = title;
    post.content = content;
    post.updatedAt = new Date();

    await post.save();

    res.json({ 
      message: 'Post updated successfully',
      post: {
        _id: post._id,
        title: post.title,
        content: post.content,
        updatedAt: post.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
};

// Delete post
const deletePostHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const postId = req.params.id;
    const { userId } = req.body as { userId: string };

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this post' });
      return;
    }

    // Delete post
    await Post.findByIdAndDelete(postId);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};

// Routes
router.post('/posts', createPostHandler);
router.get('/posts', getAllPostsHandler);
router.get('/posts/trending', getTrendingPostsHandler);
router.get('/posts/:id', getPostByIdHandler);
router.put('/posts/:id', updatePostHandler);
router.delete('/posts/:id', deletePostHandler);
router.get('/posts/user/:userId', getPostsByUserIdHandler);


export default router;

