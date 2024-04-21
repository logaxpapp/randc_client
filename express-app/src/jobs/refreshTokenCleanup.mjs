// refreshTokenCleanup.mjs

import User from '../mongoose/schemas/user.mjs';
import dotenv from 'dotenv';

dotenv.config();

// Function to clean up refresh tokens
const cleanupRefreshTokens = async () => {
  try {
    const users = await User.find({}); // Fetch all users

    for (const user of users) {
      const validTokens = user.refreshTokens.filter(token => 
        new Date(token.issuedAt).getTime() > Date.now() - (5 * 3600 * 1000) // 5 hours validity
      );

      // Keep only the last non-expired token
      const tokensToKeep = validTokens.slice(-1);

      if (user.refreshTokens.length !== tokensToKeep.length) {
        console.log(`Updating tokens for user: ${user.email}`);
        user.refreshTokens = tokensToKeep;
        await user.save();
      }
    }

    console.log('Refresh tokens cleanup completed.');
  } catch (error) {
    console.error('Failed to clean up refresh tokens:', error);
  }
};

// Execute the cleanup function
cleanupRefreshTokens().then(() => {
  console.log('Cleanup process finished.');
  process.exit(0); // Exit the process when done
}).catch(error => {
  console.error('Cleanup process failed:', error);
  process.exit(1); // Exit with error code if there was an issue
});