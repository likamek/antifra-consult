// --- Full Updated server.js ---
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); // For parsing form data
const session = require('express-session');
const helmet = require('helmet');
const fs = require('fs'); // For file operations
const { body, validationResult } = require('express-validator');
const morgan = require('morgan');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;
const todoFilePath = path.join(__dirname, 'todolist.json'); // Path to the JSON file

// Trust Nginx as a reverse proxy
app.set('trust proxy', 1);

// Secure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallbackSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true, // Set to true for HTTPS
      httpOnly: true, // Prevent client-side JS access
      sameSite: 'strict', // CSRF protection
      maxAge: 5 * 60 * 1000, // 5 minutes in milliseconds
    },
  })
);

// Predefined admin users with names and passwords
const users = {
  Lika: { name: 'Lika', password: process.env.LIKA_PASSWORD },
  Ilia: { name: 'Ilia', password: process.env.ILIA_PASSWORD },
};

// Custom security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (process.env.DEV_MODE === 'true') {
    return next(); // Bypass authentication in dev mode
  }

  if (req.session.isAuthenticated) {
    return next();
  }

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.redirect('/admin');
};

// Serve static files (CSS, JS, images, etc.)
app.use(
  express.static(path.join(__dirname, 'public'), {
    maxAge: '1d', // Cache static files for 1 day
  })
);
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Helper functions to read/write todo list JSON
const readTodoLists = () => {
  try {
    console.log(`Reading from: ${todoFilePath}`);
    const data = fs.readFileSync(todoFilePath, 'utf8');
    console.log('File data:', data);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading todolist.json:', err);
    return { frontEnd: [], backEnd: [] };
  }
};

const writeTodoLists = (data) => {
  try {
    fs.writeFileSync(todoFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to todolist.json:', err);
  }
};

// Routes for public files
app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});

app.get('/terms-of-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms-of-service.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin page
app.get('/admin', (req, res) => {
  const filePath = path.join(__dirname, 'view', 'admin.html');
  console.log(`Serving /admin from: ${filePath}`);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving /admin: ${err}`);
      res.status(500).send('An error occurred while loading the Admin page.');
    }
  });
});


// Cookies page
app.get('/cookies', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'cookies.html'), (err) => {
    if (err) {
      console.error(`Error serving /cookies: ${err}`);
      res.status(500).send('An error occurred while loading the Cookies page.');
    }
  });
});

// Admin login POST handler
app.post('/admin', (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username].password === password) {
    req.session.isAuthenticated = true; // Set session as authenticated
    req.session.username = username; // Save username in session
    req.session.name = users[username].name; // Save the admin's name in the session
    return res.redirect('/cookies');
  }

  res.status(401).send('Unauthorized: Incorrect username or password.');
});

// API endpoint for fetching admin name
app.get('/api/admin-name', isAuthenticated, (req, res) => {
  const adminName = req.session.name;
  res.json({ adminName });
});

// API to fetch to-do lists
app.get('/api/todo-lists', isAuthenticated, (req, res) => {
  const todoLists = readTodoLists();
  res.json(todoLists);
});

// API to update to-do lists
app.post('/api/update-todo', isAuthenticated, (req, res) => {
  const { listName, items } = req.body;
  const todoLists = readTodoLists();

  if (!todoLists[listName]) {
    return res.status(400).json({ error: 'Invalid list name.' });
  }

  // Update the list
  todoLists[listName] = items;

  // Save to file
  writeTodoLists(todoLists);

  res.json({ success: true, updatedList: todoLists[listName] });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('An error occurred while logging out.');
    }
    res.redirect('/admin'); // Redirect to login page after logout
  });
});

// Form submission route
app.post(
  '/submit-form',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid phone number'),
    body('amount')
      .isIn(['5k-10k', '10k-15k', '15k-20k', '20k+'])
      .withMessage('Invalid amount selected'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, phone, amount, message } = req.body;

    console.log('Form Submitted:', { firstName, lastName, email, phone, amount, message });

    res.status(200).json({ message: 'Form submitted successfully! Thank you for your submission.' });
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
