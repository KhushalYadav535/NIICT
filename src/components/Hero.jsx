import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-scroll';
import { FiArrowRight, FiPlay, FiPause } from 'react-icons/fi';
import image1 from '../assets/image5.jpg';
import image2 from '../assets/image6.jpg';
import image3 from '../assets/image7.jpg';
import image4 from '../assets/image8.jpg';


function Hero() {
  const images = [image1, image2, image3, image4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [textColor, setTextColor] = useState('white');
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  let intervalRef = useRef(null);

  // Calculate image brightness for text contrast
  const calculateBrightness = (imgSrc) => {
    const img = new Image();
    img.src = imgSrc;
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let totalBrightness = 0;
        for (let i = 0; i < imageData.length; i += 4) {
          const brightness = (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3;
          totalBrightness += brightness;
        }
        const averageBrightness = totalBrightness / (imageData.length / 4);
        resolve(averageBrightness);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${imgSrc}`));
      };
    });
  };

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

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

  // Initialize
  useEffect(() => {
    startSlideshow();
    return () => clearInterval(intervalRef.current);
  }, []);

  // Update text color based on image brightness
  useEffect(() => {
    calculateBrightness(images[currentImageIndex])
      .then((brightness) => {
        setTextColor(brightness > 128 ? 'black' : 'white');
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setTextColor('white');
        setLoading(false);
      });
  }, [currentImageIndex, images]);

  if (loading) {
    return (
      <section className="loading">
        <div className="spinner"></div>
        <span className="ml-3">Loading Experience...</span>
      </section>
    );
  }

  return (
    <section
      id="home"
      className="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={pauseSlideshow}
      onMouseLeave={startSlideshow}
    >
      {/* Background images with parallax effect and zoom animation */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`hero-background ${index === currentImageIndex ? 'active zoom' : ''}`}
          style={{
            backgroundImage: `url(${image})`,
            transform: index === currentImageIndex ? 
              `translate(${(mousePosition.x - window.innerWidth/2) * 0.02}px, ${(mousePosition.y - window.innerHeight/2) * 0.02}px)` : 
              'none'
          }}
        ></div>
      ))}
      
      {/* Overlay gradient with animated gradient */}
      <div className="hero-overlay animated-gradient"></div>
      
      {/* Content */}
      <div className="hero-content" style={{ color: textColor }}>
        <h1>
          <span className="text-block">Transform Your Career</span>
          <span className="highlight-text">with NIICT</span>
        </h1>
        <p className="hero-subtitle">
          Leading IT Training Institute for Professional Excellence
          <span className="typing-cursor">|</span>
        </p>
        
        <div className="hero-cta">
          <Link
            to="courses"
            smooth={true}
            duration={500}
            offset={-80}
            className="btn-primary"
            style={{
              backgroundColor: textColor === 'black' ? '#2563eb' : '#fbbf24',
              color: textColor === 'black' ? 'white' : 'black',
            }}
            onMouseEnter={(e) => e.currentTarget.classList.add('btn-hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('btn-hover')}
          >
            Explore Courses
          </Link>
          <Link
            to="contact"
            smooth={true}
            duration={500}
            offset={-80}
            className="btn-secondary"
            style={{
              borderColor: textColor === 'black' ? '#2563eb' : '#fbbf24',
              color: textColor,
            }}
            onMouseEnter={(e) => e.currentTarget.classList.add('btn-hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('btn-hover')}
          >
            Free Consultation
          </Link>
        </div>
      </div>
      
      {/* Slideshow controls with microinteractions */}
      <div className="hero-controls">
        <button 
          className="hero-nav-btn prev"
          onClick={prevSlide}
          aria-label="Previous slide"
          onMouseEnter={(e) => e.currentTarget.classList.add('btn-hover')}
          onMouseLeave={(e) => e.currentTarget.classList.remove('btn-hover')}
        >
          &lsaquo;
        </button>
        
        <button 
          className="hero-play-btn"
          onClick={toggleSlideshow}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          onMouseEnter={(e) => e.currentTarget.classList.add('btn-hover')}
          onMouseLeave={(e) => e.currentTarget.classList.remove('btn-hover')}
        >
          {isPlaying ? <FiPause /> : <FiPlay />}
        </button>
        
        <button 
          className="hero-nav-btn next"
          onClick={nextSlide}
          aria-label="Next slide"
          onMouseEnter={(e) => e.currentTarget.classList.add('btn-hover')}
          onMouseLeave={(e) => e.currentTarget.classList.remove('btn-hover')}
        >
          &rsaquo;
        </button>
      </div>
      
      {/* Slide indicators */}
      <div className="slide-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            onMouseEnter={(e) => e.currentTarget.classList.add('btn-hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('btn-hover')}
          />
        ))}
      </div>
      
      {/* Scrolling indicator */}
      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel" style={{ backgroundColor: textColor }}></div>
        </div>
        <span className="scroll-text" style={{ color: textColor }}>Scroll Down</span>
      </div>
    </section>
  );
}

export default Hero;
