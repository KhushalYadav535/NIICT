import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  GraduationCap, 
  MonitorSmartphone, 
  Calculator, 
  Printer, 
  Globe, 
  PenTool, 
  Database,
  BookOpen 
} from 'lucide-react';

const courseData = [
  {
    id: 1,
    title: 'CCC',
    description: 'Course on Computer Concepts - Foundation course for computer literacy',
    icon: <Laptop size={32} color="#2563eb" />,
    duration: '3 Months'
  },
  {
    id: 2,
    title: 'O Level',
    description: 'Advanced diploma in computer applications and programming',
    icon: <GraduationCap size={32} color="#2563eb" />,
    duration: '1 Year'
  },
  {
    id: 3,
    title: 'ADCA',
    description: 'Advanced Diploma in Computer Applications',
    icon: <MonitorSmartphone size={32} color="#2563eb" />,
    duration: '1 Year'
  },
  {
    id: 4,
    title: 'Tally',
    description: 'Complete accounting and business management software training',
    icon: <Calculator size={32} color="#2563eb" />,
    duration: '3 Months'
  },
  {
    id: 5,
    title: 'DTP',
    description: 'Desktop Publishing - Master document design and printing',
    icon: <Printer size={32} color="#2563eb" />,
    duration: '6 Months'
  },
  {
    id: 6,
    title: 'Web Designing',
    description: 'Learn to create modern and responsive websites',
    icon: <Globe size={32} color="#2563eb" />,
    duration: '6 Months'
  },
  {
    id: 7,
    title: 'Graphic Designing',
    description: 'Master digital art and creative design skills',
    icon: <PenTool size={32} color="#2563eb" />,
    duration: '6 Months'
  },
  {
    id: 8,
    title: 'DIT',
    description: 'Diploma in Information Technology',
    icon: <Database size={32} color="#2563eb" />,
    duration: '1 Year'
  },
  {
    id: 9,
    title: 'PGDCA',
    description: 'Post Graduate Diploma in Computer Applications',
    icon: <BookOpen size={32} color="#2563eb" />,
    duration: '1 Year'
  }
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
        <p>Comprehensive IT training programs to advance your career</p>
      </div>
      <div className="courses-grid">
        {courseData.map((course) => (
          <div className="course-card" key={course.id}>
            <div className="course-icon">{course.icon}</div>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className="course-footer">
              <span className="course-duration">Duration: {course.duration}</span>
              <button className="btn btn-course">Learn More</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Courses;