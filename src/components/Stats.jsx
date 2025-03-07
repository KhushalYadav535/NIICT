import React from 'react';

function Stats() {
  return (
    <section className="stats">
      <h2 className="stats-title">Our Achievements</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <h3>1000+</h3>
          <p>Students Trained</p>
        </div>
        <div className="stat-item">
          <h3>95%</h3>
          <p>Placement Rate</p>
        </div>
        <div className="stat-item">
          <h3>50+</h3>
          <p>Corporate Partners</p>
        </div>
        <div className="stat-item">
          <h3>20+</h3>
          <p>Professional Courses</p>
        </div>
      </div>
    </section>
  );
}

export default Stats;
