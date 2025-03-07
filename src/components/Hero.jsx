import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-scroll';
import image1 from '../assets/image5.jpg';
import image2 from '../assets/image6.jpg';
import image3 from '../assets/image7.jpg';
import image4 from '../assets/image8.jpg';

function Hero() {
  const images = [image1, image2, image3, image4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [textColor, setTextColor] = useState('white');
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  let intervalRef = useRef(null);

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

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [images]);

  const handleMouseEnter = () => clearInterval(intervalRef.current);
  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
  };

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
        Loading...
      </section>
    );
  }

  return (
    <section
      id="home"
      className="hero"
      ref={heroRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {images.map((image, index) => (
        <div
          key={index}
          className={`hero-background ${index === currentImageIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      ))}
      <div className="hero-content" style={{ color: textColor }}>
        <h1>Transform Your Career with NIICT</h1>
        <p>Leading IT Training Institute for Professional Excellence</p>
        <Link
          to="courses"
          smooth={true}
          duration={500}
          offset={-80}
          className="btn"
          style={{
            backgroundColor: textColor === 'black' ? '#2563eb' : '#fbbf24',
            color: textColor === 'black' ? 'white' : 'black',
          }}
        >
          Explore Courses
        </Link>
      </div>
    </section>
  );
}

export default Hero;