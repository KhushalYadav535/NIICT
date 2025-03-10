import React, { useState } from 'react';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Visit Us',
      content: '123 Education Street, Tech City, State 12345',
    },
    {
      icon: '📞',
      title: 'Call Us',
      content: '+1 (234) 567-8900',
    },
    {
      icon: '✉️',
      title: 'Email Us',
      content: 'info@niict.edu',
    },
    {
      icon: '⏰',
      title: 'Working Hours',
      content: 'Mon - Sat: 9:00 AM - 6:00 PM',
    },
  ];

  return (
    <div className="contact-container">
      <div className="contact-content">
        <h1 className="contact-title">Contact Us</h1>
        
        <div className="contact-grid">
          <div className="contact-form-section">
            <div className="contact-card">
              <h2 className="contact-subtitle">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone (optional)"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className={errors.subject ? 'error' : ''}
                  />
                  {errors.subject && <span className="error-message">{errors.subject}</span>}
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows="5"
                    className={errors.message ? 'error' : ''}
                  ></textarea>
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>
                <button 
                  type="submit" 
                  className={`submit-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
                {errors.submit && (
                  <div className="error-message submit-error">
                    {errors.submit}
                  </div>
                )}
                {submitted && (
                  <div className="success-message">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="contact-info-section">
            <div className="contact-info-grid">
              {contactInfo.map((info, index) => (
                <div key={index} className="contact-info-card">
                  <span className="contact-info-icon">{info.icon}</span>
                  <h3 className="contact-info-title">{info.title}</h3>
                  <p className="contact-info-content">{info.content}</p>
                </div>
              ))}
            </div>

            <div className="map-container">
  <iframe
    src="https://www.google.com/maps/place/Niict+Computer/@25.5423762,82.3080288,593m/data=!3m2!1e3!4b1!4m6!3m5!1s0x399003e52a9b7d65:0x8b92656ee8a0560e!8m2!3d25.5423714!4d82.3106037!16s%2Fg%2F11hcb1yhd9?entry=ttu&g_ep=EgoyMDI1MDMwNC4wIKXMDSoASAFQAw%3D%3D"
    width="100%"
    height="300"
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
    </div>
  );
}

export default Contact; 