
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));


// --- View Engine Setup ---
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// --- Session Setup ---
app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: true
}));


// --- Routes ---
app.use('/', authRoutes);
app.use('/', reportRoutes);


// --- Export for Netlify ---
module.exports = app;