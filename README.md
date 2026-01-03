# Hello World GPT App

A simple Hello World application for GPT App Store.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run locally:
```bash
npm start
```

3. Test endpoints:
- Health check: http://localhost:3000/health
- Hello endpoint: POST http://localhost:3000/api/hello

## Deployment

Deploy to Vercel:
```bash
npm install -g vercel
vercel login
vercel --prod
```

## GPT Store Setup

1. Update `openapi.yaml` with your Vercel URL
2. Host `openapi.yaml` on GitHub Gist
3. Create Custom GPT at https://chatgpt.com/gpts/editor
4. Import OpenAPI schema from Gist URL
5. Test and publish

