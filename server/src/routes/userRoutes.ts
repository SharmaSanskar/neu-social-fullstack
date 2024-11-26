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
}

interface LoginRequest {
  email: string;
  password: string;
}

// Signup API
const signupHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email, password, firstName, lastName, course } = req.body as SignupRequest;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      course
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Login API
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

    res.json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  }
};

// Get all users API
const getAllUsersHandler: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get user by ID API
const getUserByIdHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
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

export default router;