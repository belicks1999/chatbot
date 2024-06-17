// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function Bot() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (message.trim() === '') return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/chat', { message });
      setChat([...chat, { user: 'me', message, timestamp: new Date().toLocaleTimeString() }, { user: 'bot', message: response.data.response, timestamp: new Date().toLocaleTimeString() }]);
    } catch (error) {
      setChat([...chat, { user: 'me', message, timestamp: new Date().toLocaleTimeString() }, { user: 'bot', message: 'Error: Could not reach the server.', timestamp: new Date().toLocaleTimeString() }]);
    } finally {
      setMessage('');
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
        <div className="mb-4">
          <h2 className="text-2xl mb-2 text-center">ChatBot Info</h2>
          <p className='text-justify'>Welcome to the BELL.AI Chatbot powered by Gemini AI. You can ask questions or have a conversation with the bot. Your messages will get Accurate answer from chatbot. Enjoy Chatting.</p>
        </div>
        <div className="flex-grow">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="loader my-3 mr-4"></div> 
              <div >Loading...</div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div>Start Chatting...</div>
            </div>
          )}
        </div>
      </aside>
      <div className="flex flex-col flex-grow">
        <header className="bg-gray-600 text-white text-center p-4">
          <h1 className="text-2xl">BELL.AI powered by Gemini</h1>
        </header>
        <main className="flex flex-col flex-grow overflow-hidden bg-gray-300">
          <div className="flex-grow overflow-y-auto p-4">
            {chat.map((msg, index) => (
              <div key={index} className={`flex my-2 ${msg.user === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xl p-4 rounded-lg shadow ${msg.user === 'me' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} style={{ wordBreak: 'break-word' }}>
                <ReactMarkdown className="markdown-body" children={msg.message} />
                  <div className="text-xs text-right mt-1">{msg.timestamp}</div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="flex items-center p-4 bg-gray-600">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow p-2 border rounded-lg"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              className="p-2 ml-2 text-white bg-blue-500 rounded-lg w-20"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </main>
        <style jsx>{`
        .loader {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-left-color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

      
        .markdown-body pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .markdown-body code {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
      </div>
      
    </div>
  );
}

export default Bot;
