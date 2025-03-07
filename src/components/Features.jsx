import React, { useState, useEffect } from 'react';
import { Monitor, Laptop, BookOpen, Users } from 'lucide-react';

const featureData = [
  {
    id: 1,
    icon: <Monitor size={24} />,
    text: 'Industry Expert Instructors',
  },
  {
    id: 2,
    icon: <Laptop size={24} />,
    text: 'Hands-on Project Experience',
  },
  {
    id: 3,
    icon: <BookOpen size={24} />,
    text: 'Comprehensive Study Material',
  },
  {
    id: 4,
    icon: <Users size={24} />,
    text: 'Placement Assistance',
  },
];

function Features() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <section className="features">
        <div className="loading">
          <div className="spinner"></div>
          Loading Features...
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
              <li className="feature-item" key={feature.id}>
                <span className="feature-icon">{feature.icon}</span>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Students learning"
          className="feature-image"
          loading="lazy"
        />
      </div>
    </section>
  );
}

export default Features;