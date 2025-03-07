import React from 'react';

function About() {
  const instructors = [
    {
      name: 'Ramesh Sir',
      role: 'Director',
      bio: 'With over 20 years of experience in the IT industry, Ramesh Sir leads NIICT with a vision to transform education through innovation and practical learning.',
    },
    {
      name: 'SK Sir',
      role: 'Mentor',
      bio: 'SK Sir is a seasoned software engineer and mentor, specializing in full-stack development and helping students build real-world projects.',
    },
    {
      name: 'Schin Sir',
      role: 'Mentor',
      bio: 'Schin Sir is an expert in data science and AI, guiding students to master cutting-edge technologies and excel in their careers.',
    },
  ];

  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">About NIICT</h1>
        <div className="about-card">
          <p className="about-text">
            NIICT (National Institute of Information and Communication Technology) is a premier institution
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