import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import JsonInput from './components/JsonInput'
import WebhookUrlInput from './components/WebhookUrlInput'
import MessagePreview from './components/MessagePreview'
import Sidebar from './components/Sidebar'
import { sendWebhookMessage } from './utils/api'
import useWebhookStore from './store/webhookStore'

function App() {
  const { 
    jsonInput, 
    webhookUrl, 
    isJsonValid, 
    isUrlValid, 
    isLoading, 
    setLoading, 
    setLastResponse,
    resetForm
  } = useWebhookStore();
  
  const handleSendMessage = async () => {
    if (!isJsonValid || !isUrlValid) {
      toast.error('Please provide valid JSON and webhook URL');
      return;
    }
    
    try {
      setLoading(true);
      
      // Make API call
      const parsedJson = JSON.parse(jsonInput);
      const result = await sendWebhookMessage(webhookUrl, parsedJson);
      
      if (result.success) {
        toast.success('Message sent successfully');
        setLastResponse(result.data);
      } else {
        toast.error(`Error: ${result.error}`);
        setLastResponse({ error: result.error });
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      setLastResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="app-layout">
      <Sidebar />
      
      <main className="main-content">
        <header className="page-header">
          <h1>Discord Webhook Sender</h1>
          <p className="tagline">A sleek way to send custom Discord messages</p>
        </header>
        
        <div className="page-content">
          <div className="form-container">
            <div className="input-section">
              <JsonInput />
              <WebhookUrlInput />
            </div>
            
            <div className="preview-section animate-fade-in">
              <MessagePreview />
            </div>
          </div>
          
          <div className="action-section">
            <button 
              className="send-button" 
              onClick={handleSendMessage} 
              disabled={!isJsonValid || !isUrlValid || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                </>
              )}
            </button>
            
            <button 
              className="reset-button" 
              onClick={resetForm}
              disabled={isLoading || !jsonInput}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="reset-icon">
                <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12ZM12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z" fill="currentColor" opacity="0.3"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </main>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
