import axios from 'axios';

export const handler = async function(event) {
  // Set CORS headers for preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: "Method Not Allowed" })
    };
  }
  
  try {
    const { webhookUrl, jsonPayload } = JSON.parse(event.body);
    
    // Basic validation
    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      return { 
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Invalid webhook URL' }) 
      };
    }
    
    if (!jsonPayload) {
      return { 
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Invalid JSON payload' }) 
      };
    }
    
    // Send to Discord
    const payload = typeof jsonPayload === 'string' ? JSON.parse(jsonPayload) : jsonPayload;
    const response = await axios.post(webhookUrl, payload);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Webhook sent successfully',
        status: response.status
      })
    };
  } catch (error) {
    console.error('Error sending webhook:', error);
    
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: error.response?.data?.message || 'Error sending webhook',
        error: error.message
      })
    };
  }
}; 