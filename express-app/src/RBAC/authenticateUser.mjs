import jwt from 'jsonwebtoken';
import User from '../mongoose/schemas/user.mjs';

const authenticateUser = async (req, res, next) => {
  try {
    // Token verification logic
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header is missing or invalid');
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user; // Attaching the user object to the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed: " + error.message });
  }
};

export default authenticateUser;
