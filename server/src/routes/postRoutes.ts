// src/routes/postRoutes.ts
import express, { Request, Response, Router, RequestHandler } from "express";
import Post, { IComment, IPost } from "../models/Post";
import User from "../models/User";
import mongoose from "mongoose";

const router: Router = express.Router();

// Interface for Post Request
interface PostRequest {
  title: string;
  content: string;
  userId: string;
}

//Posts

interface LikeRequest {
  userId: string;
}

interface CommentRequest {
  userId: string;
  content: string;
}

// Toggles like for a post
const toggleLikeHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId } = req.body as LikeRequest;
    const postId = req.params.id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Check if user has already liked the post
    const hasLiked = post.likedBy.some(
      (likedUserId) => likedUserId.toString() === userId
    );

    if (hasLiked) {
      res.status(400).json({ message: "You have already liked this post" });
      return;
    }

    // Add user to likedBy array and increment likes
    post.likedBy.push(new mongoose.Types.ObjectId(userId));
    post.likes += 1;

    await post.save();

    res.json({
      message: "Post liked",
      likes: post.likes,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Error processing like", error });
  }
};


// Decreases like count (unlike)
const unlikePostHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId } = req.body as LikeRequest;
    const postId = req.params.id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Remove user from likedBy array
    post.likedBy = post.likedBy.filter(
      (likedUserId) => likedUserId.toString() !== userId
    );
    post.likes = Math.max(0, post.likes - 1);

    await post.save();

    res.json({
      message: "Post unliked",
      likes: post.likes,
    });
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).json({ message: "Error processing unlike", error });
  }
};

// Add Comment to a Post
const addCommentHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId, content } = req.body as CommentRequest;
    const postId = req.params.id;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Create new comment
    const newComment: IComment = {
      content,
      author: new mongoose.Types.ObjectId(userId),
      username: user.username, // Add username
      createdAt: new Date(),
      _id: undefined,
    };

    // Add comment to post
    post.commentsList.push(newComment);

    // Increment comment count
    post.comments += 1;

    await post.save();

    // Populate the last added comment's author details
    await post.populate(
      "commentsList.author",
      "firstName lastName username profilePicture"
    );

    // Get the last added comment
    const addedComment = post.commentsList[post.commentsList.length - 1];

    res.status(201).json({
      message: "Comment added successfully",
      comment: {
        _id: addedComment._id,
        content: addedComment.content,
        author: addedComment.author,
        username: addedComment.username, // Include username in response
        createdAt: addedComment.createdAt,
      },
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error });
  }
};

// Delete Comment from a Post
const deleteCommentHandler: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { userId } = req.body as { userId: string };
    const { postId, commentId } = req.params;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Find the comment
    const commentIndex = post.commentsList.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    const comment = post.commentsList[commentIndex];

    // Check if user is the post author or the comment author
    const isPostAuthor = post.author.toString() === userId;
    const isCommentAuthor = comment.author.toString() === userId;

    if (!isPostAuthor && !isCommentAuthor) {
      res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
      return;
    }

    // Remove the comment
    post.commentsList.splice(commentIndex, 1);

    // Decrement comment count
    post.comments -= 1;

    await post.save();

    res.json({
      message: "Comment deleted successfully",
      commentId,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

//Update Comment on a Post
const updateCommentHandler: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { userId, content } = req.body as CommentRequest;
    const { postId, commentId } = req.params;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Find the comment
    const comment = post.commentsList.find(
      (c) => c._id.toString() === commentId
    );

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    // Check if user is the comment author
    if (comment.author.toString() !== userId) {
      res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
      return;
    }

    // Update comment content
    comment.content = content;

    await post.save();

    // Populate author details
    await post.populate(
      "commentsList.author",
      "firstName lastName username profilePicture"
    );

    res.json({
      message: "Comment updated successfully",
      comment: {
        _id: comment._id,
        content: comment.content,
        author: comment.author,
        username: comment.username, // Include username in response
        createdAt: comment.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment", error });
  }
};

//Posts End

const createPostHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { title, content, userId } = req.body as PostRequest;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Create new post
    const post = new Post({
      title,
      content,
      author: userId,
      likes: 0,
      comments: 0,
      trending: false,
    });

    await post.save();

    // Increment user's post count
    user.posts += 1;
    await user.save();

    res.status(201).json({
      message: "Post created successfully",
      post: {
        _id: post._id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        likes: post.likes,
        comments: post.comments,
      },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post", error });
  }
};

// Get posts by User ID
const getPostsByUserIdHandler: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const userId = req.params.userId;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const posts = await Post.find({ author: userId })
      .populate("author", "firstName lastName username profilePicture")
      .sort({ createdAt: -1 });

    res.json(
      posts.map((post) => ({
        _id: post._id,
        title: post.title,
        content: post.content,
        author: post.author,
        createdAt: post.createdAt,
        likes: post.likes,
        likedBy: post.likedBy,
        comments: post.comments,
        commentsList: post.commentsList ? post.commentsList : [],
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching user posts", error });
  }
};

// Get Trending Posts
const getTrendingPostsHandler: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    // Ensure valid sorting and schema structure
    const trendingPosts = await Post.find()
      .populate("author", "firstName lastName username profilePicture")
      .sort({ likes: -1, comments: -1 }) // Sorting by likes and comments
      .limit(limit)
      .exec(); // Ensure the query executes properly

    res.json(
      trendingPosts.map((post) => ({
        _id: post._id,
        title: post.title,
        content: post.content,
        author: post.author,
        createdAt: post.createdAt,
        likes: post.likes,
        comments: post.comments, // Ensure comments are handled properly
      }))
    );
  } catch (error) {
    console.error("Error fetching trending posts:", error); // Log error for debugging
    res.status(500).json({ message: "Error fetching trending posts", error });
  }
};
// Get all posts
const getAllPostsHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const posts = await Post.find()
      .populate("author", "firstName lastName username profilePicture")
      .sort({ createdAt: -1 });

    res.json(
      posts.map((post) => ({
        _id: post._id,
        title: post.title,
        content: post.content,
        author: post.author,
        createdAt: post.createdAt,
        likes: post.likes,
        likedBy: post.likedBy,
        comments: post.comments,
        commentsList: post.commentsList ? post.commentsList.map(comment => ({
          _id: comment._id,
          content: comment.content,
          author: comment.author,
          username: comment.username, // Include username
          createdAt: comment.createdAt,
        })) : [],
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Get post by ID
const getPostByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "firstName lastName username")
      .populate(
        "commentsList.author",
        "firstName lastName username profilePicture"
      );

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.json({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt,
      likes: post.likes,
      likedBy: post.likedBy, // Optionally return users who liked the post
      comments: post.comments,
      commentsList: post.commentsList.map((comment) => ({
        _id: comment._id,
        content: comment.content,
        author: comment.author,
        username: comment.username, // Include username in comments
        createdAt: comment.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
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
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== userId) {
      res.status(403).json({ message: "Not authorized to update this post" });
      return;
    }

    // Update post
    post.title = title;
    post.content = content;
    post.updatedAt = new Date();

    await post.save();

    res.json({
      message: "Post updated successfully",
      post: {
        _id: post._id,
        title: post.title,
        content: post.content,
        updatedAt: post.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
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
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== userId) {
      res.status(403).json({ message: "Not authorized to delete this post" });
      return;
    }

    // Delete post
    await Post.findByIdAndDelete(postId);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

// Routes
router.post("/posts", createPostHandler);
router.get("/posts", getAllPostsHandler);
router.get("/posts/trending", getTrendingPostsHandler);
router.get("/posts/:id", getPostByIdHandler);
router.put("/posts/:id", updatePostHandler);
router.delete("/posts/:id", deletePostHandler);
router.get("/posts/user/:userId", getPostsByUserIdHandler);
router.post("/posts/:id/like", toggleLikeHandler);
router.post("/posts/:id/unlike", unlikePostHandler);
router.post("/posts/:id/comments", addCommentHandler);
router.delete("/posts/:postId/comments/:commentId", deleteCommentHandler);
router.put("/posts/:postId/comments/:commentId", updateCommentHandler);

export default router;
