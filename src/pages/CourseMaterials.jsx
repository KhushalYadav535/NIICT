import React from 'react';

const CourseMaterials = () => {
  return (
    <div className="animated-fade-in">
      <h2>Course Materials</h2>
      <div className="grid">
        <div className="card">
          <h3>React Fundamentals</h3>
          <p>PDF Lecture Notes</p>
        </div>
        <div className="card">
          <h3>Node.js Basics</h3>
          <p>Video Tutorials</p>
        </div>
      </div>
    </div>
  );
};

export default CourseMaterials;