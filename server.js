// This line should be at the very top to load your environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const ejsMate = require('ejs-mate');

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

const app = express();

//database
mongoose.connect(process.env.MONGODB_URI, {
 useNewUrlParser: true,
 useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
 .catch(err => console.log(err));


 //middlewares
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: true
}));

//routes
app.use('/', authRoutes);
app.use('/', reportRoutes);

module.exports = app;