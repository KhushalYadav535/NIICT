import React, { useState } from 'react';

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

    try {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formData);
      alert('Application submitted successfully!');
      // Reset form
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
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit form. Please try again.' });
    }
  };

  return (
    <div className="admission-container">
      <div className="admission-content">
        <h1 className="admission-title">Admission Form</h1>
        
        <form onSubmit={handleSubmit} className="admission-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="candidateName">Candidate Name *</label>
              <input
                type="text"
                id="candidateName"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                className={errors.candidateName ? 'error' : ''}
              />
              {errors.candidateName && <span className="error-message">{errors.candidateName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="fathersName">Father's Name *</label>
              <input
                type="text"
                id="fathersName"
                name="fathersName"
                value={formData.fathersName}
                onChange={handleChange}
                className={errors.fathersName ? 'error' : ''}
              />
              {errors.fathersName && <span className="error-message">{errors.fathersName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="mothersName">Mother's Name *</label>
              <input
                type="text"
                id="mothersName"
                name="mothersName"
                value={formData.mothersName}
                onChange={handleChange}
                className={errors.mothersName ? 'error' : ''}
              />
              {errors.mothersName && <span className="error-message">{errors.mothersName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'error' : ''}
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dateOfAdmission">Date of Admission</label>
              <input
                type="date"
                id="dateOfAdmission"
                name="dateOfAdmission"
                value={formData.dateOfAdmission}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="course">Course *</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                className={errors.course ? 'error' : ''}
              >
                <option value="">Select a course</option>
                {courses.map((course, index) => (
                  <option key={index} value={course}>{course}</option>
                ))}
              </select>
              {errors.course && <span className="error-message">{errors.course}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="educationalQualification">Educational Qualification *</label>
              <input
                type="text"
                id="educationalQualification"
                name="educationalQualification"
                value={formData.educationalQualification}
                onChange={handleChange}
                className={errors.educationalQualification ? 'error' : ''}
              />
              {errors.educationalQualification && <span className="error-message">{errors.educationalQualification}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contactNo">Contact Number *</label>
              <input
                type="tel"
                id="contactNo"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                className={errors.contactNo ? 'error' : ''}
              />
              {errors.contactNo && <span className="error-message">{errors.contactNo}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="permanentAddress">Permanent Address *</label>
              <textarea
                id="permanentAddress"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                rows="3"
                className={errors.permanentAddress ? 'error' : ''}
              ></textarea>
              {errors.permanentAddress && <span className="error-message">{errors.permanentAddress}</span>}
            </div>

            <div className="form-group image-upload">
              <label htmlFor="image">Upload Photo *</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className={errors.image ? 'error' : ''}
              />
              {errors.image && <span className="error-message">{errors.image}</span>}
              {previewImage && (
                <div className="image-preview">
                  <img src={previewImage} alt="Preview" />
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Submit Application
            </button>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Admission; 