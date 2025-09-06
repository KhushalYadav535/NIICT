import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  Star,
  Award,
  Users,
  Clock
} from 'lucide-react';

function Admission() {
  const [formData, setFormData] = useState({
    candidateName: '',
    fathersName: '',
    mothersName: '',
    dateOfBirth: '',
    dateOfAdmission: new Date().toISOString().split('T')[0],
    course: '',
    educationalQualification: '',
    contactNo: '',
    permanentAddress: '',
    image: null
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const courses = [
    'CCC',
    'O Level',
    'ADCA',
    'Tally',
    'DTP',
    'Web Designing',
    'Graphic Designing',
    'DIT',
    'PGDCA',
    'Full Stack Development',
    'Data Science',
    'Artificial Intelligence',
    'Cloud Computing',
    'Cybersecurity',
    'Digital Marketing'
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.candidateName.trim()) {
      newErrors.candidateName = 'Candidate name is required';
    }
    
    if (!formData.fathersName.trim()) {
      newErrors.fathersName = 'Father\'s name is required';
    }
    
    if (!formData.mothersName.trim()) {
      newErrors.mothersName = 'Mother\'s name is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      // Date of birth validation - must be 20 years or younger
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Check if birthday hasn't occurred this year
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
      
      if (actualAge > 20) {
        newErrors.dateOfBirth = 'Only candidates aged 20 or below can register';
      }
    }
    
    if (!formData.course) {
      newErrors.course = 'Please select a course';
    }
    
    if (!formData.educationalQualification.trim()) {
      newErrors.educationalQualification = 'Educational qualification is required';
    }
    
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.contactNo)) {
      newErrors.contactNo = 'Please enter a valid contact number';
    }
    
    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = 'Permanent address is required';
    }
    
    if (!formData.image) {
      newErrors.image = 'Please upload your photo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert image to base64
      const imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(formData.image);
      });

      // Create FormData object to send to backend
      const admissionData = {
        name: formData.candidateName,
        email: formData.contactNo, // Using contact as email for now
        phone: formData.contactNo,
        course: formData.course,
        dateOfBirth: formData.dateOfBirth,
        dateOfAdmission: formData.dateOfAdmission,
        address: formData.permanentAddress,
        education: formData.educationalQualification,
        fathersName: formData.fathersName,
        mothersName: formData.mothersName,
        image: imageBase64
      };

      console.log('Submitting admission data:', { ...admissionData, image: 'base64 string...' });

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/admissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(admissionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit admission');
      }

      const result = await response.json();
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          candidateName: '',
          fathersName: '',
          mothersName: '',
          dateOfBirth: '',
          dateOfAdmission: new Date().toISOString().split('T')[0],
          course: '',
          educationalQualification: '',
          contactNo: '',
          permanentAddress: '',
          image: null
        });
        setPreviewImage(null);
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const upiId = 'Q425549449@ybl';
    const upiIntent = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('NIICT')}&cu=INR&tn=${encodeURIComponent('Admission Fee')}`;

    return (
      <motion.div 
        className="admission-success"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="success-content">
          <motion.div 
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle size={80} />
          </motion.div>
          <motion.h2 
            className="success-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Application Submitted Successfully!
          </motion.h2>
          <motion.p 
            className="success-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Thank you for choosing NIICT. We'll review your application and get back to you soon.
          </motion.p>

          <motion.div 
            className="payment-box"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3>Complete Payment</h3>
            <p>Please pay the admission fee using the UPI below.</p>
            <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>UPI ID</div>
              <div style={{ fontSize: 18, wordBreak: 'break-all', marginBottom: 12 }}>{upiId}</div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                {/* QR component available elsewhere; simple img fallback omitted */}
                {/* You can replace this with <QRCode value={upiIntent} size={160} /> if QRCode is available here */}
                <img alt="UPI QR" src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiIntent)}`} />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button className="btn" onClick={() => navigator.clipboard.writeText(upiId)}>Copy UPI ID</button>
                <a className="btn primary" href={upiIntent}>Open UPI App</a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="success-features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="feature">
              <Clock size={20} />
              <span>Response within 24 hours</span>
            </div>
            <div className="feature">
              <Users size={20} />
              <span>Personalized counseling</span>
            </div>
            <div className="feature">
              <Award size={20} />
              <span>Industry-recognized certification</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="admission-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section className="admission-hero" variants={itemVariants}>
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <motion.div 
            className="hero-badge"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Sparkles size={24} />
            <span>Join NIICT</span>
          </motion.div>
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Start Your Journey
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Transform your future with our premium computer training programs
          </motion.p>
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="stat">
              <Star size={20} />
              <span>500+ Students</span>
            </div>
            <div className="stat">
              <Award size={20} />
              <span>15+ Courses</span>
            </div>
            <div className="stat">
              <Users size={20} />
              <span>Expert Instructors</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Form Section */}
      <motion.section className="admission-form-section" variants={itemVariants}>
        <div className="form-container">
          <motion.div 
            className="form-header"
            variants={itemVariants}
          >
            <h2 className="form-title">Admission Application</h2>
            <p className="form-subtitle">Complete the form below to begin your learning journey</p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="admission-form glass"
            variants={formVariants}
          >
            <div className="form-grid">
              {/* Personal Information */}
              <motion.div className="form-section" variants={itemVariants}>
                <h3 className="section-title">
                  <User size={20} />
                  Personal Information
                </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="candidateName">
                      <User size={16} />
                      Candidate Name *
                    </label>
                    <input
                      type="text"
                      id="candidateName"
                      name="candidateName"
                      value={formData.candidateName}
                      onChange={handleChange}
                      className={errors.candidateName ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    <AnimatePresence>
                      {errors.candidateName && (
                        <motion.span 
                          className="error-message"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <AlertCircle size={14} />
                          {errors.candidateName}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateOfBirth">
                      <Calendar size={16} />
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={errors.dateOfBirth ? 'error' : ''}
                    />
                    <AnimatePresence>
                      {errors.dateOfBirth && (
                        <motion.span 
                          className="error-message"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <AlertCircle size={14} />
                          {errors.dateOfBirth}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fathersName">
                      <User size={16} />
                      Father's Name *
                    </label>
                    <input
                      type="text"
                      id="fathersName"
                      name="fathersName"
                      value={formData.fathersName}
                      onChange={handleChange}
                      className={errors.fathersName ? 'error' : ''}
                      placeholder="Enter father's name"
                    />
                    <AnimatePresence>
                      {errors.fathersName && (
                        <motion.span 
                          className="error-message"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <AlertCircle size={14} />
                          {errors.fathersName}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="form-group">
                    <label htmlFor="mothersName">
                      <User size={16} />
                      Mother's Name *
                    </label>
                    <input
                      type="text"
                      id="mothersName"
                      name="mothersName"
                      value={formData.mothersName}
                      onChange={handleChange}
                      className={errors.mothersName ? 'error' : ''}
                      placeholder="Enter mother's name"
                    />
                    <AnimatePresence>
                      {errors.mothersName && (
                        <motion.span 
                          className="error-message"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <AlertCircle size={14} />
                          {errors.mothersName}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

              {/* Course Information */}
              <motion.div className="form-section" variants={itemVariants}>
                <h3 className="section-title">
                  <BookOpen size={20} />
                  Course Information
                </h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="course">
                      <GraduationCap size={16} />
                      Select Course *
                    </label>
                    <div className="select-wrapper">
                      <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className={errors.course ? 'error' : ''}
                        required
                      >
                        <option value="" disabled>Choose your course</option>
                        {courses.map((course, index) => (
                          <option key={index} value={course}>{course}</option>
                        ))}
                      </select>
                      <div className="select-arrow">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <AnimatePresence>
                      {errors.course && (
                        <motion.span 
                          className="error-message"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <AlertCircle size={14} />
                          {errors.course}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dateOfAdmission">
                      <Calendar size={16} />
                      Date of Admission
                    </label>
                    <input
                      type="date"
                      id="dateOfAdmission"
                      name="dateOfAdmission"
                      value={formData.dateOfAdmission}
                      onChange={handleChange}
                      disabled
                      className="disabled"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="educationalQualification">
                    <GraduationCap size={16} />
                    Educational Qualification *
                  </label>
                  <input
                    type="text"
                    id="educationalQualification"
                    name="educationalQualification"
                    value={formData.educationalQualification}
                    onChange={handleChange}
                    className={errors.educationalQualification ? 'error' : ''}
                    placeholder="e.g., 12th Pass, B.Tech, etc."
                  />
                  <AnimatePresence>
                    {errors.educationalQualification && (
                      <motion.span 
                        className="error-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <AlertCircle size={14} />
                        {errors.educationalQualification}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div className="form-section" variants={itemVariants}>
                <h3 className="section-title">
                  <Phone size={20} />
                  Contact Information
                </h3>
                
                <div className="form-group">
                  <label htmlFor="contactNo">
                    <Phone size={16} />
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    id="contactNo"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    className={errors.contactNo ? 'error' : ''}
                    placeholder="Enter your phone number"
                  />
                  <AnimatePresence>
                    {errors.contactNo && (
                      <motion.span 
                        className="error-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <AlertCircle size={14} />
                        {errors.contactNo}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="form-group">
                  <label htmlFor="permanentAddress">
                    <MapPin size={16} />
                    Permanent Address *
                  </label>
                  <textarea
                    id="permanentAddress"
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    rows="3"
                    className={errors.permanentAddress ? 'error' : ''}
                    placeholder="Enter your complete address"
                  ></textarea>
                  <AnimatePresence>
                    {errors.permanentAddress && (
                      <motion.span 
                        className="error-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <AlertCircle size={14} />
                        {errors.permanentAddress}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Photo Upload */}
              <motion.div className="form-section" variants={itemVariants}>
                <h3 className="section-title">
                  <Camera size={20} />
                  Photo Upload
                </h3>
                
                <div className="image-upload-container">
                  <div className="upload-area">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    <label htmlFor="image" className="upload-label">
                      <div className="upload-content">
                        <Upload size={32} />
                        <span>Click to upload your photo</span>
                        <small>Max size: 5MB</small>
                      </div>
                    </label>
                  </div>
                  
                  <AnimatePresence>
                    {previewImage && (
                      <motion.div 
                        className="image-preview"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <img src={previewImage} alt="Preview" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <AnimatePresence>
                    {errors.image && (
                      <motion.span 
                        className="error-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <AlertCircle size={14} />
                        {errors.image}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            <motion.div 
              className="form-actions"
              variants={itemVariants}
            >
              <motion.button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {errors.submit && (
                <motion.div 
                  className="error-message submit-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle size={16} />
                  {errors.submit}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default Admission; 