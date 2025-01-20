// task3_advanced_css_responsive.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));

// Serve HTML with advanced CSS
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Responsive Design</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <header>
          <h1>Welcome to Advanced CSS Styling</h1>
        </header>
        <main>
          <section>
            <h2>Responsive Section</h2>
            <p>This section adjusts based on the screen size.</p>
          </section>
          <section>
            <h2>Animations and Transitions</h2>
            <button id="animateBtn">Hover Me</button>
          </section>
        </main>
        <footer>
          <p>Footer Content</p>
        </footer>
      </body>
    </html>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
