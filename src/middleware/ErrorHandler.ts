import { ErrorRequestHandler } from 'express';
import { MongoServerError } from 'mongodb';
import { AppError } from '../../utils/AppError';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  let statusCode = 500;
  let message = 'Something went wrong';

  // ✅ Custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // ✅ Duplicate key error
  else if (err instanceof MongoServerError && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `Duplicate field: "${field}" with value "${value}" already exists.`;
  }

  // ✅ Mongoose validation error
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(', ');
  }

  // Fallback
  res.status(statusCode).json({
    status: 'error',
    message,
  });
};

export default errorHandler;
