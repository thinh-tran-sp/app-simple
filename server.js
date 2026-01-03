const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Hello World endpoint
app.post('/api/hello', (req, res) => {
    const { name } = req.body || {};
    
    const message = name 
        ? `Hello, ${name}! 👋 Welcome to GPT App Store!`
        : 'Hello World! 👋 Welcome to GPT App Store!';
    
    res.json({
        message: message,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Health check endpoint (required for deployment)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        service: 'Hello World GPT App',
        timestamp: new Date().toISOString()
    });
});

// Serve static files from public directory (after API routes)
app.use(express.static('public'));

// Root endpoint - serve HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Hello World GPT App API',
        endpoints: {
            hello: 'POST /api/hello',
            health: 'GET /health'
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Web interface: http://localhost:${PORT}/`);
});

