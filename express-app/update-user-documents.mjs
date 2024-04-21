// update-user-documents.mjs
import mongoose from 'mongoose';
import User from './src/mongoose/schemas/user.mjs'; // Adjust the import path as necessary
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost/express-app';

async function addRefreshTokensField() {
  await mongoose.connect(connectionString);
  
  const users = await User.find({ refreshTokens: { $exists: false } });
  const bulkOps = users.map(user => ({
    updateOne: {
      filter: { _id: user._id },
      update: { $set: { refreshTokens: [] } }
    }
  }));

  const result = await User.bulkWrite(bulkOps);
  console.log(`Updated ${result.modifiedCount} users.`);

  await mongoose.disconnect();
}

addRefreshTokensField()
  .then(() => console.log('Completed updating user documents.'))
  .catch(err => console.error('Error updating user documents:', err));
