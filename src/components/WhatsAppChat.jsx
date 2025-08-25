import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

const WhatsAppChat = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+91-XXXXXXXXXX'; // Replace with actual number
    const message = 'Hello! I would like to know more about NIICT courses.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallClick = () => {
    const phoneNumber = '+91-XXXXXXXXXX'; // Replace with actual number
    window.open(`tel:${phoneNumber}`, '_self');
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

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="whatsapp-container">
      {/* WhatsApp Button */}
      <motion.button
        className="whatsapp-button glass"
        onClick={handleWhatsAppClick}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          variants={pulseVariants}
          animate="animate"
        >
          <MessageCircle size={24} />
        </motion.div>
        <span className="whatsapp-text">Chat on WhatsApp</span>
      </motion.button>

      {/* Call Button */}
      <motion.button
        className="call-button glass"
        onClick={handleCallClick}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          variants={pulseVariants}
          animate="animate"
        >
          <Phone size={24} />
        </motion.div>
        <span className="call-text">Call Now</span>
      </motion.button>
    </div>
  );
};

export default WhatsAppChat;