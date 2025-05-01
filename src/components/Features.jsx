import React, { useState, useEffect } from 'react';
import { Monitor, Laptop, BookOpen, Users, Award, Rocket, Globe, Lightbulb, ShieldCheck } from 'lucide-react';

const featureData = [
  {
    id: 1,
    icon: <Monitor size={28} />,
    title: 'Industry Expert Instructors',
    text: 'Learn from seasoned professionals with real-world experience.',
  },
  {
    id: 2,
    icon: <Laptop size={28} />,
    title: 'Hands-on Project Experience',
    text: 'Build a strong portfolio through practical, industry-relevant projects.',
  },
  {
    id: 3,
    icon: <BookOpen size={28} />,
    title: 'Comprehensive Study Material',
    text: 'Access well-structured resources designed for effective learning.',
  },
  {
    id: 4,
    icon: <Users size={28} />,
    title: 'Placement Assistance',
    text: 'Get dedicated support to kickstart your career after graduation.',
  },
  {
    id: 5,
    icon: <Award size={28} />,
    title: 'Globally Recognized Certification',
    text: 'Receive a certification recognized by leading organizations worldwide.',
  },
  {
    id: 6,
    icon: <Rocket size={28} />,
    title: 'Accelerated Career Growth',
    text: 'Acquire in-demand skills that fast-track your professional journey.',
  },
  {
    id: 7,
    icon: <Globe size={28} />,
    title: 'Global Networking Opportunities',
    text: 'Connect with a diverse community of learners and industry professionals.',
  },
  {
    id: 8,
    icon: <Lightbulb size={28} />,
    title: 'Innovative Learning Platform',
    text: 'Engage with cutting-edge tools and resources for an immersive learning experience.',
  },
  {
    id: 9,
    icon: <ShieldCheck size={28} />,
    title: 'Dedicated Support System',
    text: 'Receive continuous guidance and support from our experienced faculty and staff.',
  },
];

function Features() {
  const [loading, setLoading] = useState(true);
  const [activeFeature, setActiveFeature] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleFeatureHover = (id) => {
    setActiveFeature(id);
  };

  if (loading) {
    return (
      <section className="features">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Features...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="features" className="features">
      <div className="features-grid">
        <div className="features-content">
          <h2>Why Choose NIICT?</h2>
          <ul className="feature-list">
            {featureData.map((feature) => (
              <li
                className={`feature-item ${activeFeature === feature.id ? 'active' : ''}`}
                key={feature.id}
                onMouseEnter={() => handleFeatureHover(feature.id)}
              >
                <span className="feature-icon">{feature.icon}</span>
                <div className="feature-text-container">
                  <h3 className="feature-title">{feature.title}</h3>
                  <span className="feature-text">{feature.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="features-image-container">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Students learning"
            className="feature-image"
            loading="lazy"
          />
          <div className="feature-image-overlay" />
        </div>
      </div>
    </section>
  );
}

export default Features;