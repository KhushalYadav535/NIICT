import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppChat = () => {
  const phoneNumber = '+918182838680';
  const message = encodeURIComponent('Hello! I\'m interested in learning more about courses at NIICT.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-40"
    >
      <MessageCircle size={24} />
    </a>
  );
};

export default WhatsAppChat;