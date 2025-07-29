require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const ejsMate = require('ejs-mate');

// ייבוא קבצי ה-routes
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

// אתחול האפליקציה
const app = express();

// --- חיבור לבסיס הנתונים ---
mongoose.connect(process.env.MONGODB_URI, {
 useNewUrlParser: true,
 useUnifiedTopology: true
}).then(() => console.log('MongoDB is connected successfully.'))
 .catch(err => console.error('MongoDB connection error:', err));


// --- הגדרת Middlewares (החלק הקריטי) ---

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // לקריאת מידע מטפסי HTML

// הגדרת התיקייה הציבורית (לקבצי CSS, תמונות וכו')
app.use(express.static(path.join(__dirname, 'public')));


// --- הגדרת מנוע התבניות (View Engine) ---
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// --- הגדרת סשן (Session) ---
// חייב להופיע אחרי ה-middlewares של קריאת המידע ולפני ה-routes
app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: true
}));


// --- הגדרת ה-Routes ---
app.use('/', authRoutes);
app.use('/', reportRoutes);


// --- ייצוא האפליקציה עבור Netlify ---
module.exports = app;
