
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// --- LOGIN ---

// GET /login - Renders the login form
router.get('/login', (req, res) => {
 res.render('login');
});

// POST /login - Handles the login submission
router.post('/login', async (req, res) => {
 console.log('--- NEW LOGIN ATTEMPT ---');
 console.log('Data received from form (req.body):', req.body);

 try {
  const { username, password } = req.body;

  // --- Step 1: Find the User ---
  console.log(`Searching for user with username: "${username}"`);
  const user = await User.findOne({ username });

  if (!user) {
   // This block runs if no user was found in the database.
   console.log('RESULT: User not found in database.');
   req.flash('error_msg', 'That username is not registered.');
   return res.redirect('/login');
  }

  // If we reach here, a user was found.
  console.log('RESULT: User found in database:', user);


  // --- Step 2: Compare the Passwords ---
  console.log('Now comparing the submitted password with the stored hash...');
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
   // This block runs if the passwords match.
   console.log('RESULT: Passwords match! Login successful.');
   req.session.userId = user._id;
   res.redirect('/');
  } else {
   // This block runs if the passwords do NOT match.
   console.log('RESULT: Passwords do NOT match. Login failed.');
   req.flash('error_msg', 'Password incorrect.');
   return res.redirect('/login');
  }

 } catch (err) {
  // This block runs if a server error occurs.
  console.error('FATAL ERROR IN LOGIN ROUTE:', err);
  req.flash('error_msg', 'An unexpected server error occurred.');
  res.redirect('/login');
 }
});



// --- REGISTRATION ---

// GET /register - Renders the registration form
router.get('/register', (req, res) => {
 res.render('register');
});

// POST /register - Handles the registration submission
router.post('/register', async (req, res) => {
 console.log('--- NEW REGISTRATION ATTEMPT ---');
 console.log('Data received from form (req.body):', req.body);

 try {
  const { username, password } = req.body;

  // --- Step 1: Validation ---
  console.log('Validating input...');
  if (!username || !password || password.length < 6) {
   console.log('RESULT: Validation failed.');
   req.flash('error_msg', 'Please fill in all fields. Password must be at least 6 characters long.');
   return res.redirect('/register');
  }
  console.log('RESULT: Validation passed.');

  // --- Step 2: Check for Existing User ---
  console.log(`Searching for existing user with username: "${username}"`);
  const existingUser = await User.findOne({ username });

  if (existingUser) {
   console.log('RESULT: User already exists.');
   req.flash('error_msg', 'Username is already taken.');
   return res.redirect('/register');
  }
  console.log('RESULT: Username is available.');

  // --- Step 3: Hash Password ---
  console.log('Hashing the password...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('RESULT: Password hashed successfully.');

  // --- Step 4: Create and Save New User ---
  console.log('Creating new user object...');
  const newUser = new User({
   username,
   password: hashedPassword
  });

  console.log('Attempting to save new user to the database...');
  await newUser.save();
  console.log('RESULT: New user saved successfully!');

  // --- Step 5: Redirect to Login ---
  req.flash('success_msg', 'You are now registered and can log in!');
  
  res.redirect('/login');

 } catch (err) {
  // This block runs if any of the "await" steps above fail.
  console.error('FATAL ERROR IN REGISTRATION ROUTE:', err);
  req.flash('error_msg', 'An error occurred during registration.');
  res.redirect('/register');
 }
});



// --- LOGOUT ---

// GET /logout - Handles logout
router.get('/logout', (req, res) => {
 req.session.destroy((err) => {
  if (err) {
   console.error("Session Destruction Error:", err);
   return res.status(500).send("Could not log out.");
  }
  res.clearCookie('connect.sid'); 
  res.redirect('/login');
 });
});

module.exports = router;