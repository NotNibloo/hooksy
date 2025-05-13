import { useState, useRef } from 'react';
import useWebhookStore from '../store/webhookStore';

function WebhookUrlInput() {
  const { webhookUrl, setWebhookUrl, isUrlValid } = useWebhookStore();
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef(null);
  
  const handleUrlChange = (e) => {
    setWebhookUrl(e.target.value);
  };
  
  const handleFocus = () => setHasFocus(true);
  const handleBlur = () => setHasFocus(false);
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.startsWith('https://discord.com/api/webhooks/')) {
        setWebhookUrl(text);
        
        // Visual feedback for successful paste
        if (inputRef.current) {
          inputRef.current.classList.add('animate-pulse');
          setTimeout(() => {
            inputRef.current?.classList.remove('animate-pulse');
          }, 1000);
        }
      }
    } catch {
      // Silent fail - clipboard API may not be available
    }
  };
  
  return (
    <div className="webhook-url-container">
      <div className="input-header">
        <span className="input-title">Discord Webhook URL</span>
        <span className={`input-status ${isUrlValid ? 'status-valid' : 'status-invalid'}`}>
          {isUrlValid ? 'Valid URL' : 'Invalid URL'}
        </span>
      </div>
      
      <div className="input-with-button">
        <input
          ref={inputRef}
          type="text"
          value={webhookUrl}
          onChange={handleUrlChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={hasFocus ? 'focus' : ''}
          placeholder="https://discord.com/api/webhooks/..."
        />
        <button 
          onClick={handlePaste} 
          className="button-secondary"
          type="button"
          title="Paste from clipboard"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 8H9C8.44772 8 8 7.55228 8 7V5C8 4.44772 8.44772 4 9 4H15C15.5523 4 16 4.44772 16 5V7C16 7.55228 15.5523 8 15 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <p className="url-info">
        Your webhook URL should start with: https://discord.com/api/webhooks/
      </p>
    </div>
  );
}

export default WebhookUrlInput; 