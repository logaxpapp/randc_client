import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

// Custom log format
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create the logger instance
const logger = createLogger({
  level: 'info', // Logging level
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    // Info log file
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
    // Errors log file
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Debug log file
    new transports.File({ filename: 'logs/debug.log', level: 'debug' }),
    // Console transport for development
    new transports.Console({
      format: format.simple(),
      level: 'debug' // Change as needed for verbosity in console
    })
  ]
});

// Stream for morgan middleware
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};

export default logger;
