// functions/api.js

const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../server'); // Your main express app

// This is the variable that will hold our connection
let cachedDb = null;

const connectToDatabase = async () => {
 // If we already have a connection, reuse it
 if (cachedDb) {
  console.log('=> using cached database instance');
  return cachedDb;
 }

 console.log('=> using new database instance');
 const db = await mongoose.connect(process.env.MONGODB_URI);
 cachedDb = db;
 return db;
};

const handler = async (req, res) => {
 await connectToDatabase();
 const expressHandler = serverless(app);
 return expressHandler(req, res);
};

module.exports.handler = handler;