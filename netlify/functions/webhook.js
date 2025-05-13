const axios = require('axios');

exports.handler = async function(event, context) {
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
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return { 
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Invalid request body format' }) 
      };
    }
    
    const { webhookUrl, jsonPayload } = requestBody;
    
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
    let payload;
    try {
      payload = typeof jsonPayload === 'string' ? JSON.parse(jsonPayload) : jsonPayload;
    } catch (error) {
      console.error('Error parsing JSON payload:', error);
      return { 
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Invalid JSON payload format' }) 
      };
    }
    
    // Log the request (helpful for debugging)
    console.log('Sending webhook to Discord:', { 
      url: webhookUrl,
      payloadKeys: Object.keys(payload)
    });
    
    const response = await axios.post(webhookUrl, payload);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Webhook sent successfully',
        status: response.status
      })
    };
  } catch (error) {
    console.error('Error sending webhook:', error.message, error.stack);
    
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: error.response?.data?.message || 'Error sending webhook',
        error: error.message
      })
    };
  }
} 