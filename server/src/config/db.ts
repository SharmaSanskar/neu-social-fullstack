import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://Viraj012:bgpuJ3We3ZSYV9s4@neu-social-fullstack-cl.wbbcy.mongodb.net/?retryWrites=true&w=majority&appName=neu-social-fullstack-cluster');
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
    
  }
};