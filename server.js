const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const ejsMate = require('ejs-mate')

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/bugtracker', {
 useNewUrlParser: true,
 useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
 .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.use(session({
 secret: 'secret-key',
 resave: false,
 saveUninitialized: true
}));

// Routes
app.use('/', authRoutes);
app.use('/', reportRoutes);

// Start Server
app.listen(PORT, () => {
 console.log(`Server is running on http://localhost:${PORT}`);
});