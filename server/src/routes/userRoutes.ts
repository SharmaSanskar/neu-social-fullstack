// src/routes/userRoutes.ts
import express, { Request, Response, Router, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import mongoose from "mongoose";

const router: Router = express.Router();

interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  course: string;
  username: string;
  bio?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// Signup API
const signupHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email, password, firstName, lastName, course, username, bio } =
      req.body as SignupRequest;

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(400).json({ message: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      course,
      username,
      bio: bio || null,
      posts: 0,
      friends: 0,
      isPrivate: false,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Login API (remains the same)
const loginHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: "Error during login", error });
  }
};

// Get all users API (modified to include username)
const getAllUsersHandler: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const users = await User.find()
      .select("-password")
      .select(
        "username firstName lastName email course bio posts friends isPrivate"
      );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};
//Updating the User

// Update User API
const updateUserHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params; // Extract user ID from the route
    const { firstName, lastName, course, bio, isPrivate } = req.body; // Extract fields from the body

    // Validate if at least one field is provided
    if (!firstName && !lastName && !course && !bio && isPrivate === undefined) {
      res.status(400).json({ message: "No valid fields to update" });
      return;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, course, bio, isPrivate },
      { new: true, runValidators: true } // Ensure validation and return updated document
    ).select("-password"); // Exclude password from the response

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error,
    });
  }
};

// Get user by ID API (modified to include more details)
const getUserByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .select(
        "username firstName lastName email course bio posts friends isPrivate"
      );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

const getUserByUsernameHandler: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password")
      .select(
        "username firstName lastName email course bio posts friends isPrivate"
      );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Profile Picture Update Handler
const updateProfilePictureHandler: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { profilePictureUrl } = req.body;

    // Validate input
    if (!profilePictureUrl) {
      res.status(400).json({ message: "Profile picture URL is required" });
      return;
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePictureUrl },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      message: "Profile picture updated successfully",
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Error updating profile picture", error });
  }
};

// Find New Users Handler
const findNewUsersHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const currentUserId = req.params.userId;

    // Find the current user to get their existing friends
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Find users who are not the current user and not already friends
    const newUsers = await User.find({
      _id: {
        $ne: currentUserId,
        $nin: currentUser.friendsList,
      },
    }).select("username firstName lastName email course profilePicture");

    res.json(newUsers);
  } catch (error) {
    console.error("Error finding new users:", error);
    res.status(500).json({ message: "Error finding new users", error });
  }
};

// Fetch Friends Handler
const fetchFriendsHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const currentUserId = req.params.userId;

    // Find the current user and populate friends
    const user = await User.findById(currentUserId).populate({
      path: "friendsList",
      select: "username firstName lastName email course profilePicture",
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user.friendsList);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Error fetching friends", error });
  }
};

// Send Friend Request Handler
const sendFriendRequestHandler: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { senderId, recipientId } = req.body;

    // Validate both users exist
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if already friends or request already sent
    if (
      sender.friendsList.includes(recipientId) ||
      recipient.friendsList.includes(senderId) ||
      sender.friendRequests.sent.includes(recipientId) ||
      recipient.friendRequests.received.includes(senderId)
    ) {
      res.status(400).json({
        message: "Friend request already exists or users are already friends",
      });
      return;
    }

    // Add friend requests
    sender.friendRequests.sent.push(new mongoose.Types.ObjectId(recipientId));
    recipient.friendRequests.received.push(
      new mongoose.Types.ObjectId(senderId)
    );

    await sender.save();
    await recipient.save();

    res.status(201).json({
      message: "Friend request sent successfully",
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Error sending friend request", error });
  }
};

// Accept Friend Request Handler
const acceptFriendRequestHandler: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { userId, senderId } = req.body;

    // Find both users
    const user = await User.findById(userId);
    const sender = await User.findById(senderId);

    if (!user || !sender) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Remove from friend requests
    user.friendRequests.received = user.friendRequests.received.filter(
      (id) => id.toString() !== senderId
    );
    sender.friendRequests.sent = sender.friendRequests.sent.filter(
      (id) => id.toString() !== userId
    );

    // Add to friends list
    user.friendsList.push(new mongoose.Types.ObjectId(senderId));
    sender.friendsList.push(new mongoose.Types.ObjectId(userId));

    // Increment friends count
    user.friends += 1;
    sender.friends += 1;

    await user.save();
    await sender.save();

    res.json({
      message: "Friend request accepted",
      friends: {
        user: user.friends,
        sender: sender.friends,
      },
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Error accepting friend request", error });
  }
};

//Removing Friend
const removeFriendHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { userId, friendId } = req.body;

    // Validate input
    if (!userId || !friendId) {
      res.status(400).json({ message: "User ID and Friend ID are required" });
      return;
    }

    // Find both users
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      res.status(404).json({ message: "User or friend not found" });
      return;
    }

    // Check if they are actually friends
    const isUserFriend = user.friendsList.some(
      (id) => id.toString() === friendId
    );
    const isFriendUser = friend.friendsList.some(
      (id) => id.toString() === userId
    );

    if (!isUserFriend || !isFriendUser) {
      res.status(400).json({ message: "Users are not friends" });
      return;
    }

    // Remove from each other's friends list
    user.friendsList = user.friendsList.filter(
      (id) => id.toString() !== friendId
    );
    friend.friendsList = friend.friendsList.filter(
      (id) => id.toString() !== userId
    );

    // Decrement friends count, ensuring it never goes below 0
    user.friends = Math.max(0, user.friends - 1);
    friend.friends = Math.max(0, friend.friends - 1);

    // Remove any pending friend requests if they exist
    user.friendRequests.sent = user.friendRequests.sent.filter(
      (id) => id.toString() !== friendId
    );
    user.friendRequests.received = user.friendRequests.received.filter(
      (id) => id.toString() !== friendId
    );

    friend.friendRequests.sent = friend.friendRequests.sent.filter(
      (id) => id.toString() !== userId
    );
    friend.friendRequests.received = friend.friendRequests.received.filter(
      (id) => id.toString() !== userId
    );

    // Save both users
    await user.save();
    await friend.save();

    res.json({
      message: "Friend removed successfully",
      friends: {
        user: user.friends,
        friend: friend.friends,
      },
    });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({
      message: "Error removing friend",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const fetchMultipleUsersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userIds } = req.body;

    // Validate input
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({ message: "Invalid or missing user IDs" });
      return;
    }

    // Fetch users by IDs
    const users = await User.find({
      _id: { $in: userIds },
    }).select("-password"); // Exclude password from the response

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users by IDs:", error);
    res.status(500).json({ message: "Error fetching users by IDs", error });
  }
};

router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.get("/users", getAllUsersHandler);
router.post("/users/multiple", fetchMultipleUsersHandler);
router.get("/users/:id", getUserByIdHandler);
router.put("/users/:id", updateUserHandler);
router.get("/users/username/:username", getUserByUsernameHandler);
router.put("/users/:userId/profile-picture", updateProfilePictureHandler);
router.get("/users/find-new/:userId", findNewUsersHandler);
router.get("/users/friends/:userId", fetchFriendsHandler);
router.post("/users/friend-request/send", sendFriendRequestHandler);
router.post("/users/friend-request/accept", acceptFriendRequestHandler);
router.post("/users/friends/remove", removeFriendHandler);

export default router;
