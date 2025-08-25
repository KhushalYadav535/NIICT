import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Clock, Calendar, Book, Users, Award, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      text: 'Our coaching hours are:',
      options: [
        'Open: 6:00 AM - 6:00 PM',
        'Monday to Saturday',
        'Sunday: By Appointment',
      ],
      note: '* Flexible batch timings available within these hours',
      icon: <Clock size={16} />
    },
    'faculty': {
      text: 'Our experienced faculty members:',
      options: [
        'Ramesh Sir - Programming Expert',
        'SK Sir - Web Development',
        'Deepak Sir - Database Management',
        'Hemant Sir - Digital Marketing',
        'Sachin Sir - Networking',
        'Khushal Sir - Full Stack Development'
      ],
      note: '* All faculty members have extensive industry experience',
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
    const thinkingTime = Math.random() * 1000 + 500;
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
          '📍 Address: Janghai Station Road, Near Degree College, Jaunpur'
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const typingVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const dotVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderMessage = (message, index) => {
    return (
      <motion.div
        key={index}
        className={`message ${message.sender}-message`}
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        custom={index}
      >
        {message.text}
        {message.options && (
          <motion.ul 
            className="message-options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {message.options.map((option, i) => (
              <motion.li
                key={i}
                onClick={() => handleOptionClick(option)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleOptionClick(option)}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {message.icon && <span className="option-icon">{message.icon}</span>}
                {option}
              </motion.li>
            ))}
          </motion.ul>
        )}
        {message.note && (
          <motion.p 
            className="message-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {message.note}
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <div className="chatbot-container">
      <motion.button
        className="chatbot-toggle glass"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Bot size={32} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chatbot-window glass"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-live="polite"
          >
            <motion.div 
              className="chatbot-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="header-content">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Bot size={24} className="header-icon" />
                </motion.div>
                <h3 className="gradient-text">NIICT Assistant</h3>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={16} className="sparkle-icon" />
                </motion.div>
              </div>
              <motion.button
                className="chatbot-close-button glass"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="chatbot-messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence>
                {messages.map(renderMessage)}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div 
                  className="message bot-message typing"
                  variants={typingVariants}
                  animate="animate"
                >
                  <motion.span className="dot" variants={dotVariants}></motion.span>
                  <motion.span className="dot" variants={dotVariants}></motion.span>
                  <motion.span className="dot" variants={dotVariants}></motion.span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </motion.div>
            
            <motion.div 
              className="chatbot-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about courses, fees, timings..."
                aria-label="Chat message"
                disabled={isTyping}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <motion.button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isTyping}
                aria-label="Send message"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                animate={inputMessage.trim() ? { scale: 1 } : { scale: 0.9 }}
              >
                <Send size={20} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;