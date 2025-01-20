// task1_html_structure_server.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// HTML form
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Form Submission</title>
      </head>
      <body>
        <h1>User Input Form</h1>
        <form action="/submit" method="POST">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          <br>
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>
          <br>
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);
});

// Form submission endpoint
app.post('/submit', (req, res) => {
  const { name, email } = req.body;
  res.send(`<h2>Thank you, ${name}! Your email (${email}) has been submitted.</h2>`);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
