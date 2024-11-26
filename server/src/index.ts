import express, { Application } from 'express';
import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';


const app: Application = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', postRoutes);

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





