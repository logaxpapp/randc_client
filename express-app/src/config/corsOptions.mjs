// corsOptions.js
import allowedOrigins from './allowedOrigins.mjs';

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error('Your origin is not allowed by CORS policy'));
    }
  },
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

export default corsOptions;
