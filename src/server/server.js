import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'vite';
import { env } from 'node:process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = env.PORT || 3000;
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // API endpoint for sending Discord webhook
  app.post('/api/send-webhook', async (req, res) => {
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
  
  // For production, serve the static files
  if (env.NODE_ENV === 'production') {
    const distPath = join(__dirname, '../../dist');
    app.use(express.static(distPath));
    
    app.get('*', (req, res) => {
      res.sendFile(join(distPath, 'index.html'));
    });
  } else {
    // For development, create a Vite dev server
    const vite = await createServer({
      server: { middlewareMode: true }
    });
    
    app.use(vite.middlewares);
  }
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Start the server
startServer().catch(console.error); 