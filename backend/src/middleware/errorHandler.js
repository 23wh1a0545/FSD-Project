
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let code = err.code || 'SERVER_ERROR';


  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    code = 'DUPLICATE_FIELD';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
   
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    code = 'VALIDATION_ERROR';
  }

 
  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found.`;
    code = 'INVALID_ID';
  }


  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token.';
    code = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired. Please log in again.';
    code = 'TOKEN_EXPIRED';
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
