const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Serve static files (your app)
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Chubby Unicorn API' });
});

// ForeFlight API proxy - this solves CORS for ALL platforms
app.get('/api/foreflight/*', async (req, res) => {
  try {
    // Import node-fetch dynamically
    const fetch = (await import('node-fetch')).default;
    
    // Build ForeFlight URL
    const apiPath = req.path.replace('/api/foreflight', '');
    const queryString = new URLSearchParams(req.query).toString();
    const foreflightUrl = `https://public-api.foreflight.com/public/api${apiPath}${queryString ? '?' + queryString : ''}`;
    
    console.log('Proxying ForeFlight request:', foreflightUrl);
    
    // Make request to ForeFlight
    const response = await fetch(foreflightUrl, {
      method: 'GET',
      headers: {
        'X-API-Key': process.env.FOREFLIGHT_API_KEY || '6y5QFV4hbIGClVh6PE44ByQUnqHJZ015aYVip8im7Ts=',
        'Accept': 'application/json'
      }
    });
    
    // Get response data
    const data = await response.json();
    
    // Send back to client
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('ForeFlight proxy error:', error);
    res.status(500).json({
      error: 'Failed to fetch from ForeFlight',
      message: error.message
    });
  }
});

// Fallback route - serve the app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🦄 Chubby Unicorn server running on port ${PORT}`);
  console.log(`📱 Ready for all platforms - iOS, Android, Web, Desktop`);
  console.log(`✈️ ForeFlight API proxy active at /api/foreflight/*`);
});