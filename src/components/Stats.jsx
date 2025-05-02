import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Award, BookOpen } from 'lucide-react';

function Stats() {
  const stats = [
    {
      icon: <Users size={48} className="stat-icon-glow" />,
      value: 1000,
      suffix: "+",
      label: "Students Trained",
      description: "Join our growing community of successful graduates"
    },
    {
      icon: <Briefcase size={48} className="stat-icon-glow" />,
      value: 95,
      suffix: "%",
      label: "Placement Rate",
      description: "Our graduates secure positions in top companies"
    },
    {
      icon: <Award size={48} className="stat-icon-glow" />,
      value: 50,
      suffix: "+",
      label: "Corporate Partners",
      description: "Industry connections for better opportunities"
    },
    {
      icon: <BookOpen size={48} className="stat-icon-glow" />,
      value: 20,
      suffix: "+",
      label: "Professional Courses",
      description: "Cutting-edge curriculum for modern careers"
    }
  ];

  const [animatedValues, setAnimatedValues] = useState(stats.map(stat => 0));

  useEffect(() => {
    const duration = 2000; // Animation duration in ms
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setAnimatedValues(stats.map(stat => {
        return Math.floor(progress * stat.value);
      }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="section-header">
          <h2 className="section-title">Our Impact in Numbers</h2>
          <p className="section-subtitle">Quantifying our commitment to excellence in education</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card stat-card-animate" key={index}>
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {animatedValues[index]}
                  <span className="stat-suffix">{stat.suffix}</span>
                </h3>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-description">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;