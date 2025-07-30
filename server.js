require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash'); 
const path = require('path');
const ejsMate = require('ejs-mate');

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
 .then(() => console.log('MongoDB is connected successfully.'))
 .catch(err => console.error('MongoDB connection error:', err));



app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // לקריאת מידע מטפסי HTML

app.use(express.static(path.join(__dirname, 'public')));


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: true,
  cookie: {
  maxAge:7 * 24 * 60 * 60 * 1000,
  httpOnly: true, 
  secure: process.env.NODE_ENV === 'production'
  }
}));

app.use(flash());

app.use((req, res, next) => {
 res.locals.success_msg = req.flash('success_msg');
 res.locals.error_msg = req.flash('error_msg');
 res.locals.error = req.flash('error'); // For general errors
 next();
});



app.use('/', authRoutes);
app.use('/', reportRoutes);

if (!process.env.NETLIFY_FUNCTIONS_API) {
 const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
  console.log(`Server is running for local development on http://localhost:${PORT}`);
 });
}

module.exports = app;
