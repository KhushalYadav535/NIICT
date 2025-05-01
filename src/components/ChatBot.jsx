import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Clock, Calendar, Book, Users, Award } from 'lucide-react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [inputMessage, setInputMessage] = useState('');

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Always use 'auto' to prevent smooth scroll causing input to move down unexpectedly
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (messages.length > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          text: 'Hello! 👋 Welcome to NIICT. How can I help you today?',
          sender: 'bot'
        }]);
      }, 500);
    }
  }, [isOpen]);

  const coachingResponses = {
    'courses': {
      text: 'We offer various professional courses including:',
      options: [
        'CCC - Course on Computer Concepts',
        'O Level - Advanced Diploma',
        'ADCA - Advanced Diploma in Computer Applications',
        'DCA - Diploma in Computer Applications',
        'Tally with GST',
        'Web Development',
        'Digital Marketing',
        'And more...',
      ],
      icon: <Book size={16} />
    },
    'fees': {
      text: 'Our course fees are very competitive and vary based on the program. Here\'s a general overview:',
      options: [
        'CCC: ₹3,000 - ₹4,000',
        'O Level: ₹20,000 - ₹25,000',
        'ADCA: ₹15,000 - ₹18,000',
        'Tally: ₹5,000 - ₹7,000',
      ],
      note: '* Fees can be paid in installments. Contact admin for current offers.',
      icon: <Award size={16} />
    },
    'timings': {
      text: 'We offer flexible timing options:',
      options: [
        'Morning Batch: 8:00 AM - 11:00 AM',
        'Afternoon Batch: 12:00 PM - 3:00 PM',
        'Evening Batch: 4:00 PM - 7:00 PM',
        'Weekend Batch: Saturday & Sunday',
      ],
      note: '* You can choose any batch as per your convenience.',
      icon: <Clock size={16} />
    },
    'faculty': {
      text: 'Our faculty members are highly qualified professionals:',
      options: [
        'Experienced industry professionals',
        'Certified trainers',
        'Regular workshops and seminars',
        'One-to-one mentoring available',
      ],
      icon: <Users size={16} />
    },
    'admission': {
      text: 'Admission process is simple:',
      options: [
        '1. Fill the admission form',
        '2. Choose your course and batch',
        '3. Pay the registration fee',
        '4. Start your classes',
      ],
      note: '* Documents required: ID proof, address proof, and photographs',
      icon: <Calendar size={16} />
    },
  };

  const handleSend = () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot thinking and typing
    const thinkingTime = Math.random() * 1000 + 500; // Random delay between 500-1500ms
    setTimeout(() => {
      const response = getBotResponse(inputMessage);
      setMessages(prev => [...prev, { ...response, sender: 'bot' }]);
      setIsTyping(false);
    }, thinkingTime);
  };

  const getBotResponse = (query) => {
    query = query.toLowerCase().trim();

    const greetings = /^(hi|hello|hey|namaste|greetings|good morning|good afternoon|good evening)\b/i;
    if (greetings.test(query)) {
      return {
        text: 'Hello! How can I help you today? You can ask me about:',
        options: ['Courses', 'Fees', 'Timings', 'Faculty', 'Admission Process'],
      };
    }

    // Check for contact/location related queries
    if (query.includes('contact') || query.includes('location') || query.includes('address')) {
      return {
        text: 'You can reach us at:',
        options: [
          '📞 Phone: +91-XXXXXXXXXX',
          '📧 Email: info@niict.com',
          '📍 Address: Your Institute Address',
        ],
        note: '* Feel free to visit us during office hours: 9 AM - 6 PM',
      };
    }

    // Check for predefined responses
    for (const [key, value] of Object.entries(coachingResponses)) {
      if (query.includes(key)) {
        return value;
      }
    }

    // Default response
    return {
      text: "I apologize, but I'm not sure about that. You can ask me about:",
      options: ['Courses', 'Fees', 'Timings', 'Faculty', 'Admission'],
      note: '* For specific queries, please contact our admin.',
    };
  };

  const handleOptionClick = (option) => {
    if (isTyping) return;
    setInputMessage(option);
    handleSend();
  };

  const renderMessage = (message, index) => {
    return (
      <div
        key={index}
        className={`message ${message.sender}-message}`}
        style={{
          animationDelay: `${index * 0.1}s`,
          opacity: isAnimating ? 0 : 1
        }}
      >
        {message.text}
        {message.options && (
          <ul className="message-options">
            {message.options.map((option, i) => (
              <li
                key={i}
                onClick={() => handleOptionClick(option)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleOptionClick(option)}
              >
                {message.icon && <span className="option-icon">{message.icon}</span>}
                {option}
              </li>
            ))}
          </ul>
        )}
        {message.note && (
          <p className="message-note">{message.note}</p>
        )}
      </div>
    );
  };

  return (
    <div className="chatbot-container">
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="chatbot-window" aria-live="polite">
          <div className="chatbot-header">
            <h3>NIICT Assistant</h3>
            <button
              className="chatbot-close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map(renderMessage)}
            {isTyping && (
              <div className="message bot-message typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about courses, fees, timings..."
              aria-label="Chat message"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;