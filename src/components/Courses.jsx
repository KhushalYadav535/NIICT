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
  BookOpen,
  ChevronRight,
  Clock,
  ArrowRight
} from 'lucide-react';

const courseData = [
  {
    id: 1,
    title: 'CCC',
    description: 'Course on Computer Concepts - Foundation course for computer literacy',
    icon: <Laptop size={32} color="#2563eb" />,
    duration: '3 Months',
    features: ['Basic computer operations', 'Internet fundamentals', 'Productivity tools'],
    popular: true
  },
  {
    id: 2,
    title: 'O Level',
    description: 'Advanced diploma in computer applications and programming',
    icon: <GraduationCap size={32} color="#2563eb" />,
    duration: '1 Year',
    features: ['Programming fundamentals', 'Database concepts', 'Web technologies'],
    popular: false
  },
  {
    id: 3,
    title: 'ADCA',
    description: 'Advanced Diploma in Computer Applications',
    icon: <MonitorSmartphone size={32} color="#2563eb" />,
    duration: '1 Year',
    features: ['Office automation', 'Financial accounting', 'Web design basics'],
    popular: true
  },
  {
    id: 4,
    title: 'Tally',
    description: 'Complete accounting and business management software training',
    icon: <Calculator size={32} color="#2563eb" />,
    duration: '3 Months',
    features: ['GST computation', 'Inventory management', 'Financial reports'],
    popular: false
  },
  {
    id: 5,
    title: 'DTP',
    description: 'Desktop Publishing - Master document design and printing',
    icon: <Printer size={32} color="#2563eb" />,
    duration: '6 Months',
    features: ['Adobe Photoshop', 'CorelDRAW', 'Print preparation'],
    popular: false
  },
  {
    id: 6,
    title: 'Web Designing',
    description: 'Learn to create modern and responsive websites',
    icon: <Globe size={32} color="#2563eb" />,
    duration: '6 Months',
    features: ['HTML5 & CSS3', 'JavaScript basics', 'Responsive design'],
    popular: true
  },
  {
    id: 7,
    title: 'Graphic Designing',
    description: 'Master digital art and creative design skills',
    icon: <PenTool size={32} color="#2563eb" />,
    duration: '6 Months',
    features: ['Adobe Illustrator', 'Logo design', 'Brand identity'],
    popular: false
  },
  {
    id: 8,
    title: 'DIT',
    description: 'Diploma in Information Technology',
    icon: <Database size={32} color="#2563eb" />,
    duration: '1 Year',
    features: ['Networking basics', 'System administration', 'IT security'],
    popular: false
  },
  {
    id: 9,
    title: 'PGDCA',
    description: 'Post Graduate Diploma in Computer Applications',
    icon: <BookOpen size={32} color="#2563eb" />,
    duration: '1 Year',
    features: ['Advanced programming', 'DBMS', 'Software engineering'],
    popular: true
  }
];

function Courses() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredCourses = activeTab === 'all' 
    ? courseData 
    : courseData.filter(course => course.popular);

  if (loading) {
    return (
      <section className="courses">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading Courses...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="courses">
      <div className="section-title">
        <h2>Our Professional Courses</h2>
        <p>Comprehensive IT training programs to advance your career</p>
        
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Courses
          </button>
          <button 
            className={`tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
            onClick={() => setActiveTab('popular')}
          >
            Popular Courses
          </button>
        </div>
      </div>
      
      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div 
            className={`course-card ${course.popular ? 'popular' : ''}`}
            key={course.id}
            onMouseEnter={() => setHoveredCard(course.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {course.popular && (
              <div className="popular-badge">
                <span>Popular</span>
              </div>
            )}
            
            <div className={`course-icon ${hoveredCard === course.id ? 'hover' : ''}`}>
              {course.icon}
            </div>
            
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            
            <div className="course-features">
              {course.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="feature">
                  <ChevronRight size={16} color="#2563eb" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="course-footer">
              <div className="duration">
                <Clock size={16} />
                <span>{course.duration}</span>
              </div>
              <button className="btn btn-course">
                Learn More <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Courses;