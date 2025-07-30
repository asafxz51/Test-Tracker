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

 // If not, create a new connection
 console.log('=> using new database instance');
 const db = await mongoose.connect(process.env.MONGODB_URI);
 cachedDb = db;
 return db;
};

// This is our main handler function
const handler = async (req, res) => {
 // Ensure we have a database connection before handling the request
 await connectToDatabase();
 // This uses the serverless-http wrapper to run your Express app
 const expressHandler = serverless(app);
 return expressHandler(req, res);
};

module.exports.handler = handler;