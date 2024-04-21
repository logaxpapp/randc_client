import express from 'express';
import passport from 'passport';
import '../strategies/google-strategy.mjs'; // Ensure your Google strategy is configured

const router = express.Router();

// Route to initiate Google OAuth
router.get('/google/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route for Google to redirect to
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect to profile page or wherever appropriate
    res.redirect('http://localhost:3000/dashboard');
});

// Logout route
router.get('/google/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // Ensure you clear the session cookie
            res.redirect('/'); // Redirect to home page or login
        });
    });
});

// Route to handle password reset
// Note: This might not be applicable for OAuth users, but you can provide a method to link/unlink accounts
router.post('/reset-password', async (req, res) => {
    // Logic to handle account linking/unlinking or instructing users on password reset through Google
    res.status(501).json({ message: "Password reset not applicable for Google OAuth users." });
});


router.get('/google/profile', (req, res) => {
    if (req.isAuthenticated()) {
        // Assuming the user information is stored in req.user when authenticated
        // Here, you can render a profile page or return the user's information as JSON
        res.json({
            success: true,
            message: 'User profile',
            user: req.user // Or any specific user information you wish to return
        });
    } else {
        // If the user is not authenticated, redirect them to the login page or return an error
        res.status(401).json({
            success: false,
            message: 'Unauthorized access. Please log in.'
        });
    }
});


export default router;
