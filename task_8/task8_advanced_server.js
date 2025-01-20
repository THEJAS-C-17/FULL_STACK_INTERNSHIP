// task8_advanced_server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('public'));

// Serve static HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fetch random jokes using an external API
app.get('/api/jokes', async (req, res) => {
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/jokes/random');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jokes from external API.' });
  }
});

// Save jokes to a file
app.post('/api/save-joke', (req, res) => {
  const joke = req.body.joke;

  if (!joke) {
    return res.status(400).json({ error: 'No joke provided to save.' });
  }

  fs.appendFile('jokes.txt', `${joke}\n`, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save joke to file.' });
    }
    res.json({ message: 'Joke saved successfully!' });
  });
});

// Read saved jokes from file
app.get('/api/read-jokes', (req, res) => {
  fs.readFile('jokes.txt', 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read jokes from file.' });
    }
    res.json({ jokes: data.split('\n').filter(Boolean) });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
