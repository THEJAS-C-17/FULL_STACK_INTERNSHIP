// task4_complex_form_validation.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));

// Serve HTML with dynamic form and validation
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Complex Form Validation</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <h1>Enhanced Form with Dynamic Validation</h1>
        <form id="dynamicForm">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required>
          <span id="usernameError" class="error"></span>
          <br>

          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>
          <span id="passwordError" class="error"></span>
          <br>

          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
          <span id="emailError" class="error"></span>
          <br>

          <button type="submit">Submit</button>
        </form>

        <script>
          document.getElementById('dynamicForm').addEventListener('submit', function (e) {
            e.preventDefault();
            let valid = true;

            // Username validation
            const username = document.getElementById('username').value;
            if (username.length < 5) {
              document.getElementById('usernameError').textContent = "Username must be at least 5 characters.";
              valid = false;
            } else {
              document.getElementById('usernameError').textContent = "";
            }

            // Password validation
            const password = document.getElementById('password').value;
            const strongPassword = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;
            if (!strongPassword.test(password) || password.length < 8) {
              document.getElementById('passwordError').textContent = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
              valid = false;
            } else {
              document.getElementById('passwordError').textContent = "";
            }

            // Email validation
            const email = document.getElementById('email').value;
            if (!email.includes('@')) {
              document.getElementById('emailError').textContent = "Invalid email address.";
              valid = false;
            } else {
              document.getElementById('emailError').textContent = "";
            }

            if (valid) {
              alert('Form submitted successfully!');
            }
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
