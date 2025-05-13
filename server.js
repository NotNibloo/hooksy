import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { process } from 'node:process';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint for sending Discord webhook - using the same path as Netlify functions
app.post('/api/webhook', async (req, res) => {
  try {
    const { webhookUrl, jsonPayload } = req.body;
    
    // Basic validation
    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      return res.status(400).json({ message: 'Invalid webhook URL' });
    }
    
    if (!jsonPayload) {
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    
    // Send to Discord
    const payload = typeof jsonPayload === 'string' ? JSON.parse(jsonPayload) : jsonPayload;
    const response = await axios.post(webhookUrl, payload);
    
    return res.status(200).json({ 
      message: 'Webhook sent successfully', 
      status: response.status
    });
  } catch (error) {
    console.error('Error sending webhook:', error);
    
    return res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.message || 'Error sending webhook',
      error: error.message
    });
  }
});

// For backward compatibility, keep the old endpoint
app.post('/api/send-webhook', (req, res) => {
  // Redirect to the new endpoint
  app.post('/api/webhook', req, res);
});

// In production, serve the static files from the build directory
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, 'dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 