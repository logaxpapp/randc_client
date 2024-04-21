
app.get('/', (req, res) => {
    console.log(req.session); // Log the session object
    console.log(req.session.id); // Log the session ID
    console.log(req.cookies); // Log the parsed cookies
  

    if (req.session.visited) {
        console.log("Welcome back!");
    } else {
        console.log("First time visit!");
        req.session.visited = true; // Set session variable
    }
    
    // Set a simple cookie as an example
    res.cookie('hello', 'world', {maxAge: 3000 * 60 * 60 * 24, httpOnly: true});
    
    res.send('Welcome to the Express.js API!');
});


app.get('/api/products/', (req, res) => {
    console.log(req.cookies); // Now you can directly access parsed cookies
    if (req.cookies.hello === 'world') {
        console.log('The cookie was set');
        console.log(req.cookies); // This will show the signed cookies
        // Only return this response if the condition is met
        return res.send([{ id: 1, name: 'product 1' }, { id: 2, name: 'product 2' }]);
    } else {
        // This gets executed if the condition above is not met
        return res.send({ msg: 'Cookie not set' });
    }
});

app.post('/api/auth/', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        // Correctly assign the user's ID to the session
        req.session.userId = user.id;
        // Optionally, you might want to exclude sensitive information from the response
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    } else {
        return res.status(401).send({ message: 'Unauthorized' });
    }
});

app.get('/api/auth/status', (req, res) => {
    // Check if the user is logged in
    if (req.session.userId) {
        // Return the user's ID
        return res.status(200).json({ userId: req.session.userId });
    } else {
        // Return an empty object if the user is not logged in
        return res.status(401).send({msg: 'Not logged in'});
    }
});

app.post('/api/carts/', (req, res) => { // Fixed the route path
    if (req.session.userId) {
        const item = req.body; // Simplified item extraction

        // Initialize the cart if it doesn't exist
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Add the new item to the cart
        req.session.cart.push(item);

        // Optionally, save the session immediately (useful if using certain session stores)
        req.session.save((err) => {
            if (err) {
                // Handle error
                console.error('Session save error:', err);
                return res.status(500).send({ msg: 'Failed to update cart' });
            }
            return res.status(201).json({ msg: 'Product added to cart', cart: req.session.cart });
        });
    } else {
        return res.status(401).send({ msg: 'Not logged in' });
    }
});


app.get('/api/carts/', (req, res) => {
    if (req.session.userId) {
        return res.status(200).json({ cart: req.session.cart });
    } else {
        return res.status(401).send({ msg: 'Not logged in' });
    }
});




// Authentication route using Passport's local strategy
app.post('/api/auth', passport.authenticate('local'), (req, res) => {
    // Successfully authenticated
    try {
        res.status(200).json(req.user); // Send back user information
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
    try {
        if (req.isAuthenticated()) {
            res.status(200).json(req.user); // User is authenticated, send back user information
        } else {
            res.status(401).json({ message: 'Not authenticated' }); // User is not authenticated
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout route with session destruction
app.post('/api/auth/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return res.status(500).json({ message: 'Error logging out' }); }
        req.session.destroy(() => { // Ensure the session is destroyed
            res.clearCookie('connect.sid'); // Clear the session cookie
            res.status(200).json({ message: 'Logout successful' });
        });
    });
});



