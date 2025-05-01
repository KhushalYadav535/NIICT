import React from 'react';
import { X, Clock, Users, Award, Calendar, CheckCircle, ArrowRight } from 'lucide-react';
import './CourseModal.css';

const CourseModal = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{course.title}</h2>
          <p className="modal-subtitle">Take your skills to the next level with our professional course</p>
          <button className="close-button" onClick={onClose} aria-label="Close course details">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">{course.description}</p>

          <div className="modal-grid">
            <div className="modal-info-item">
              <Clock size={20} className="info-icon" aria-hidden="true" />
              <span>Duration: {course.duration}</span>
            </div>
            <div className="modal-info-item">
              <Users size={20} className="info-icon" aria-hidden="true" />
              <span>{course.students}+ enrolled</span>
            </div>
            <div className="modal-info-item">
              <Award size={20} className="info-icon" aria-hidden="true" />
              <span>Level: {course.level}</span>
            </div>
            <div className="modal-info-item">
              <Calendar size={20} className="info-icon" aria-hidden="true" />
              <span>Starts: {course.startDate}</span>
            </div>
          </div>

          <div className="modal-features">
            <h3>What you'll learn</h3>
            <ul className="feature-list">
              {[
                'Comprehensive course materials',
                'Hands-on practical sessions',
                'Industry-relevant projects',
                'Expert instructors',
                'Flexible timing options',
                'Placement assistance'
              ].map((feature, index) => (
                <li key={index} className="feature-item">
                  <CheckCircle size={16} className="feature-icon" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="course-syllabus">
            <h3>Course Syllabus</h3>
            <div className="syllabus-modules">
              {/* Example modules - you can customize these based on your needs */}
              <div className="module">
                <h4>Module 1: Introduction</h4>
                <p>Foundation concepts and setup</p>
              </div>
              <div className="module">
                <h4>Module 2: Core Concepts</h4>
                <p>Essential principles and techniques</p>
              </div>
              <div className="module">
                <h4>Module 3: Advanced Topics</h4>
                <p>Advanced implementations and best practices</p>
              </div>
              <div className="module">
                <h4>Module 4: Projects</h4>
                <p>Hands-on projects and practical applications</p>
              </div>
              {course.syllabus && course.syllabus.map((module, index) => (
                <div key={index} className="module">
                  <h4>{module.title}</h4>
                  <p>{module.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="enroll-button">
            Enroll Now <ArrowRight size={20} className="enroll-icon" aria-hidden="true" />
          </button>
          <p className="modal-note">
            * Course fees and schedule will be discussed during enrollment
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;