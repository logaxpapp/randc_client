import express from 'express';
import Profile from '../mongoose/schemas/profile.mjs';
import { sanitizeInput } from '../component/utils/profileMiddleware.mjs'; 
import { validateAndFindTenant } from '../component/utils/middleware.mjs';
import multer from 'multer';
import cloudinaryV2 from '../configuration/cloudinaryConfig.mjs';
import User from '../mongoose/schemas/user.mjs';

const router = express.Router();
const upload = multer({ dest: 'temp/' }); // Temporary storage

router.post('/tenants/:tenantId/profiles/:userId', [validateAndFindTenant, upload.single('image'), sanitizeInput], async (req, res) => {
    try {
        const { userId } = req.params;

        let profileData = { userId: userId, bio: req.body.bio }; // Assuming bio is part of the body

        if (req.file) {
            // Upload the image to Cloudinary in the "profile_images" folder
            const result = await cloudinaryV2.uploader.upload(req.file.path, { folder: "profile_images" });
            profileData.profilePictureUrl = result.url; // Add the Cloudinary URL to the profile data
        }

        const profile = new Profile(profileData);
        await profile.save();
        res.status(201).json({ message: 'Profile created successfully', profile });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create profile', error: error.message });
    }
});

// Get all Profiles within a tenant users
router.get('/tenants/:tenantId/profiles', validateAndFindTenant, async (req, res) => {
    try {
      // Assuming req.tenant._id contains the tenant's ObjectId
      const tenantId = req.tenant._id;
  
      // Step 1: Find all users belonging to the tenant
      const users = await User.find({ tenantId });
  
      // Step 2: Extract the user IDs
      const userIds = users.map(user => user._id);
  
      // Step 3: Query profiles using the list of user IDs
      const profiles = await Profile.find({ userId: { $in: userIds } });
  
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch profiles for tenant users', error: error.message });
    }
  });
  



// Get a single Profile by ID within a tenant
router.get('/tenants/:tenantId/profiles/:userId', validateAndFindTenant, async (req, res) => {
    try {
        // The profile should match the userId from the parameters, not the tenant's _id
        const profile = await Profile.findOne({ userId: req.params.userId });
        if (!profile) return res.status(404).json({ message: 'Profile not found for the specified user within this tenant' });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
});


// Update a Profile within a tenant
router.put('/tenants/:tenantId/profiles/:userId', [validateAndFindTenant, upload.single('image'), sanitizeInput], async (req, res) => {
    try {
        let updateData = { bio: req.body.bio }; // Assuming bio is part of the body

        if (req.file) {
            const result = await cloudinaryV2.uploader.upload(req.file.path, { folder: "profile_images" });
            updateData.profilePictureUrl = result.url; // Add the Cloudinary URL to the update data
        }

        const profile = await Profile.findOneAndUpdate(
            { userId: req.params.userId },
            { $set: updateData },
            { new: true }
        );

        if (!profile) return res.status(404).json({ message: 'Profile not found or not part of the specified tenant' });
        res.json({ message: 'Profile updated successfully', profile });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
});


// Patch a Profile within a tenant
router.patch('/tenants/:tenantId/profiles/:userId', [validateAndFindTenant, upload.single('image'), sanitizeInput], async (req, res) => {
    try {
        // Ensure we're not inadvertently passing a function to $set
        let updateData = { ...req.body };

        if (req.file) {
            const result = await cloudinaryV2.uploader.upload(req.file.path, { folder: "profile_images" });
            updateData.profilePictureUrl = result.url; // Add the Cloudinary URL to the update data
        }

        // Ensure only one userId is used in the query and it's from the route parameters
        const profile = await Profile.findOneAndUpdate(
            { userId: req.params.userId },
            { $set: updateData },
            { new: true }
        );

        if (!profile) return res.status(404).json({ message: 'Profile not found or not part of the specified tenant' });
        res.json({ message: 'Profile patched successfully', profile });
    } catch (error) {
        // Ensure the error message is stringified if it's an object
        const errorMessage = typeof error.message === 'object' ? JSON.stringify(error.message) : error.message;
        res.status(500).json({ message: 'Failed to patch profile', error: errorMessage });
    }
});




// Delete a Profile within a tenant
router.delete('/tenants/:tenantId/profiles/:userId', validateAndFindTenant, async (req, res) => {
    try {
        const profile = await Profile.findOneAndDelete({ userId: req.params.userId });

        if (!profile) return res.status(404).json({ message: 'Profile not found or not part of the specified tenant' });
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete profile', error: error.message });
    }
});


export default router;

