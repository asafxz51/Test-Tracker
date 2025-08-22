// functions/api.js

const serverless = require('serverless-http');
const mongoose = require('mongoose');
const app = require('../server'); // Your main Express app

// Wrap the app in the serverless handler ONCE, outside of the main handler.
const handlerApp = serverless(app);

// This variable will hold our persistent database connection.
let cachedDb = null;

const connectToDatabase = async () => {
 // If we have a cached connection, reuse it.
 if (cachedDb) {
  return cachedDb;
 }
 // Otherwise, create a new one.
 console.log('=> Creating new database connection');
 const db = await mongoose.connect(process.env.MONGODB_URI);
 cachedDb = db;
 return db;
};

// This is the main function that Netlify will run.
module.exports.handler = async (event, context) => {
 // This line allows subsequent requests to reuse the same container.
 context.callbackWaitsForEmptyEventLoop = false;

 // Ensure we have a database connection before proceeding.
 await connectToDatabase();

 // Now, pass the request to our wrapped Express app.
 return await handlerApp(event, context);
};