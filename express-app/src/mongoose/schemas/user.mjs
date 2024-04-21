import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Invalid email format'],
    lowercase: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'ProjectManager', 'Developer', 'User']
  },
  isAdmin: {
    type: Boolean,
    default: false  // Add this line for the isAdmin field
  },
  googleId: {
    type: String,
    sparse: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  refreshTokens: [{
    token: String,
    issuedAt: { type: Date, default: Date.now }
  }],
  tenantId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant'
  }]
}, { timestamps: true });

// Ensure email uniqueness globally, not just per tenant
userSchema.index({ email: 1 }, { unique: true, sparse: true });

// Pre-save hook for password hashing
userSchema.pre('save', async function(next) {
  if (this.isModified('passwordHash')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
  if (this.firstName) {
    this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
  }
  if (this.lastName) {
    this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
  }
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
