import React, { useState, useEffect } from 'react';
import rameshSir from '../assets/tutor1.jpeg';
import sksir from '../assets/sksir.jpg';
import schinSir from '../assets/sachinsir.png';
import hemantSir from '../assets/hemantsir.png';
import deepakSir from '../assets/gauravsir.png';
import KhushalSir from '../assets/gaurav.jpg';

function About() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [visibleSections, setVisibleSections] = useState({
    mission: false,
    vision: false,
    instructors: false,
    values: false,
    approach: false,
  });

  const instructors = [
    {
      name: 'Ramesh Sir',
      role: 'Director',
      bio: 'With over 10 years of experience in the IT industry, Ramesh Sir leads NIICT with a vision to transform education through innovation and practical learning. He is committed to fostering a supportive learning atmosphere that encourages students to explore their full potential.',
      image: rameshSir,
    },
    {
      name: 'SK Sir',
      role: 'Mentor',
      bio: 'SK Sir is a seasoned computer professional and mentor, specializing in Excel, Paint, and CorelDRAW. He focuses on data analysis with practical applications and real-world scenarios.',
      image: sksir,
    },
    {
      name: 'Sachin Sir',
      role: 'Mentor',
      bio: 'Sachin Sir is an expert in fundamental computer science and programming, providing students with a strong foundation in these areas.',
      image: schinSir,
    },
    {
      name: 'Hemant Sir',
      role: 'Mentor',
      bio: 'Hemant Sir is skilled in English Grammar and literature, inspiring students to communicate effectively and think critically.',
      image: hemantSir,
    },
    {
      name: 'Deepak Sir',
      role: 'Mentor',
      bio: 'Deepak Sir is a cybersecurity expert, helping students develop the skills to protect systems and networks from cyber threats.',
      image: deepakSir,
    },
    {
      name: 'Khushal Sir',
      role: 'Mentor',
      bio: 'Khushal Sir is skilled in computer science and programming, providing students with a strong foundation in these areas.',
      image: KhushalSir,
    },
  ];

  const toggleBio = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  // Intersection Observer to add fade-in animation on scroll
  useEffect(() => {
    const sections = ['mission', 'vision', 'instructors', 'values', 'approach'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.dataset.section]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => {
      const element = document.querySelector(`[data-section="${section}"]`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-container">
      <div className="about-content">
        <h1 className="about-title">About NIICT</h1>
        <p className="about-description">
          NIICT (Nihanshi Institute of Information and Computer Technology) is a premier institution dedicated to empowering students with cutting-edge technology skills and knowledge.
        </p>

        <div
          className={`mission-vision-section fade-in ${visibleSections.mission ? 'visible' : ''}`}
          data-section="mission"
        >
          <div className="mission">
            <h2 className="section-title">Our Mission</h2>
            <p>To provide world-class IT education and training that enables our students to excel in their careers and contribute to the technological advancement of society.</p>
          </div>
          <div
            className={`vision fade-in ${visibleSections.vision ? 'visible' : ''}`}
            data-section="vision"
          >
            <h2 className="section-title">Our Vision</h2>
            <p>To be the leading technology training institute, recognized globally for excellence in education, innovation, and producing industry-ready professionals.</p>
          </div>
        </div>

        <h2
          className={`instructors-title fade-in ${visibleSections.instructors ? 'visible' : ''}`}
          data-section="instructors"
        >
          Meet Our Instructors
        </h2>
        <div className="instructor-grid">
          {instructors.map((instructor, index) => (
            <div
              className={`instructor-card ${expandedIndex === index ? 'expanded' : ''}`}
              key={index}
              onClick={() => toggleBio(index)}
              tabIndex={0}
              role="button"
              aria-expanded={expandedIndex === index}
              aria-label={`Toggle bio for ${instructor.name}`}
            >
              <img src={instructor.image} alt={instructor.name} className="instructor-image" />
              <h3 className="instructor-name">{instructor.name}</h3>
              <p className="instructor-role">{instructor.role}</p>
              <p className={`instructor-bio ${expandedIndex === index ? 'expanded' : ''}`}>
                {instructor.bio}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`values-approach-section fade-in ${visibleSections.values ? 'visible' : ''}`}
          data-section="values"
        >
          <div className="values">
            <h3 className="section-title">Our Values</h3>
            <ul>
              <li>Excellence in Education</li>
              <li>Innovation and Creativity</li>
              <li>Practical Learning</li>
              <li>Student Success</li>
            </ul>
          </div>
          <div
            className={`approach fade-in ${visibleSections.approach ? 'visible' : ''}`}
            data-section="approach"
          >
            <h3 className="section-title">Our Approach</h3>
            <ul>
              <li>Industry-Aligned Curriculum</li>
              <li>Hands-on Training</li>
              <li>Expert Mentorship</li>
              <li>Career Support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;