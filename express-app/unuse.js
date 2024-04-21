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

// Using session middleware
// Assuming mongoose.connection is available from your existing MongoDB connection setup
const sessionStore = MongoStore.create({
    mongoUrl: connectionString,
    collectionName: 'sessions'
  });
  
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // Use MongoStore as the session store
    cookie: {
      maxAge: 3600 * 24 * 60 * 1000, // Fixed unit (milliseconds)
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    }
  }));


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
  
// Passport middleware
app.use(passport.initialize());

app.use(passport.session());

app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//http://localhost:5000/api/auth/google/redirect





import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../mongoose/schemas/user.mjs";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const tenantId = req.body.tenantId || req.query.tenantId; 
  console.log(`Authenticating user with email: ${email} for tenantId: ${tenantId}`);

  try {
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return done(null, false, { message: 'Invalid tenantId.' });
    }

    const user = await User.findOne({ email: email, tenantId: tenantId });
    console.log(user);
    if (!user) {
      return done(null, false, { message: 'Incorrect email, password, or tenant.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect email, password, or tenant.' });
    }

    // Ensure the refreshTokens field is initialized as an array if not already
    if (!user.refreshTokens || !Array.isArray(user.refreshTokens)) {
      user.refreshTokens = []; // Initialize as empty array if not exist or not an array
      console.log(`Initialized refreshTokens for user ${user._id}`);
    }

    // Create JWT access and refresh tokens
    const accessToken = jwt.sign({ id: user._id, email: user.email, tenantId: user.tenantId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Push the new refresh token and save the user document
    user.refreshTokens.push({ token: refreshToken, issuedAt: new Date() });
    await user.save();

    // Prepare and send the response
    const userWithoutPassword = { ...user.toObject(), passwordHash: undefined };
    return done(null, { user: userWithoutPassword, accessToken, refreshToken });
  } catch (error) {
    console.error('Error during authentication:', error);
    return done(error);
  }
}));


// Serialization and Deserialization Logic

// Serialization: Save the user ID in the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user ? user : false);
  } catch (error) {
    done(error);
  }
}); 
// passport.serializeUser((user, done) => {
//   // Serialize the user by their MongoDB _id
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     // Find the user by MongoDB _id in the database
//     const user = await User.findById(id);
//     if (user) {
//       // Prepare user object without the passwordHash
//       const userWithoutPassword = { ...user.toObject(), passwordHash: undefined };
//       done(null, userWithoutPassword);
//     } else {
//       done(new Error('User not found'), null);
//     }
//   } catch (error) {
//     done(error, null);
//   }
// });
