import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../mongoose/schemas/user.mjs';
import Tenant from '../mongoose/schemas/tenant.mjs';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

export default passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/google/redirect"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // Assuming tenantId needs to be determined or set in some manner
        const tenantId = determineTenantId(profile); // This is a placeholder function call

        // Create a new user instance without passwordHash for Google authenticated users
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName || profile.emails[0].value.split('@')[0], // Fallback to part of email as username
          role: 'User', // Default role, adjust as necessary
          // Do not set a default password for Google-authenticated users
          tenantId: tenantId, // Dynamically assign or set tenantId here
        });

        await user.save();
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  }
));


async function fetchTenantIdByEmailDomain(email) {
  const domain = email.split('@')[1];
  const tenant = await Tenant.findOne({ domain: domain });
  return tenant ? tenant.tenantId : null;
}

// Example function to determine tenantId based on the user's profile or other criteria
function determineTenantId(profile) {
  // Implement logic to determine tenantId
  // This could involve looking up by domain, email, or any other logic
  // For demonstration, returning a fixed tenantId
  return '4eUwDr'; // Replace with actual logic to determine tenantId
}

// Ensure serialization and deserialization methods account for the full user object
passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize user by their unique identifier
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Return the full user object
  } catch (error) {
    done(error, null);
  }
});
