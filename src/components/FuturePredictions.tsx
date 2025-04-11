import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, Loader2 } from 'lucide-react';
import { healthAPI } from '../util/api';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
}

const LoadingIndicator = () => (
  <div className="space-y-6 p-4">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded w-4/6 animate-pulse"></div>
    </div>
    <div className="flex items-center justify-center space-x-2 text-blue-400">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>Analyzing health data...</span>
    </div>
  </div>
);

const FuturePredictions = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'bot',
    content: 'Hello! I can help you understand your medical reports and answer health-related questions. You can:\n\n• Ask about your medical reports\n• Get explanations of medical terms\n• Understand test results\n• Learn about medications and treatments\n• Get lifestyle recommendations\n• Ask about preventive measures'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      setLoadingStage('Processing your question...');
      
      const response = await healthAPI.chat(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.success ? response.response : response.error || "I apologize, but I encountered an error processing your question. Please try again."
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I apologize, but I encountered an error processing your question. Please try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Medical Report Assistant</h2>
        <button 
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center space-x-2"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col bg-gray-800 rounded-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[90%] sm:max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div className={`rounded-lg px-4 py-2 ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-gray-700'
                }`}>
                  <pre className="whitespace-pre-wrap font-sans text-sm">
                    {message.content}
                  </pre>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start w-full">
              <div className="max-w-[90%] sm:max-w-[80%] w-full bg-gray-800 rounded-lg">
                <LoadingIndicator />
                {loadingStage && (
                  <div className="px-4 pb-4 text-sm text-gray-400">
                    {loadingStage}
                  </div>
                )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your medical reports or health questions..."
              className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuturePredictions;