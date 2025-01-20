// task7_external_api_integration.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));

// Fetch data from external API (e.g., OpenWeatherMap API)
const apiKey = 'your_openweathermap_api_key'; // Replace with your actual API key
const apiBaseUrl = 'https://api.openweathermap.org/data/2.5/weather';

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City is required!' });
  }

  try {
    const response = await axios.get(`${apiBaseUrl}?q=${city}&appid=${apiKey}&units=metric`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

// Serve HTML for API interaction
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Weather API Integration</title>
        <link rel="stylesheet" href="styles.css">
      </head>
      <body>
        <h1>Weather Information</h1>
        <form id="weatherForm">
          <label for="city">Enter City:</label>
          <input type="text" id="city" required>
          <button type="submit">Get Weather</button>
        </form>
        <h2 id="weatherResult"></h2>

        <script>
          const weatherForm = document.getElementById('weatherForm');
          const weatherResult = document.getElementById('weatherResult');

          weatherForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const city = document.getElementById('city').value;

            try {
              const response = await fetch(\`/api/weather?city=\${city}\`);
              const data = await response.json();

              if (data.error) {
                weatherResult.textContent = data.error;
              } else {
                weatherResult.textContent = \`Weather in \${data.name}: \${data.main.temp}°C, \${data.weather[0].description}\`;
              }
            } catch (error) {
              weatherResult.textContent = 'Failed to fetch weather data.';
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
