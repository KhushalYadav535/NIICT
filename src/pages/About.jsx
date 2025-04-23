import React from 'react';
import rameshSir from '../assets/tutor1.jpeg';
import sksir from '../assets/sksir.jpg';
import schinSir from '../assets/sachinsir.png';
import hemantSir from '../assets/hemantsir.png';
import deepakSir from '../assets/gauravsir.png';

function About() {
  const instructors = [
    {
      name: 'Ramesh Sir',
      role: 'Director',
      bio: 'With over 10 years of experience in the IT industry, Ramesh Sir leads NIICT with a vision to transform education through innovation and practical learning.',
      image: rameshSir,
    },
    {
      name: 'SK Sir',
      role: 'Mentor',
      bio: 'SK Sir is a seasoned computer professional and mentor, specializing in full-stack development and helping students build real-world projects.',
      image: sksir,
    },
    {
      name: 'Sachin Sir',
      role: 'Mentor',
      bio: 'Sachin Sir is an expert in data science and AI, guiding students to master cutting-edge technologies and excel in their careers.',
      image: schinSir,

    },
    {
      name: 'Hemant Sir',
      role: 'Mentor',
      bio: 'Hemant Sir is a frontend developer and mentor, passionate about teaching students the latest web technologies and design principles.',
      image: hemantSir,
    },
    {
      name: 'Deepak Sir',
      role: 'Mentor',
      bio: 'Deepak Sir is a cybersecurity expert, helping students develop the skills to protect systems and networks from cyber threats.',
      image: deepakSir,
    }

  ];

  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">About NIICT</h1>
        <div className="about-card">
          <p className="about-text">
            NIICT (Nihanshi Institute of Information and Computer Technology) is a premier institution
            dedicated to empowering students with cutting-edge technology skills and knowledge.
          </p>
          <h2 className="about-subtitle">Our Mission</h2>
          <p className="about-text">
            To provide world-class IT education and training that enables our students to excel in
            their careers and contribute to the technological advancement of society.
          </p>
          <h2 className="about-subtitle">Our Vision</h2>
          <p className="about-text">
            To be the leading technology training institute, recognized globally for excellence in
            education, innovation, and producing industry-ready professionals.
          </p>

          <h2 className="about-subtitle">Our Instructors</h2>
          <div className="instructor-grid">
            {instructors.map((instructor, index) => (
              <div className="instructor-card" key={index}>
                <img 
                  src={instructor.image} 
                  alt={instructor.name}
                  className="instructor-image"
                  onError={(e) => {
                    e.target.src = '/images/default-instructor.jpg';
                  }}
                />
                <h3 className="instructor-name">{instructor.name}</h3>
                <p className="instructor-role">{instructor.role}</p>
                <p className="instructor-bio">{instructor.bio}</p>
              </div>
            ))}
          </div>

          <div className="about-grid">
            <div className="about-section">
              <h3 className="about-section-title">Our Values</h3>
              <ul className="about-list">
                <li>Excellence in Education</li>
                <li>Innovation and Creativity</li>
                <li>Practical Learning</li>
                <li>Student Success</li>
              </ul>
            </div>
            <div className="about-section">
              <h3 className="about-section-title">Our Approach</h3>
              <ul className="about-list">
                <li>Industry-Aligned Curriculum</li>
                <li>Hands-on Training</li>
                <li>Expert Mentorship</li>
                <li>Career Support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
