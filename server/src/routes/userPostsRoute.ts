import express, { Request, Response, Router, RequestHandler } from 'express';
import Post, { IPost } from '../models/Post';
import User from '../models/User';
import mongoose from 'mongoose';

const router: Router = express.Router();

// Interface for pagination query
interface PaginationQuery {
  page?: string;
  limit?: string;
}

// Get posts by user ID for profile page
const getUserPostsHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const { page = '1', limit = '10' } = req.query as PaginationQuery;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Convert page and limit to numbers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch posts for the user with pagination
    const [posts, totalPosts] = await Promise.all([
      Post.find({ author: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('_id title content createdAt updatedAt'), // Select specific fields
      Post.countDocuments({ author: userId }) // Get total post count
    ]);

    // Prepare response
    res.json({
      posts: posts.map(post => ({
        _id: post._id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt
      })),
      pagination: {
        currentPage: pageNum,
        pageSize: limitNum,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Error fetching user posts', error });
  }
};

// Route for getting user's posts
router.get('/users/:userId/posts', getUserPostsHandler);

export default router;

// Example of how to use in your main app setup
/*
import express from 'express';
import userPostsRoute from './routes/userPostsRoute';

const app = express();
app.use('/api/v1', userPostsRoute);
*/