import axios from 'axios';

// Base URL for API - auto switches between development and production
const API_BASE_URL = import.meta.env.PROD 
  ? '/.netlify/functions'
  : '/api';

// Send a webhook message
export const sendWebhookMessage = async (webhookUrl, jsonPayload) => {
  try {
    let endpoint = import.meta.env.PROD 
      ? `${API_BASE_URL}/webhook`
      : `${API_BASE_URL}/send-webhook`;
      
    const response = await axios.post(endpoint, {
      webhookUrl,
      jsonPayload
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to send webhook'
    };
  }
}; 