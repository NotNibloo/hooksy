# Netlify Deployment Guide for Hooksy

This guide provides instructions for deploying Hooksy on Netlify and resolving any potential 502 errors.

## Quick Deployment Steps

1. Connect your GitHub repository to Netlify
2. Use the following build settings:
   - Build command: `npm run build` (this installs function dependencies)
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

## Resolving 502 Errors

If you're encountering 502 errors with your serverless functions, follow these steps:

### 1. Check for Dependencies

Make sure your functions have their dependencies installed:

```bash
# Navigate to the functions directory
cd netlify/functions

# Install dependencies
npm install
```

### 2. Deploy with Manual Function Dependency Installation

```bash
# Build with function dependencies
npm run build 

# Deploy to Netlify
netlify deploy --prod
```

### 3. Check Netlify Function Logs

1. Go to your Netlify dashboard
2. Navigate to Functions > webhook
3. Check the logs for any errors

### 4. Common Issues and Fixes

- **Module not found errors**: Make sure axios is properly installed in the functions directory
- **CORS issues**: The function has CORS headers, but check browser console for details
- **Function timeout**: Make sure your function completes within the time limit (10 seconds for free tier)

### 5. Function Structure

The webhook function in `netlify/functions/webhook.js` should use CommonJS format for Netlify compatibility:

```javascript
// Use require instead of import
const axios = require('axios');

// Use exports.handler instead of export const handler
exports.handler = async function(event, context) {
  // Function code
};
```

## Testing Locally

Test your Netlify functions locally before deploying:

```bash
# Install Netlify CLI globally if you haven't already
npm install -g netlify-cli

# Run local development server with Netlify Functions
netlify dev
```

This will run your functions at `http://localhost:8888/.netlify/functions/webhook` 