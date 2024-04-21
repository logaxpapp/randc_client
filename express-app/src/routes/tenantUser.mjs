import { Router } from "express";
import Tenant from "../mongoose/schemas/tenant.mjs";
import User from "../mongoose/schemas/user.mjs";
import { validateAndFindTenant, validateAndFindUserWithinTenant, loggerMiddleware, attachTenantToRequest } from '../component/utils/middleware.mjs';
import bcrypt from 'bcrypt';

const router = Router();
router.use(loggerMiddleware);

// Tenant Specific Users Routes

// GET all users within a specific tenant
router.get("/api/tenants/:tenantId/users", validateAndFindTenant, async (req, res) => {
    try {
        // Using req.tenant._id to query users belonging to the tenant
        const tenantUsers = await User.find({ tenantId: req.params.tenantId });
        res.json(tenantUsers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});


// GET a specific user within a specific tenant
router.get("/api/tenants/:tenantId/users/:userId", validateAndFindTenant, validateAndFindUserWithinTenant, async (req, res) => {
    try {
        // Since validateAndFindTenant middleware sets req.tenant, we use req.tenant._id
        const tenantUser = await User.findOne({ tenantId: req.params.tenantId, _id: req.params.userId });
        if (!tenantUser) {
            return res.status(404).json({ message: "User not found within this tenant" });
        }
        res.json(tenantUser);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

// Assuming router is an instance of express.Router()
// and validateAndFindTenant is imported or defined in the same file

// router.post("/api/tenants/:tenantId/users", validateAndFindTenant, async (req, res) => {
//     const { email, password, role } = req.body;
//     const { tenantId } = req.params || req.tenant._id; // Use req.params if available, otherwise use req.tenant

//     try {
//         const passwordHash = await bcrypt.hash(password, 10);
//         const newUser = new User({
//             email,
//             passwordHash,
//             role,
//             // Add the tenantId to an array, enabling multi-tenancy support
//             tenantId: [tenantId] // This assumes each user is initially added to one tenant
//         });

//         await newUser.save();

//         // Exclude sensitive information from the response
//         const userResponse = { ...newUser.toObject(), passwordHash: undefined };
//         res.status(201).json({ message: "User created successfully within tenant", user: userResponse });
//     } catch (error) {
//         console.error("Error creating user:", error);
//         res.status(500).json({ message: "Error creating user", error: error.message });
//     }
// });





// PUT to update a user's details within a specific tenant
router.put("/api/tenants/:tenantId/users/:userId", validateAndFindTenant, async (req, res) => {
    const { userId } = req.params;
    const { email, firstName, lastName, password, role } = req.body;
    try {
        const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
        const updates = {
            ...(email && { email }),
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(passwordHash && { passwordHash }),
            ...(role && { role })
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const { passwordHash: _, ...userResponse } = updatedUser.toObject(); // Exclude passwordHash from response
        res.json(userResponse);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});

// DELETE a user from a specific tenant
router.delete("/api/tenants/:tenantId/users/:userId", validateAndFindTenant, async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId, tenantId: req.tenant._id });
        if (!user) {
            return res.status(404).json({ message: "User not found or not part of the specified tenant" });
        }
        // Corrected to ensure a response body is sent with a 200 OK status
        res.status(200).json({ message: "User successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});


router.post("/api/tenants/:tenantId/add-user", validateAndFindTenant, async (req, res) => {
    const { email } = req.body; // Assuming the email to identify the user is sent in the request body
    
    try {
        // Find the user by email
        let user = await User.findOne({ email: email });
        
        // Check if the user already exists in the system
        if (user) {
            // Check if the user is already part of the tenant
            if (user.tenantId.includes(req.tenant._id.toString())) {
                return res.status(400).json({ message: "User is already part of this tenant." });
            }
            
            // Add the tenant ID to the user's tenantId array
            user.tenantId.push(req.tenant._id);
            await user.save();
            
            res.status(200).json({ message: "User successfully added to the tenant.", user: { id: user._id, email: user.email, tenantId: user.tenantId } });
        } else {
            // Handle the case where the user does not exist in the system
            res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        console.error("Error adding user to tenant:", error);
        res.status(500).json({ message: "Error adding user to tenant", error: error.message });
    }
});

export default router;

