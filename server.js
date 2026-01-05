const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
    if (req.path === '/mcp' || req.path === '/') {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
            headers: req.headers,
            body: req.body
        });
    }
    next();
});

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

// Handle OPTIONS for CORS preflight
app.options('/mcp', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

// MCP Server endpoint - GET handler for info
app.get('/mcp', (req, res) => {
    res.json({
        service: 'MCP Server',
        protocol: 'JSON-RPC 2.0',
        methods: ['initialize', 'tools/list', 'tools/call'],
        tools: [
            {
                name: 'sayHello',
                description: 'Say hello world with optional name'
            }
        ],
        note: 'This endpoint accepts POST requests only. Use POST method with JSON-RPC format.'
    });
});

// MCP Server endpoint - POST handler
app.post('/mcp', (req, res) => {
    try {
        // Set CORS headers
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Content-Type', 'application/json');
        
        const { method, params, id } = req.body || {};
        
        if (!method) {
            return res.status(400).json({
                jsonrpc: '2.0',
                id: id || null,
                error: {
                    code: -32600,
                    message: 'Invalid Request: method is required'
                }
            });
        }
        
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
                                },
                                required: []
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
                        message: `Tool not found: ${name}`
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
    } catch (error) {
        console.error('MCP endpoint error:', error);
        res.status(500).json({
            jsonrpc: '2.0',
            id: req.body?.id || null,
            error: {
                code: -32603,
                message: 'Internal error',
                data: error.message
            }
        });
    }
});

// Also handle MCP at root level (in case OpenAI sends to root)
app.post('/', (req, res) => {
    const { method } = req.body || {};
    
    // Only handle MCP requests at root - reuse the same logic
    if (method && (method === 'initialize' || method === 'tools/list' || method === 'tools/call')) {
        // Call the /mcp handler logic directly
        const { params, id } = req.body || {};
        
        if (method === 'initialize') {
            return res.json({
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
            return res.json({
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
                                },
                                required: []
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
                
                return res.json({
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
            }
        }
    }
    
    // Otherwise, serve the HTML page
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

