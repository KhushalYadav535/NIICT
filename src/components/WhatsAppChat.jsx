import React from 'react';
import { MessageCircle } from 'lucide-react';

function WhatsAppChat() {
  // Replace this with your actual WhatsApp number
  const phoneNumber = '919876543210'; // Format: country code + number
  const message = encodeURIComponent('Hi, I would like to know more about NIICT courses.');
  
  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button 
      className="whatsapp-button" 
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={24} />
      <span className="whatsapp-text">Chat with us</span>
    </button>
  );
}

export default WhatsAppChat; 