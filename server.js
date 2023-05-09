const express = require('express');
const openai = require('openai');
const path = require('path');

// Replace with your OpenAI API key
const OPENAI_API_KEY = 'your-openai-api-key';
openai.apiKey = OPENAI_API_KEY;

const app = express();

// Middleware to set the "Content-Type" header for JavaScript modules
app.use((req, res, next) => {
  if (req.originalUrl.endsWith('.js') && req.path.includes('/')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
