import { useEffect, useState } from 'react';
import useWebhookStore from '../store/webhookStore';

function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleString();
  } catch {
    return timestamp;
  }
}

function MessagePreview() {
  const { jsonInput, isJsonValid } = useWebhookStore();
  const [preview, setPreview] = useState(null);
  const [isRendering, setIsRendering] = useState(false);
  
  useEffect(() => {
    if (isJsonValid && jsonInput) {
      setIsRendering(true);
      
      // Add small delay to show animation
      const timer = setTimeout(() => {
        try {
          const parsed = JSON.parse(jsonInput);
          setPreview(parsed);
        } catch {
          setPreview(null);
        } finally {
          setIsRendering(false);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setPreview(null);
      setIsRendering(false);
    }
  }, [jsonInput, isJsonValid]);
  
  if (isRendering) {
    return (
      <>
        <div className="preview-header">
          <span className="preview-title">Message Preview</span>
          <span className="text-xs text-tertiary animate-pulse">Rendering...</span>
        </div>
        <div className="message-preview">
          <div className="preview-placeholder">
            <div className="loading-spinner"></div>
          </div>
        </div>
      </>
    );
  }
  
  if (!preview) {
    return (
      <>
        <div className="preview-header">
          <span className="preview-title">Message Preview</span>
          <span className="text-xs text-tertiary">No preview</span>
        </div>
        <div className="message-preview">
          <div className="preview-placeholder">
            {isJsonValid ? 
              'Enter valid webhook JSON to see preview' : 
              'Invalid JSON structure'
            }
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <div className="preview-header">
        <span className="preview-title">Message Preview</span>
        <span className="text-xs text-tertiary">Live preview</span>
      </div>
      <div className="message-preview animate-fade-in">
        <div className="preview-content">
          {/* Username and avatar */}
          {preview.username && (
            <div className="preview-username">
              {preview.avatar_url && (
                <div 
                  className="preview-avatar" 
                  style={{ 
                    width: '24px', 
                    height: '24px',
                    borderRadius: '50%',
                    backgroundImage: `url(${preview.avatar_url})`,
                    backgroundSize: 'cover',
                    backgroundColor: '#333'
                  }}
                />
              )}
              {preview.username}
            </div>
          )}
          
          {/* Content */}
          {preview.content && (
            <div className="preview-message-content">
              {preview.content}
            </div>
          )}
          
          {/* Embeds */}
          {preview.embeds && preview.embeds.length > 0 && (
            <div className="preview-embeds">
              {preview.embeds.map((embed, embedIndex) => (
                <div 
                  className="preview-embed" 
                  key={embedIndex} 
                  style={{ 
                    borderLeftColor: embed.color ? 
                      `#${embed.color.toString(16).padStart(6, '0')}` : 
                      'var(--color-text-secondary)' 
                  }}
                >
                  {embed.title && (
                    <div className="preview-embed-title">
                      {embed.title}
                    </div>
                  )}
                  
                  {embed.description && (
                    <div className="preview-embed-desc">
                      {embed.description}
                    </div>
                  )}
                  
                  {embed.fields && embed.fields.length > 0 && (
                    <div className="preview-embed-fields">
                      {embed.fields.map((field, fieldIndex) => (
                        <div 
                          className={`preview-embed-field ${field.inline ? 'inline' : ''}`} 
                          key={fieldIndex}
                        >
                          <div className="preview-embed-field-name">
                            {field.name}
                          </div>
                          <div className="preview-embed-field-value">
                            {field.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(embed.footer?.text || embed.timestamp) && (
                    <div className="preview-embed-footer">
                      {embed.footer?.text}
                      {embed.footer?.text && embed.timestamp && ' • '}
                      {embed.timestamp && formatTimestamp(embed.timestamp)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MessagePreview; 