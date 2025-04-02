const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files (CSS, JS, images) from the 'assets' folder
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve all HTML files dynamically from 'public'
app.use(express.static('public'));

// Serve main category pages (e.g., /articles/blog -> /articles/blog/index.html)
app.get('/articles/:category', (req, res) => {
  const filePath = path.join(__dirname, `public/articles/${req.params.category}/index.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('404 - Not Found');
    }
  });
});

// Serve sub-pages (e.g., /articles/blog/blog-1 -> /articles/blog/blog-1.html)
app.get('/articles/:category/:article', (req, res) => {
  const filePath = path.join(__dirname, `public/articles/${req.params.category}/${req.params.article}.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('404 - Not Found');
    }
  });
});

// Catch-all route for any other HTML file inside 'public'
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'public', req.path + '.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('404 - Not Found');
    }
  });
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});