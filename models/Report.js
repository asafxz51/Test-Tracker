const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
 title: { type: String, required: true },
 description: { type: String, required: true },
 author: { type: Schema.Types.ObjectId, ref: 'User' },
 status: { type: String, default: 'Not Executed' },
 priority: { type: String, default: 'Medium' },
 type: { type: String, default: 'Functional' },
 preconditions: String,
 expected: String,
 actual: String,
 steps: [String],

 creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);