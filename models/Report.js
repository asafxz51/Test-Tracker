const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
 title: { type: String, required: true },
 description: { type: String, required: true },
 preconditions: { type: String, required: true },
 expected: { type: String, required: true },
 actual: { type: String, required: true },
 status: { type: String, enum: ['Not Executed', 'In Progress', 'Passed', 'Failed', 'Blocked', 'Skipped', 'Retest'], default: 'Not Executed' },
 priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
 type: { type: String, enum: ['Functional', 'Regression', 'Smoke', 'UI', 'API'], default: 'Functional' },
 author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);