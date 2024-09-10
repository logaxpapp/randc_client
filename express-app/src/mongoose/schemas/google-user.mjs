

//  C:\Users\kriss\express-app\src\mongoose\schemas\google-user.mjs


import mongoose from "mongoose";

const GoogleUserSchema = new mongoose.Schema({
    tenantId: {
        type: String,   //mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tenant'
    },
    username: {
        type: String,
        required: true,
        unique: true // Assuming username should still be globally unique
    },
    email: {
        type: String,
        required: true
        // Note: The unique constraint is removed here
    },
    firstName: String,
    lastName: String,
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'ProjectManager', 'Developer', 'User']
    }
}, { timestamps: true });

// Create a compound index for tenantId and email to enforce uniqueness within a tenant
GoogleUserSchema.index({ tenantId: 1, email: 1 }, { unique: true });

const GoogleUser = mongoose.model("User", userSchema);

export default GoogleUser;
