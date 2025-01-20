// task2_inline_styles_validation.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Inline-styled HTML with basic interaction
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Form Validation</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          form { margin-top: 20px; }
          input { margin-bottom: 10px; padding: 5px; }
          .error { color: red; font-size: 14px; }
        </style>
      </head>
      <body>
        <h1>Enhanced Form</h1>
        <form id="userForm" action="/submit" method="POST">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          <span id="nameError" class="error"></span>
          <br>
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
          <span id="emailError" class="error"></span>
          <br>
          <button type="submit">Submit</button>
        </form>
        <script>
          document.getElementById('userForm').addEventListener('submit', function(e) {
            let valid = true;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            if (name.length < 3) {
              document.getElementById('nameError').textContent = "Name must be at least 3 characters.";
              valid = false;
            } else {
              document.getElementById('nameError').textContent = "";
            }

            if (!email.includes('@')) {
              document.getElementById('emailError').textContent = "Invalid email format.";
              valid = false;
            } else {
              document.getElementById('emailError').textContent = "";
            }

            if (!valid) e.preventDefault();
          });
        </script>
      </body>
    </html>
  `);
});

// Server-side validation
app.post('/submit', (req, res) => {
  const { name, email } = req.body;

  if (name.length < 3 || !email.includes('@')) {
    res.status(400).send('<h2>Invalid input! Please check your data and try again.</h2>');
  } else {
    res.send(`<h2>Thank you, ${name}! Your email (${email}) has been validated and submitted.</h2>`);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
