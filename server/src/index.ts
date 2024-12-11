import express, { Application } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";

import cors from "cors";


const app: Application = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:3000",
  })
);

// Routes
app.use("/api", userRoutes);
app.use("/api", postRoutes);


// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
