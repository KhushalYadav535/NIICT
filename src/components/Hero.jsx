import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-scroll';
import { FiArrowRight, FiPlay, FiPause, FiChevronDown, FiStar, FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import image1 from '../assets/image5.jpg';
import image2 from '../assets/image6.jpg';
import image3 from '../assets/image7.jpg';
import image4 from '../assets/image8.jpg';

function Hero() {
  const images = [image1, image2, image3, image4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  let intervalRef = useRef(null);

  // Start slideshow
  const startSlideshow = () => {
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
  };

  // Pause slideshow
  const pauseSlideshow = () => {
    setIsPlaying(false);
    clearInterval(intervalRef.current);
  };

  // Toggle play/pause
  const toggleSlideshow = () => {
    if (isPlaying) {
      pauseSlideshow();
    } else {
      startSlideshow();
    }
  };

  // Manual slide navigation
  const goToSlide = (index) => {
    setCurrentImageIndex(index);
    if (isPlaying) {
      clearInterval(intervalRef.current);
      startSlideshow();
    }
  };

  // Next slide
  const nextSlide = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    if (isPlaying) {
      clearInterval(intervalRef.current);
      startSlideshow();
    }
  };

  // Previous slide
  const prevSlide = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    if (isPlaying) {
      clearInterval(intervalRef.current);
      startSlideshow();
    }
  };

  // Start slideshow on mount
  useEffect(() => {
    startSlideshow();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -3,
      transition: {
        duration: 0.3,
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

  const imageVariants = {
    enter: {
      opacity: 0,
      scale: 1.1
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 1,
        ease: "easeIn"
      }
    }
  };

  // Stats data
  const stats = [
    { icon: <FiUsers size={24} />, value: "1000+", label: "Students Trained" },
    { icon: <FiAward size={24} />, value: "95%", label: "Success Rate" },
    { icon: <FiTrendingUp size={24} />, value: "50+", label: "Courses Available" },
    { icon: <FiStar size={24} />, value: "4.9", label: "Student Rating" }
  ];

  if (loading) {
    return (
      <motion.section
        className="hero-section loading-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="loading-content"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="spinner"></div>
          <p className="loading-text">Loading NIICT Experience...</p>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      ref={heroRef}
      className="hero-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Images */}
      <div className="hero-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="hero-image"
            style={{
              backgroundImage: `url(${images[currentImageIndex]})`
            }}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          />
        </AnimatePresence>
      </div>

      {/* Hero Overlay */}
      <motion.div
        className="hero-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Hero Content */}
      <div className="hero-content">
        <motion.div
          className="hero-text"
          variants={itemVariants}
        >
          <motion.h1
            className="hero-title gradient-text"
            variants={itemVariants}
          >
            Welcome to NIICT
          </motion.h1>
          <motion.h2
            className="hero-subtitle"
            variants={itemVariants}
          >
            #1 Computer Training Institute in Janghai
          </motion.h2>
          <motion.p
            className="hero-description"
            variants={itemVariants}
          >
            Transform your career with expert IT training. Join 1000+ successful students who found their dream jobs through NIICT.
          </motion.p>
        </motion.div>

        <motion.div
          className="hero-cta"
          variants={itemVariants}
        >
          <motion.div
            className="cta-buttons"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to="courses"
              smooth={true}
              duration={800}
              className="cta-button primary glass"
            >
              <span>Explore Courses</span>
              <FiArrowRight size={20} />
            </Link>
            <Link
              to="contact"
              smooth={true}
              duration={800}
              className="cta-button secondary glass"
            >
              <span>Get Started</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Premium Stats Section */}
        <motion.div
          className="hero-stats"
          variants={itemVariants}
        >
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-item glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Hero Controls */}
      <motion.div
        className="hero-controls"
        variants={itemVariants}
      >
        <motion.button
          className="control-button glass"
          onClick={prevSlide}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="Previous slide"
        >
          <span>‹</span>
        </motion.button>

        <motion.button
          className="control-button glass"
          onClick={toggleSlideshow}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="pause"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <FiPause size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="play"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <FiPlay size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          className="control-button glass"
          onClick={nextSlide}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          aria-label="Next slide"
        >
          <span>›</span>
        </motion.button>
      </motion.div>

      {/* Slide Indicators */}
      <motion.div
        className="slide-indicators"
        variants={itemVariants}
      >
        {images.map((_, index) => (
          <motion.button
            key={index}
            className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            variants={buttonVariants}
          />
        ))}
      </motion.div>
    </motion.section>
  );
}

export default Hero;
