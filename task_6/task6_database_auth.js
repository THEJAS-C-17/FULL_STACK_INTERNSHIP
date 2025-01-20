// task6_database_auth.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const secretKey = 'mysecretkey'; // Replace with a secure key

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/userAuth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists!' });
  }
});

// Authenticate user
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid username or password!' });
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
    res.json({ message: 'Login successful!', token });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error!' });
  }
});

// Serve HTML for authentication
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>User Authentication</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <h1>User Authentication</h1>
        <form id="registerForm">
          <h2>Register</h2>
          <label for="registerUsername">Username:</label>
          <input type="text" id="registerUsername" required>
          <br>
          <label for="registerPassword">Password:</label>
          <input type="password" id="registerPassword" required>
          <br>
          <button type="submit">Register</button>
        </form>

        <form id="loginForm">
          <h2>Login</h2>
          <label for="loginUsername">Username:</label>
          <input type="text" id="loginUsername" required>
          <br>
          <label for="loginPassword">Password:</label>
          <input type="password" id="loginPassword" required>
          <br>
          <button type="submit">Login</button>
        </form>

        <script>
          const registerForm = document.getElementById('registerForm');
          const loginForm = document.getElementById('loginForm');

          registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;

            const response = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            alert(data.message || data.error);
          });

          loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            alert(data.message || data.error);
          });
        </script>
      </body>
    </html>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
