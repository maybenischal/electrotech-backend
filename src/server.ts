import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/UserRoutes';  
import errorHandler from './middleware/ErrorHandler';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());

// CORS config
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
}));

// Routes
app.use('/admin/users', userRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });



  // ⚠️ Error handler must be last
app.use(errorHandler);