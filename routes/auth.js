const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => {
 res.render('login');
});

// Login Handle
router.post('/login', async (req, res) => {
 const { username, password } = req.body;
 const user = await User.findOne({ username, password });
 if (user) {
  req.session.userId = user._id;
  res.redirect('/');
 } else {
  res.redirect('/login');
 }
});

// Logout Handle
router.get('/logout', (req, res) => {
 req.session.destroy(() => {
  res.redirect('/login');
 });
});

// Register Page
router.get('/register', (req, res) => {
 const error = req.session.error;
 req.session.error = null;
 res.render('register', { error });
});

// Register Handle
router.post('/register', async (req, res) => {
 const { username, password } = req.body;

 // Basic validation
 if (!username || !password) {
  req.session.error = 'Please provide both a username and password.';
  return res.redirect('/register');
 }

 try {
  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
   req.session.error = 'Username is already taken.';
   return res.redirect('/register');
  }

  // In a real app, you should hash the password here using bcrypt
  // const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
   username,
   password // Replace with hashedPassword in a real app
  });

  await newUser.save();

  // Set a success message and redirect to login
  req.session.success = 'Registration successful! Please log in.';
  res.redirect('/login');

 } catch (err) {
  req.session.error = 'An error occurred during registration.';
  res.redirect('/register');
 }
});

// Logout Handle
router.get('/logout', (req, res) => {
 req.session.destroy((err) => {
  if (err) {
   return res.redirect('/dashboard');
  }
  res.clearCookie('connect.sid'); 
  res.redirect('/login');
 });
});


module.exports = router;