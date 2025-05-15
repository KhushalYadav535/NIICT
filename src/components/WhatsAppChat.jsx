import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppChat = () => {
  return (
    <a
      href="https://wa.me/1234567890" // Replace with your WhatsApp number
      className="whatsapp-chat"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        backgroundColor: '#25D366',
        color: 'white',
        borderRadius: '50%',
        padding: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'background-color 0.3s',
      }}
    >
      <FaWhatsapp size={32} />
    </a>
  );
};

export default WhatsAppChat;