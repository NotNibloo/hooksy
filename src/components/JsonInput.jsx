import { useRef, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useWebhookStore from '../store/webhookStore';

function JsonInput() {
  const { jsonInput, setJsonInput, isJsonValid } = useWebhookStore();
  const [isDragActive, setIsDragActive] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && hasFocus) {
        textareaRef.current?.blur();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [hasFocus]);
  
  const handleJsonChange = (e) => {
    setJsonInput(e.target.value);
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragActive) setIsDragActive(true);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };
  
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFocus = () => setHasFocus(true);
  const handleBlur = () => setHasFocus(false);
  
  const handleFile = (file) => {
    if (!file) return;
    
    if (file.type !== 'application/json') {
      toast.error('Please upload a valid JSON file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      try {
        // Validate if content is valid JSON
        JSON.parse(content);
        setJsonInput(content);
        
        // Animate textarea to indicate new content
        if (textareaRef.current) {
          textareaRef.current.classList.add('animate-pulse');
          setTimeout(() => {
            textareaRef.current?.classList.remove('animate-pulse');
          }, 1000);
        }
      } catch (error) {
        toast.error(`Invalid JSON file: ${error.message}`);
      }
    };
    reader.readAsText(file);
  };
  
  const getExampleJson = () => {
    const exampleJson = {
      username: "Hooksy Notifier",
      avatar_url: "https://example.com/avatar.png",
      content: "New notification from Hooksy!",
      embeds: [{
        title: "Embed Title",
        description: "Embed description with **markdown**.",
        color: 2105893,
        fields: [
          {name: "Field 1", value: "Value 1", inline: true},
          {name: "Field 2", value: "Value 2", inline: true}
        ],
        footer: {text: "Hooksy Footer"},
        timestamp: new Date().toISOString()
      }]
    };
    
    return JSON.stringify(exampleJson, null, 2);
  };
  
  const handleUseExample = () => {
    setJsonInput(getExampleJson());
    
    // Animate textarea to indicate new content
    if (textareaRef.current) {
      textareaRef.current.classList.add('animate-pulse');
      setTimeout(() => {
        textareaRef.current?.classList.remove('animate-pulse');
      }, 1000);
    }
  };
  
  return (
    <div className="json-input-container">
      <div className="input-header">
        <span className="input-title">JSON Payload</span>
        <span className={`input-status ${isJsonValid ? 'status-valid' : 'status-invalid'}`}>
          {isJsonValid ? 'Valid JSON' : 'Invalid JSON'}
        </span>
      </div>
      
      <textarea
        ref={textareaRef}
        className={`json-textarea ${hasFocus ? 'focus' : ''}`}
        value={jsonInput}
        onChange={handleJsonChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Enter your Discord webhook JSON payload here..."
        spellCheck="false"
      />
      
      <div
        className={`file-drop-area ${isDragActive ? 'active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="file-drop-message">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 16.2091 19.2091 18 17 18H7C4.79086 18 3 16.2091 3 14C3 11.7909 4.79086 10 7 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 14L12 12L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p>Drag and drop your JSON file here</p>
          <p className="text-tertiary text-xs">- or -</p>
          <div className="flex gap-sm">
            <button onClick={handleBrowseClick} className="button-secondary">Browse Files</button>
            <button onClick={handleUseExample} className="button-secondary">Use Example</button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </div>
      </div>
    </div>
  );
}

export default JsonInput; 