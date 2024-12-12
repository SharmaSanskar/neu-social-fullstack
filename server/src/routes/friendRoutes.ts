// src/routes/friendRoutes.ts
import express, { Request, Response, Router, RequestHandler } from 'express';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

const router: Router = express.Router();

// Find new users (users not in current user's friends list)
const findNewUsersHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const currentUserId = req.params.userId;

    // Validate user exists
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Find users who are not friends and not the current user
    const newUsers = await User.find({
      _id: { 
        $nin: [
          ...currentUser.friendsList, 
          mongoose.Types.ObjectId(currentUserId)
        ] 
      }
    }).select('username firstName lastName email course bio');

    res.json(newUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error finding new users', error });
  }
};

// Fetch current user's friends
const fetchFriendsHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const currentUserId = req.params.userId;

    // Validate user exists and populate friends list
    const currentUser = await User.findById(currentUserId)
      .populate('friendsList', 'username firstName lastName email course bio');

    if (!currentUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(currentUser.friendsList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friends', error });
  }
};

// Send Friend Request
const sendFriendRequestHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { senderId, recipientId } = req.body;

    // Validate both users exist
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if already friends
    if (sender.friendsList.includes(recipientId)) {
      res.status(400).json({ message: 'Users are already friends' });
      return;
    }

    // Check if request already sent
    if (sender.friendRequests.sent.includes(recipientId)) {
      res.status(400).json({ message: 'Friend request already sent' });
      return;
    }

    // Add to friend requests
    sender.friendRequests.sent.push(recipientId);
    recipient.friendRequests.received.push(senderId);

    await sender.save();
    await recipient.save();

    res.status(201).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending friend request', error });
  }
};

// Accept Friend Request
const acceptFriendRequestHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { currentUserId, senderId } = req.body;

    // Validate both users exist
    const currentUser = await User.findById(currentUserId);
    const sender = await User.findById(senderId);

    if (!currentUser || !sender) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove from received/sent requests
    currentUser.friendRequests.received = currentUser.friendRequests.received.filter(
      id => id.toString() !== senderId
    );
    sender.friendRequests.sent = sender.friendRequests.sent.filter(
      id => id.toString() !== currentUserId
    );

    // Add to friends list
    currentUser.friendsList.push(senderId);
    sender.friendsList.push(currentUserId);

    // Increment friends count
    currentUser.friends += 1;
    sender.friends += 1;

    await currentUser.save();
    await sender.save();

    res.json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting friend request', error });
  }
};

// Remove Friends
const removeFriendsHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { currentUserId, friendId } = req.body;

    // Validate both users exist
    const currentUser = await User.findById(currentUserId);
    const friend = await User.findById(friendId);

    if (!currentUser || !friend) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove from friends list
    currentUser.friendsList = currentUser.friendsList.filter(
      id => id.toString() !== friendId
    );
    friend.friendsList = friend.friendsList.filter(
      id => id.toString() !== currentUserId
    );

    // Decrement friends count
    currentUser.friends = Math.max(0, currentUser.friends - 1);
    friend.friends = Math.max(0, friend.friends - 1);

    await currentUser.save();
    await friend.save();

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing friend', error });
  }
};


// Routes
router.get('/users/:userId/new-users', findNewUsersHandler);
router.get('/users/:userId/friends', fetchFriendsHandler);
router.post('/friend-request', sendFriendRequestHandler);
router.post('/accept-friend-request', acceptFriendRequestHandler);
router.post('/remove-friend', removeFriendsHandler);

export default router;