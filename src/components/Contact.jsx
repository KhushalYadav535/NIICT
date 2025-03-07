import React, { useState } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: '',
  });

  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.course) newErrors.course = 'Course is required';
    if (!formData.message) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmissionStatus('submitting');

    // Simulate successful submission (no backend)
    setTimeout(() => {
      setSubmissionStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        message: '',
      });
      setErrors({});
    }, 1000); // Simulate 1 second delay
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="section-title">
          <h2>Contact Us</h2>
          <p>Get in touch with us for course inquiries and career guidance</p>
        </div>
        <div className="contact-info">
          <div className="contact-info-item">
            <Phone size={24} className="contact-icon" aria-label="Phone number" />
            <span>+91 123 456 7890</span>
          </div>
          <div className="contact-info-item">
            <Mail size={24} className="contact-icon" aria-label="Email address" />
            <span>admissions@niict.edu</span>
          </div>
          <div className="contact-info-item">
            <MapPin size={24} className="contact-icon" aria-label="Physical address" />
            <span>123 Education Hub, Bangalore, India</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}

          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <label htmlFor="phone">Your Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Your Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <label htmlFor="course">Select Course</label>
          <select
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <option value="">Select Course</option>
            <option value="fullstack">Full Stack Development</option>
            <option value="datascience">Data Science</option>
            <option value="ai">Artificial Intelligence</option>
          </select>
          {errors.course && <p className="error">{errors.course}</p>}

          <label htmlFor="message">Your Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Your Message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          {errors.message && <p className="error">{errors.message}</p>}

          <button type="submit" className="btn" disabled={submissionStatus === 'submitting'}>
            {submissionStatus === 'submitting' ? 'Submitting...' : 'Send Inquiry'}
          </button>

          {submissionStatus === 'success' && (
            <p className="submission-status">Inquiry sent successfully!</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;