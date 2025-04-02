const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Handle form submissions
app.post('/submit-form', (req, res) => {
  // No processing or saving — just respond OK
  res.status(200).send('Form received');
});

// Start server
app.listen(port, () => {
  console.log(`✅ Form server running at http://localhost:${port}`);
});