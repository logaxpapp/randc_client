import logger from './LogsEvent.mjs'; // Import the logger you created

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error internally
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // Respond to the client
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message || 'An unexpected error occurred.',
    },
  });
};

export default errorHandler;
