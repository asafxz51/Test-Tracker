const serverless = require('serverless-http');
const app = require('../server'); // Adjust path if your main app file is named differently

// We are exporting the express app wrapped in the serverless package.
module.exports.handler = serverless(app); 
