import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import student1 from '../assets/sst.jpg';
import student2 from '../assets/sst3.jpg';
import student3 from '../assets/sst4.jpg';

function Testimonial() {
  const testimonials = [
    {
      name: "Amit Kumar",
      role: "Web Developer at TechSolutions",
      message: "NIICT completely transformed my career trajectory! The hands-on training and industry-relevant curriculum helped me secure my dream job within 3 months of completing the course.",
      image: student1,
      rating: 5
    },
    {
      name: "Sunil Sharma",
      role: "Data Analyst at AnalyticsPro",
      message: "The practical skills I gained at NIICT were immediately applicable in my new role. The instructors go above and beyond to ensure student success.",
      image: student2,
      rating: 5
    },
    {
      name: "Abhishek Patel",
      role: "UI/UX Designer at CreativeMinds",
      message: "The learning environment at NIICT fosters creativity and innovation. The career support team helped me build an outstanding portfolio that impressed employers.",
      image: student3,
      rating: 4
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextTestimonial();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const renderRating = (rating) => {
    return (
      <div className="rating-stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "star filled" : "star"}>★</span>
        ))}
      </div>
    );
  };

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <div className="section-header">
          <h2 className="section-title">Success Stories</h2>
          <p className="section-subtitle">Hear from our alumni about their transformative learning experiences</p>
        </div>

        <div className="testimonial-carousel">
          <div 
            className="testimonial-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                className={`testimonial-slide ${index === currentIndex ? 'active' : ''}`}
                key={index}
              >
                <div className="testimonial-card">
                  <div className="quote-icon">
                    <Quote size={32} color="#2563eb" />
                  </div>
                  <p className="testimonial-text">"{testimonial.message}"</p>
                  {renderRating(testimonial.rating)}
                  <div className="testimonial-author">
                    <div className="author-image">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="author-info">
                      <h4 className="author-name">{testimonial.name}</h4>
                      <p className="author-role">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-controls">
            <button 
              className="control-button prev"
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button 
              className="control-button next"
              onClick={nextTestimonial}
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;