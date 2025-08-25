import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.contact-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (formData.phone && !/^\+?[\d\s-]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} color="#00d4ff" />,
      title: 'Visit Us',
      content: 'Janghai Station Road, Besides Nagrik Degree College, Janghai Jaunpur (U.P)',
    },
    {
      icon: <Phone size={24} color="#00d4ff" />,
      title: 'Call Us',
      content: '+91 8182838680',
      link: 'tel:+918182838680'
    },
    {
      icon: <Mail size={24} color="#00d4ff" />,
      title: 'Email Us',
      content: 'niict01@gmail.com',
      link: 'mailto:niict01@gmail.com'
    },
    {
      icon: <Clock size={24} color="#00d4ff" />,
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 6:00 PM',
    },
  ];

  return (
    <section className={`contact-section ${isVisible ? 'visible' : ''}`}>
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-subtitle">We'd love to hear from you! Reach out for inquiries or support.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-form-container">
            <div className="form-card">
              <h2 className="form-title">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className={`form-group ${activeField === 'name' ? 'active' : ''} ${errors.name ? 'error' : ''}`}>
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className={`form-group ${activeField === 'email' ? 'active' : ''} ${errors.email ? 'error' : ''}`}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className={`form-group ${activeField === 'phone' ? 'active' : ''} ${errors.phone ? 'error' : ''}`}>
                  <label htmlFor="phone">Phone Number (Optional)</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => handleFocus('phone')}
                    onBlur={handleBlur}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className={`form-group ${activeField === 'subject' ? 'active' : ''} ${errors.subject ? 'error' : ''}`}>
                  <label htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => handleFocus('subject')}
                    onBlur={handleBlur}
                    placeholder="What is this about?"
                  />
                  {errors.subject && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.subject}
                    </span>
                  )}
                </div>

                <div className={`form-group ${activeField === 'message' ? 'active' : ''} ${errors.message ? 'error' : ''}`}>
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={handleBlur}
                    rows="5"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                  {errors.message && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.message}
                    </span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className={`submit-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="button-loader"></span>
                  ) : (
                    <>
                      <Send size={18} /> Send Message
                    </>
                  )}
                </button>

                {errors.submit && (
                  <div className="error-message submit-error">
                    <AlertCircle size={16} />
                    {errors.submit}
                  </div>
                )}

                {submitted && (
                  <div className="success-message">
                    <CheckCircle size={20} /> Thank you! Your message has been sent successfully.
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="contact-info-container">
            <div className="info-cards">
              {contactInfo.map((info, index) => (
                <a 
                  href={info.link} 
                  key={index} 
                  className="info-card"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <div className="info-icon">
                    {info.icon}
                  </div>
                  <div className="info-content">
                    <h3>{info.title}</h3>
                    <p>{info.content}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="map-container">
              <div className="map-overlay" onClick={(e) => e.preventDefault()}>
                <span>Click to interact with map</span>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.547582561444!2d82.3080288!3d25.5423762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399003e52a9b7d65%3A0x8b92656ee8a0560e!2sNiict%20Computer!5e0!3m2!1sen!2sin!4v1713960000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="NIICT Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;