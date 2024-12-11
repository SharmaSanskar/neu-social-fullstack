// src/routes/userRoutes.ts
import express, { Request, Response, Router, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';

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
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      course,
      username,
      bio 
    } = req.body as SignupRequest;

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(400).json({ message: 'Username already exists' });
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
      isPrivate: false
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Login API (remains the same)
const loginHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    res.json({ 
      message: 'Login successful', 
      userId: user._id,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
};

// Get all users API (modified to include username)
const getAllUsersHandler: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const users = await User.find()
      .select('-password')
      .select('username firstName lastName email course bio posts friends isPrivate');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
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
      res.status(400).json({ message: 'No valid fields to update' });
      return;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, course, bio, isPrivate },
      { new: true, runValidators: true } // Ensure validation and return updated document
    ).select('-password'); // Exclude password from the response

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating user',
      error,
    });
  }
};


// Get user by ID API (modified to include more details)
const getUserByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .select('username firstName lastName email course bio posts friends isPrivate');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

router.post('/signup', signupHandler);
router.post('/login', loginHandler);
router.get('/users', getAllUsersHandler);
router.get('/users/:id', getUserByIdHandler);
router.put('/users/:id', updateUserHandler);

export default router;