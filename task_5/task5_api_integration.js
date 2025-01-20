// task5_api_integration.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory data storage
let users = [];

// API Endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (name && email) {
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).json({ error: 'Name and email are required!' });
  }
});

// Serve front-end HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>API Integration</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <h1>User Management</h1>
        <form id="userForm">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          <br>
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
          <br>
          <button type="submit">Add User</button>
        </form>

        <h2>Users</h2>
        <ul id="userList"></ul>

        <script>
          const form = document.getElementById('userForm');
          const userList = document.getElementById('userList');

          // Fetch and display users
          async function fetchUsers() {
            const response = await fetch('/api/users');
            const users = await response.json();
            userList.innerHTML = '';
            users.forEach(user => {
              const li = document.createElement('li');
              li.textContent = \`\${user.name} (\${user.email})\`;
              userList.appendChild(li);
            });
          }

          // Add new user
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            const response = await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, email }),
            });

            if (response.ok) {
              form.reset();
              fetchUsers();
            } else {
              alert('Failed to add user. Please try again.');
            }
          });

          // Initial fetch
          fetchUsers();
        </script>
      </body>
    </html>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
