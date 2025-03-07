import React, { useState, useEffect } from 'react';
import { Code, Database, Brain } from 'lucide-react';

const courseData = [
  {
    id: 1,
    title: 'Full Stack Development',
    description: 'Master both frontend and backend development with modern technologies',
    icon: <Code size={32} color="#2563eb" />,
  },
  {
    id: 2,
    title: 'Data Science',
    description: 'Learn data analysis, machine learning, and statistical modeling',
    icon: <Database size={32} color="#2563eb" />,
  },
  {
    id: 3,
    title: 'Artificial Intelligence',
    description: 'Explore AI, deep learning, and neural networks',
    icon: <Brain size={32} color="#2563eb" />,
  },
];

function Courses() {
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
      <section className="courses">
        <div className="loading">
          <div className="spinner"></div>
          Loading Courses...
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="courses">
      <div className="section-title">
        <h2>Our Professional Courses</h2>
        <p>Choose from our wide range of industry-relevant courses designed to launch your IT career</p>
      </div>
      <div className="courses-grid">
        {courseData.map((course) => (
          <div className="course-card" key={course.id}>
            <div className="course-icon">{course.icon}</div>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button className="btn btn-course">Learn More</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Courses;