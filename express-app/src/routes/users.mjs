

import { Router } from "express";
import User from "../mongoose/schemas/user.mjs";



import { userValidationRules, validate,  
    updateUserValidationRules,  filterQueryValidationRules } from '../component/utils/validationSchemas.mjs';
import { matchedData } from "express-validator";
import bcrypt from 'bcrypt';

import { loggerMiddleware, validateAndFindUser, validateTenantExists,
   } from '../component/utils/middleware.mjs';

const  router = Router();

router.use(loggerMiddleware)


// Asynchronous function to hash a password
async function hashPassword(password) {
    const saltRounds = 10; // The cost factor controls how much time is needed to calculate a single bcrypt hash. Higher values are more secure but slower.
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.error('Hashing error:', error);
        throw error; // Rethrow or handle error appropriately
    }
}


router.get('/api/users', filterQueryValidationRules(), validate, async (req, res) => {
    try {
        let query = User.find({}); // Start with a query that selects all users

        // Apply filtering based on the query parameters
        if (req.query.filter) {
            const filter = req.query.filter.toLowerCase();
            query = query.where('username').regex(filter, 'i')
                .or([{ 'firstName': { $regex: filter, $options: 'i' } }, { 'lastName': { $regex: filter, $options: 'i' } }]);
        }

        const users = await query.exec(); // Execute the query to get filtered results

        res.json(users);
    } catch (error) {
        console.error('Fetching users error:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});



router.get('/api/users/:userId', validateAndFindUser, (req, res) => {
    // Use the userIndex added by the middleware to access the user from the users array
    const user = users[req.userIndex];
    res.json(user);
});

router.post("/api/users", userValidationRules(), validate, async (req, res) => {
    try {
        const { tenantId, email, firstName, lastName, password, role } = req.body;

        const passwordHash = await hashPassword(password);

        const newUser = new User({
            tenantId,
            email,
            firstName,
            lastName,
            passwordHash,
            role
        });

        await newUser.save(); // Save the new user to the database

        // Exclude passwordHash from the response
        const responseUser = newUser.toObject();
        delete responseUser.passwordHash;
        
        res.status(201).json(responseUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to create user", error: error.message });
    }
});


// Example of PUT route
router.put('/api/users/:userId', validateAndFindUser, updateUserValidationRules(), validate, async (req, res) => {
    try {
        const { userId } = req.params;
        const data = matchedData(req, { includeOptionals: false }); // Ensure only validated data is used
        const { tenantId,  email, firstName, lastName, role } = data;

        // Check if the user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user document
        const updatedUser = await User.findByIdAndUpdate(userId, {
            tenantId,
            email,
            firstName,
            lastName,
            role
        }, { new: true, runValidators: true }).lean(); // .lean() to get a plain JS object, runValidators to ensure model validations are applied

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        delete updatedUser.passwordHash; // Exclude the passwordHash from the response
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
});


// Example of PATCH route
router.patch('/api/users/:userId', validateAndFindUser, updateUserValidationRules(), validate, async (req, res) => {
    try {
        const updates = matchedData(req);
        const { userId } = req.params;

        // Find the user by ID and update it
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).lean(); // .lean() to get a plain JS object

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        delete updatedUser.passwordHash; // Exclude passwordHash from the response
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
});


router.delete('/api/users/:userId', validateAndFindUser, async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
});


  // Route to get all users within a specific tenant
  router.get('/api/tenants/:tenantId/users', validateTenantExists, async (req, res) => {
    try {
        const { tenantId } = req.params;
        const tenantUsers = await User.find({ tenantId }).lean();
        res.json(tenantUsers);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
});

  // Route to create a user within a specific tenant
  router.post('/api/tenants/:tenantId/users', [validateTenantExists, userValidationRules(), validate], async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { email, firstName, lastName, password, role, isAdmin } = req.body; // Include isAdmin in the destructuring

        // Check for email uniqueness within the tenant
        const existingUser = await User.findOne({ tenantId, $or: [ { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists within the tenant." });
        }

        const passwordHash = await hashPassword(password);

        // Include isAdmin when creating a new user, utilizing the provided value or defaulting to false if not provided
        const newUser = new User({
            email,
            firstName,
            lastName,
            passwordHash,
            role,
            isAdmin: isAdmin || false,
            tenantId: [tenantId] 
        });

        await newUser.save();
        const responseUser = newUser.toObject();
        delete responseUser.passwordHash; // Remove passwordHash from the response
        res.status(201).json({ message: "User created successfully within tenant", user: responseUser });
    } catch (error) {
        res.status(500).json({ message: "Failed to create user", error: error.message });
    }
});
router.put('/api/tenants/:tenantId/users/:userId', [validateTenantExists, validateAndFindUser, updateUserValidationRules(), validate], async (req, res) => {
    try {
        const updates = matchedData(req, { includeOptionals: false });
        const { userId } = req.params;

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).lean();
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        delete updatedUser.passwordHash;
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
});

router.patch('/api/tenants/:tenantId/users/:userId', [validateTenantExists, validateAndFindUser, updateUserValidationRules(), validate], async (req, res) => {
    const { userId, tenantId } = req.params;

    try {
        // Ensure the user belongs to the tenant
        const user = await User.findOne({ _id: userId, tenantId });
        if (!user) {
            return res.status(404).json({ message: 'User not found within the specified tenant' });
        }

        // Use matchedData to ensure only validated and allowed fields are updated
        const updates = matchedData(req);
        // Hash the password if it's being updated
        if (updates.password) {
            updates.passwordHash = await hashPassword(updates.password);
            delete updates.password; // Remove plain password from the updates object
        }

        // Apply the updates
        Object.keys(updates).forEach(update => user[update] = updates[update]);
        await user.save();

        const updatedUser = user.toObject();
        delete updatedUser.passwordHash; // Exclude passwordHash from the response
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
});


router.delete('/api/tenants/:tenantId/users/:userId', [validateTenantExists, validateAndFindUser], async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
});




export default router;