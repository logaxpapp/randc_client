import passport from 'passport';
import mongoose from 'mongoose';
import User from '../mongoose/schemas/user.mjs';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';



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


    const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }
    // Proceed with JWT creation and user validation
    const payload = { id: user.id.toString(), email: user.email, role: user.role, tenantId: user.tenantId.toString() };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return done(null, user, { token }); // Return the user and the token
  } catch (error) {
    return done(error);
  }
}));


