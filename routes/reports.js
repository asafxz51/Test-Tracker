const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
 if (req.session.userId) {
  return next();
 }
 res.redirect('/login');
};

// Dashboard - Display reports for the logged-in user only
router.get('/', isAuthenticated, async (req, res) => {
 try {
  const query = { author: req.session.userId };

  const status = req.query.status || '';
  const priority = req.query.priority || '';
  const type = req.query.type || '';
  const search = req.query.search || '';

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (type) query.type = type;

  if (search) {
   query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
   ];
  }

  const reports = await Report.find(query).sort({ creationDate: -1 });
  res.render('dashboard', { reports, status, priority, type, search });
 } catch (err) {
  console.error(err);
  res.status(500).send(err);
 }
});

// Add Report Page
router.get('/add', isAuthenticated, (req, res) => {
 res.render('add-report');
});

// Add Report Handle - Now includes the author
router.post('/add', isAuthenticated, async (req, res) => {
 const { title, description, status, priority, preconditions, expected, actual, type } = req.body;

 const newReport = new Report({
  title,
  description,
  status,
  priority,
  preconditions,
  expected,
  actual,
  type,
  author: req.session.userId,
 });

 try {
  await newReport.save();
  res.redirect('/');
 } catch (err) {
  console.error(err);
  res.status(500).send('Error saving report');
 }
});


// Edit Report Page - Ensure user owns the report
router.get('/edit/:id', isAuthenticated, async (req, res) => {
 try {
  const report = await Report.findOne({
   _id: req.params.id,
   author: req.session.userId 
  });

  if (!report) {
   return res.redirect('/');
  }
  res.render('edit-report', { report });
 } catch (err) {
  res.status(500).send(err);
 }
});

// Edit Report Handle - Ensure user owns the report
router.post('/edit/:id', isAuthenticated, async (req, res) => {
 const { title, description, status, priority, preconditions, expected, actual, type } = req.body;

 try {
  await Report.findOneAndUpdate(
   { _id: req.params.id, author: req.session.userId },
   { title, description, status, priority, preconditions, expected, actual, type }
  );
  res.redirect('/');
 } catch (err) {
  console.error(err);
  res.status(500).send('Error updating report');
 }
});

// Delete Report Handle - Ensure user owns the report
router.post('/delete/:id', isAuthenticated, async (req, res) => {
 try {
  await Report.findOneAndDelete({
   _id: req.params.id,
   author: req.session.userId
  });
  res.redirect('/');
 } catch (err) {
  res.status(500).send(err);
 }
});

// View a Single Report - Ensure user owns the report
router.get('/report/:id', isAuthenticated, async (req, res) => {
 try {
  const report = await Report.findOne({
   _id: req.params.id,
   author: req.session.userId 
  });

  if (!report) {
   return res.status(404).redirect('/'); 
  }
  res.render('report-details', { report });
 } catch (err) {
  res.status(500).send(err);
 }
});

module.exports = router;