import express from 'express';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import Invitation from '../mongoose/schemas/Invitation.mjs';
import User from '../mongoose/schemas/user.mjs';
import Tenant from '../mongoose/schemas/tenant.mjs';
import { validateAndFindTenant } from '../component/utils/middleware.mjs';
import { sendRegistrationEmail, sendRegistrationEmailConfirmation } from '../helpers/sendResetEmail.mjs';
import validator from 'validator';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const router = express.Router();

// List of valid roles
const validRoles = ['Admin', 'ProjectManager', 'Developer', 'User'];


// Invite a user to a tenant
router.post('/api/tenants/:tenantId/invite', validateAndFindTenant, async (req, res) => {
    const { emails, role } = req.body;
    const tenantId = req.tenant._id;

    // Check if emails is an array and every email is valid
    if (!Array.isArray(emails) || !emails.every(email => validator.isEmail(email))) {
        return res.status(400).json({ error: 'Invalid email format in the list.' });
    }

    // Validate the role
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified.' });
    }

    try {
        // Send an invite for each email
        await Promise.all(emails.map(async (email) => {
            const token = uuidv4();
            const registrationUrl = `${process.env.FRONTEND_URL}register?token=${token}&tenantId=${tenantId}`;

            await new Invitation({
                email,
                tenantId,
                role,
                token,
                used: false,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Token expiration (e.g., 24 hours)
            }).save();

              // Retrieve tenant name
                const tenant = await Tenant.findById(tenantId);
                const tenantName = tenant.name;


            // Send registration email with tenantName
            await sendRegistrationEmail(email, registrationUrl, tenantName);
        }));

        res.status(200).json({ message: 'Invitations sent successfully.' });
    } catch (error) {
        console.error("Error sending invitations:", error.message, error.stack);
        return res.status(500).json({ error: 'Failed to send invitations.', details: error.message });
    }
    
});


/// Register a user from an invitation
router.post('/api/register', async (req, res) => {
    const { token, firstName, lastName, password } = req.body;

    try {
        const invitation = await Invitation.findOne({ token, used: false, expiresAt: { $gte: new Date() } });
        if (!invitation) {
            return res.status(400).json({ error: 'Invalid or expired invitation token.' });
        }

           // Extract role from the invitation
        const {  role } = invitation;

        // Check if user already exists
        let user = await User.findOne({ email: invitation.email });

        if (user) {
            // User already exists
            if (user.tenantId.includes(invitation.tenantId)) {
                return res.status(200).json({
                    message: 'You are already a member of this tenant.',
                    user: {
                        id: user._id,
                        email: user.email,
                        tenantId: user.tenantId
                    }
                });
            } else {
                user.tenantId.push(invitation.tenantId);
                await user.save();
                return res.status(200).json({
                    message: 'You have been successfully added to the new tenant.',
                    user: {
                        id: user._id,
                        email: user.email,
                        tenantId: user.tenantId
                    }
                });
            }
        } else {
            // New user, create account
            user = new User({
                email: invitation.email,
                firstName,
                lastName,
                role,
                passwordHash: password, // Plain password here
                tenantId: [invitation.tenantId],
            });
            await user.save();

            invitation.used = true;
            await invitation.save();

            // Send response (excluding sensitive information like passwordHash)
            return res.status(201).json({
                message: 'Registration successful.',
                user: {
                    id: user._id,
                    email: user.email,
                    // other user details to return
                },
            });
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ error: 'Registration failed.' });
    }
});

router.post('/api/validate-invitation', async (req, res) => {
    const { token } = req.body;
    
    try {
        // Find the invitation by token that hasn't been used and hasn't expired
        const invitation = await Invitation.findOne({ token, used: false, expiresAt: { $gte: new Date() } });
        if (!invitation) {
            return res.status(400).json({ message: 'Invalid or expired invitation token.' });
        }
        
        // Check if a user with the invitation email already exists
        const existingUser = await User.findOne({ email: invitation.email }).exec();
        
        // Get the tenant name
        const tenant = await Tenant.findById(invitation.tenantId);
        const tenantName = tenant ? tenant.name : null;
        
        // Respond with relevant details
        res.json({
            email: invitation.email,
            tenantId: invitation.tenantId,
            tenantName: tenantName,
            role: invitation.role,
            isExistingUser: !!existingUser, // Cast to boolean - true if user exists, false otherwise
            message: 'Invitation token is valid.',
            user: existingUser ? {
                id: existingUser._id,
                email: existingUser.email,
                tenantId: existingUser.tenantId,
                tenantName: tenantName
            } : null
        });
    } catch (error) {
        console.error("Error validating invitation:", error);
        res.status(500).json({ message: 'Failed to validate invitation.' });
    }
});

export default router;
