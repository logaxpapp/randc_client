import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import createTransporter from '../helpers/nodeMail.mjs'; 
import passport from 'passport';
import User from '../mongoose/schemas/user.mjs'; 
import Tenant from '../mongoose/schemas/tenant.mjs';
import { sendResetEmail, sendConfirmationEmail } from '../helpers/sendResetEmail.mjs';


const router = express.Router();
router.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ message: info ? info.message : 'Login failed' });
        }

        // Verify tenant ID if necessary
        const tenantId = req.body.tenantId;
        if (tenantId && !user.tenantId.includes(tenantId)) { // Change .equals to .includes
            return res.status(403).json({ message: 'Access denied for this tenant.' });
        }
        

        // Generate JWT access and refresh tokens
        const accessTokenPayload = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            tenantId: tenantId,
            iat: Math.floor(Date.now() / 1000) - 30, // 30 seconds before current time
            firstName: user.firstName,
            lastName: user.lastName,
           

        };
        const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        const refreshTokenPayload = { id: user._id.toString() };
        const refreshToken = jwt.sign(refreshTokenPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Save the refresh token in the user's document
        user.refreshTokens.push({ token: refreshToken, issuedAt: new Date() });
        await user.save();

        // Send back the tokens and user info (excluding sensitive data like password)
        res.json({
            message: 'Logged in successfully',
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                tenantId: tenantId,
                firstName: user.firstName,
                lastName: user.lastName,
               
            },
            accessToken,
            refreshToken
        });
    })(req, res, next);
});

router.post('/refresh_token', async (req, res) => {
    const { refreshToken, tenantId } = req.body; // Expect tenantId to be sent along with the refreshToken
    if (!refreshToken) return res.status(401).json({ message: "Refresh token is required" });
    if (!tenantId) return res.status(400).json({ message: "Tenant ID is required" });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        // Find a user with the given refresh token and check if the tenantId is in their tenantIds array
        // Assuming `tenantId` is already provided in the request and `refreshToken` is valid
            const user = await User.findOne({
                "refreshTokens.token": refreshToken,
                _id: decoded.id,
                tenantId: tenantId  
            });
  
        
        if (!user) return res.status(403).json({ message: "Access forbidden or user not found for this tenant" });

        // Generate a new access token with the tenantId included in the payload
        const newAccessToken = jwt.sign({ id: user._id, tenantId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        // Error handling remains the same
        if (error instanceof jwt.TokenExpiredError) {
            res.status(403).json({ message: "Refresh token expired" });
        } else if (error instanceof jwt.JsonWebTokenError) {
            res.status(403).json({ message: "Refresh token invalid" });
        } else {
            console.error('Error during token refresh:', error);
            res.status(500).json({ message: "Internal server error during token refresh" });
        }
    }
});


router.post('/verifyEmail', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check the tenantId array for multiple tenant associations
        if (user.tenantId && user.tenantId.length > 1) {
            // Fetch tenant details for the response
            const tenants = await Tenant.find({ '_id': { $in: user.tenantId } })
                                        .select('name domain').exec();
            return res.status(200).json({
                message: 'Multiple tenants found. Please select a tenant.',
                tenants: tenants.map(tenant => ({
                    id: tenant._id.toString(),
                    name: tenant.name,
                    domain: tenant.domain
                }))
            });
        } else if (user.tenantId.length === 1) {
            // Single tenant association, proceed directly
            return res.status(200).json({
                message: 'Email verified successfully',
                tenantId: user.tenantId[0].toString() 
            });
        } else {
            // No tenants associated, handle accordingly
            return res.status(404).json({ message: 'No tenants found for this user.' });
        }
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Server error during email verification' });
    }
});


// Logout Route
router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "No refresh token provided" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove the refresh token from the user's array of tokens
        user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken);
        await user.save();

        res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: "Error during logout", error: error.message });
    }
});


// Password Reset Route
router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.passwordHash = hashedPassword;
        await user.save();

        // Create email transporter and send confirmation email
        const transporter = await createTransporter();
        const resetUrl = `http://<your-frontend-domain>/reset-password/${token}`;
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Password Reset Request",
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                    `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
                    `${resetUrl}\n\n` +
                    `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            };
            // Send the email with transporter.sendMail...

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Send mail error:', error);
                return res.status(500).json({ message: 'Error sending email', error: error.message });
            } else {
                console.log('Email sent: ' + info.response);
                // Confirm password reset to the user
                res.status(200).json({ message: 'Password reset successfully. Email sent.' });
            }
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
});
// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found.');
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();
        const resetUrl = `http://${req.headers.host}/api/auth/reset-password/${token}`;
        await sendResetEmail(email, resetUrl);
        res.send('A reset email has been sent to ' + email + '.');
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).send('Error on forgot password.');
    }
});

// Reset Password Token Validation Route
router.get('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        
        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }
        res.send('Token is valid.');
    } catch (error) {
        console.error('Reset token validation error:', error);
        res.status(500).send('Error validating reset token.');
    }
});

// Reset Password Route
router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }
        user.passwordHash = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        await sendConfirmationEmail(user.email);
        res.send('Your password has been updated.');
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).send('Error resetting password.');
    }
});
  
  

// Authentication Status Route
router.get('/api/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ isAuthenticated: true, user: req.user });
    } else {
        res.status(200).json({ isAuthenticated: false });
    }
});

export default router;
