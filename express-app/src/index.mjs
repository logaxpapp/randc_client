import cors from 'cors';
import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from 'cookie-parser';
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import MongoStore from "connect-mongo";
import './strategies/local-strategy.mjs';
import './strategies/google-strategy.mjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './mongoose/schemas/user.mjs';
import bodyParser from 'body-parser';
import corsOptions from './config/corsOptions.mjs';
// import './jobs/refreshTokenCleanup.mjs';

dotenv.config();


const app = express();

// Enable all CORS requests
app.use(cors({
    origin: "http://localhost:3000", // Your React app URL
    credentials: true,
  }));
  


// use mongoose to connect to MongoDB
const connectionString = 'mongodb://localhost/express-app';

mongoose.connect(connectionString)
    .then(() => console.log('Mongoose connection open to ' + connectionString))
    .catch(err => console.error('Mongoose connection error: ' + err));

// Connection events
const db = mongoose.connection;


db.on('connected', () => {
    console.log('Mongoose connection open to ' + connectionString);
});

db.on('error', (err) => {
    console.error('Mongoose connection error: ' + err);
});

db.on('disconnected', () => {
    console.log('Mongoose connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
    db.close(() => {
        console.log('Mongoose connection disconnected through app termination');
        process.exit(0);
    });
});


// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Using cookie-parser middleware
app.use(cookieParser());


  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
// Body parser middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());


app.use(routes);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//http://localhost:5000/api/auth/google/redirect