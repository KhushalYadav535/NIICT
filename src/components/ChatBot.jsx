import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User, HelpCircle, Info, AlertCircle } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    { id: 1, text: 'Course Information', icon: <HelpCircle size={16} /> },
    { id: 2, text: 'Admission Process', icon: <Info size={16} /> },
    { id: 3, text: 'Fee Structure', icon: <AlertCircle size={16} /> },
    { id: 4, text: 'Contact Support', icon: <MessageCircle size={16} /> }
  ];

  const botResponses = {
    'course information': 'We offer various courses including Full Stack Development, Data Science, UI/UX Design, Mobile Development, Digital Marketing, and Cloud Computing.',
    'admission process': 'Our admission process: 1) Fill application form, 2) Submit documents, 3) Pay registration fee, 4) Attend counseling, 5) Complete formalities.',
    'fee structure': 'Our course fees range from ₹5,000 to ₹30,000. We offer EMI options and scholarships. Contact our admissions office for details.',
    'contact support': '📞 +91 8182838680, 📧 niict01@gmail.com, or visit our campus at Janghai Station Road, Besides Nagrik Degree College, Janghai Jaunpur (U.P). Available Mon-Sat, 9 AM - 6 PM.',
    'default': 'Thank you for your message! Our support team will get back to you soon. For immediate assistance, please call us at +91 8182838680.'
  };

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    
    return botResponses.default;
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickReply = (reply) => {
    setInputValue(reply);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className="fixed bottom-24 right-6 w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors z-40"
        onClick={toggleChat}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-bg border border-border rounded-lg shadow-xl z-40 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white">
                <Bot size={16} />
              </div>
              <div>
                <h3 className="font-semibold">NIICT Assistant</h3>
                <div className="flex items-center gap-1 text-xs text-green-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-1 hover:bg-secondary rounded transition-colors"
                onClick={toggleMinimize}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                className="p-1 hover:bg-secondary rounded transition-colors"
                onClick={toggleChat}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Welcome Message */}
                {messages.length === 0 && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="bg-secondary rounded-lg p-3">
                        <p>Hello! 👋 Welcome to NIICT. How can I help you today?</p>
                      </div>
                      <div className="text-xs text-secondary mt-1">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' ? 'bg-accent text-white' : 'bg-secondary'
                    }`}>
                      {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user' ? 'bg-accent text-white' : 'bg-secondary'
                      }`}>
                        <p>{message.text}</p>
                      </div>
                      <div className="text-xs text-secondary mt-1">
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-secondary rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {messages.length === 0 && (
                <div className="p-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply.id}
                        className="flex items-center gap-2 p-2 bg-secondary rounded-lg hover:bg-tertiary transition-colors text-sm"
                        onClick={() => handleQuickReply(reply.text)}
                      >
                        {reply.icon}
                        <span>{reply.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="input flex-1"
                    disabled={isTyping}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSendMessage}
                    disabled={isTyping || inputValue.trim() === ''}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;