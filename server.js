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

// MCP Server endpoint
app.post('/mcp', (req, res) => {
    const { method, params, id } = req.body;
    
    if (method === 'initialize') {
        res.json({
            jsonrpc: '2.0',
            id: id || null,
            result: {
                protocolVersion: '2024-11-05',
                capabilities: {
                    tools: {}
                },
                serverInfo: {
                    name: 'hello-world-gpt-app',
                    version: '1.0.0'
                }
            }
        });
    } else if (method === 'tools/list') {
        res.json({
            jsonrpc: '2.0',
            id: id || null,
            result: {
                tools: [
                    {
                        name: 'sayHello',
                        description: 'Say hello world with optional name',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    description: 'Optional name to personalize the greeting'
                                }
                            }
                        }
                    }
                ]
            }
        });
    } else if (method === 'tools/call') {
        const { name, arguments: args } = params || {};
        
        if (name === 'sayHello') {
            const message = args?.name 
                ? `Hello, ${args.name}! 👋 Welcome to GPT App Store!`
                : 'Hello World! 👋 Welcome to GPT App Store!';
            
            res.json({
                jsonrpc: '2.0',
                id: id || null,
                result: {
                    content: [
                        {
                            type: 'text',
                            text: message
                        }
                    ]
                }
            });
        } else {
            res.json({
                jsonrpc: '2.0',
                id: id || null,
                error: {
                    code: -32601,
                    message: 'Method not found'
                }
            });
        }
    } else {
        res.json({
            jsonrpc: '2.0',
            id: id || null,
            error: {
                code: -32601,
                message: `Method not found: ${method}`
            }
        });
    }
});

// Serve static files from public directory (after API routes)
app.use(express.static('public'));

// Root endpoint - serve HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Privacy Policy endpoint
app.get('/privacy.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

// OpenAI domain verification endpoint
app.get('/.well-known/openai-apps-challenge', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', '.well-known', 'openai-apps-challenge'));
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

