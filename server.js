// This line should be at the very top to load your environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const ejsMate = require('ejs-mate');

// Import your routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

// Initialize the app
const app = express();

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI, {
 useNewUrlParser: true,
 useUnifiedTopology: true
}).then(() => console.log('MongoDB is connected successfully.'))
 .catch(err => console.error('MongoDB connection error:', err));


// --- Core Middlewares ---

// This middleware is ESSENTIAL for parsing JSON data from requests.
app.use(express.json());

// This middleware is ESSENTIAL for parsing data from HTML forms.
// It populates the `req.body` object. This is the key to your problem.
app.use(express.urlencoded({ extended: true }));

// This middleware serves your static files (CSS, images) from the 'public' folder.
app.use(express.static(path.join(__dirname, 'public')));


// --- View Engine Setup ---
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// --- Session Setup ---
// This must come AFTER the parsers and BEFORE the routes.
app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: true,
 cookie: { secure: false } // Set to `true` if you had HTTPS, but `false` is fine for now.
}));


// --- Routes ---
// Your app will now use the logic defined in your route files.
app.use('/', authRoutes);
app.use('/', reportRoutes);


// --- Export for Netlify ---
// This makes your configured app available for the serverless function handler.
module.exports = app;