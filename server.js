require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const ejsMate = require('ejs-mate');

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

const app = express();

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI, {
 useNewUrlParser: true,
 useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
 .catch(err => console.log(err));


// --- Middlewares ---

// This middleware parses incoming JSON requests. It's a best practice to include.
app.use(express.json());

// This middleware parses incoming requests with URL-encoded payloads (i.e., from forms).
// This is the CRITICAL line for making your login/registration forms work.
app.use(express.urlencoded({ extended: true }));

// This serves your static files like CSS from the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

// This sets up EJS as your template engine with ejs-mate capabilities.
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// This sets the absolute path for your views directory.
app.set('views', path.join(__dirname, 'views'));

// This sets up your session management.
app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: true
}));

// --- Routes ---
app.use('/', authRoutes);
app.use('/', reportRoutes);

// --- Export for Netlify ---
// This makes your app available for the serverless function handler.
module.exports = app;