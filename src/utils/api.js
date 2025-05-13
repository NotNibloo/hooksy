import axios from 'axios';

// Base URL for API - auto switches between development and production
const API_BASE_URL = import.meta.env.PROD 
  ? '/.netlify/functions'
  : '/api';

// Send a webhook message
export const sendWebhookMessage = async (webhookUrl, jsonPayload) => {
  try {
    // Always use the webhook endpoint in production, but fallback to server endpoint in dev
    const endpoint = `${API_BASE_URL}/webhook`;
      
    console.log(`Sending webhook to ${endpoint}`);
    
    const response = await axios.post(endpoint, {
      webhookUrl,
      jsonPayload
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Webhook error:', error);
    
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to send webhook'
    };
  }
}; 