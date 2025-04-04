const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', (req, res) => {
  console.log("Form data received:", req.body); // <-- helpful log
  res.status(200).send('Form received');
});

app.listen(port, () => {
  console.log(`✅ Form server running at http://localhost:${port}`);
});