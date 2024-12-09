const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Define the endpoint to get cheapest gas stations within a radius
app.get('/find-cheapest-gas', async (req, res) => {
  try {
    // Get parameters from the query string (latitude, longitude, and radius)
    const { lat, lon, radius } = req.query;

    if (!lat || !lon || !radius) {
      return res.status(400).json({ error: 'Missing required parameters (lat, lon, radius)' });
    }

    // Convert the radius to miles (could also convert to km)
    const radiusInMiles = parseFloat(radius);

    // Prepare API request to gas station provider (replace with the actual API URL)
    const apiUrl = `https://api.fuelapi.com/v1/locations?lat=${lat}&lon=${lon}&radius=${radiusInMiles}&key=${process.env.GAS_API_KEY}`;
    
    // Fetch data from the gas station API
    const response = await axios.get(apiUrl);

    // Check if we received gas station data
    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'No gas stations found in the specified radius.' });
    }

    // Sort the stations by price and send the cheapest one
    const cheapestStation = response.data.sort((a, b) => a.price - b.price)[0];

    res.json({
      message: 'Cheapest gas station found!',
      station: cheapestStation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
