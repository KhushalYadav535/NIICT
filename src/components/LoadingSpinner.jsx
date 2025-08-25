import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', variant = 'primary' }) => {
  const sizeMap = {
    small: 24,
    medium: 32,
    large: 48
  };

  const variantStyles = {
    primary: {
      color: '#667eea',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    secondary: {
      color: '#f093fb',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    accent: {
      color: '#4facfe',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const textVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="loading-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="loading-content">
        <motion.div
          className="spinner-wrapper"
          variants={spinnerVariants}
          animate="animate"
        >
          <Loader2 
            size={sizeMap[size]} 
            style={{ color: variantStyles[variant].color }}
          />
        </motion.div>
        
        {text && (
          <motion.p
            className="loading-text gradient-text"
            variants={textVariants}
            animate="animate"
          >
            {text}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default LoadingSpinner;
