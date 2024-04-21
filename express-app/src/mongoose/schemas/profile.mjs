import mongoose from'mongoose';

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Establishes a reference to the User model
    },
    profilePictureUrl: String, // URL to the user's profile picture
    bio: {
        type: String,
        validate: {
            // Validator to ensure bio is not more than 50 words
            validator: function(v) {
                return v.split(/\s+/).length <= 50;
            },
            message: props => `Bio must not exceed 50 words.`
        }
    },
}, { timestamps: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
