import { create } from 'zustand';

const useWebhookStore = create((set) => ({
  jsonInput: '',
  webhookUrl: '',
  isLoading: false,
  isJsonValid: false,
  isUrlValid: false,
  lastResponse: null,
  
  setJsonInput: (json) => set({ 
    jsonInput: json,
    isJsonValid: validateJson(json)
  }),
  
  setWebhookUrl: (url) => set({ 
    webhookUrl: url,
    isUrlValid: validateUrl(url)
  }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setLastResponse: (response) => set({ lastResponse: response }),
  
  resetForm: () => set({ 
    jsonInput: '',
    isJsonValid: false,
  })
}));

// Helper functions for validation
function validateJson(json) {  if (!json) return false;  try {    JSON.parse(json);    return true;  } catch {    return false;  }}

function validateUrl(url) {
  if (!url) return false;
  return url.startsWith('https://discord.com/api/webhooks/');
}

export default useWebhookStore; 