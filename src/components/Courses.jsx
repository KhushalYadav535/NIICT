import React, { useState, useEffect } from 'react';
import {
  Laptop,
  GraduationCap,
  MonitorSmartphone,
  Calculator,
  Printer,
  Clock,
  Users,
  Award,
  Calendar,
  ArrowRight
} from 'lucide-react';
import CourseModal from './CourseModal';
import './Courses.css';

const courses = [
  {
    id: 1,
    title: 'CCC - Course on Computer Concepts',
    description: 'Master the fundamentals of computers and essential software applications. Perfect for beginners looking to start their IT journey.',
    duration: '3 Months',
    level: 'Beginner',
    students: 1200,
    startDate: 'Monthly',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    syllabus: [
      { title: 'Module 1: Basic Computer Operations', description: 'Introduction to hardware, software, and operating systems.' },
      { title: 'Module 2: Word Processing', description: 'Creating and editing documents using a word processor.' },
      { title: 'Module 3: Spreadsheets', description: 'Working with data and performing calculations.' },
      { title: 'Module 4: Presentations', description: 'Designing and delivering effective presentations.' },
      { title: 'Module 5: Internet and Digital Literacy', description: 'Navigating the internet and understanding digital safety.' },
    ],
  },
  {
    id: 2,
    title: 'O Level - Foundation Level Course',
    description: 'Comprehensive program covering advanced computer applications, programming basics, and IT essentials.',
    duration: '12 Months',
    level: 'Intermediate',
    students: 800,
    startDate: 'Quarterly',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
    syllabus: [
      { title: 'Module 1: IT Tools and Network Basics', description: 'Understanding computer hardware, software, and networking fundamentals.' },
      { title: 'Module 2: Web Designing & Publishing', description: 'Creating static websites using HTML and CSS.' },
      { title: 'Module 3: Programming and Problem Solving through Python', description: 'Introduction to programming concepts using Python.' },
      { title: 'Module 4: Application of DBMS', description: 'Working with database management systems.' },
      { title: 'Module 5: Multimedia', description: 'Introduction to multimedia concepts and tools.' },
    ],
  },
  {
    id: 3,
    title: 'ADCA - Advanced Diploma',
    description: 'Advanced diploma program focusing on computer applications, web development, and software skills.',
    duration: '9 Months',
    level: 'Advanced',
    students: 600,
    startDate: 'Bi-monthly',
    image: 'https://images.unsplash.com/photo-1517504734587-2890819debab',
    syllabus: [
      { title: 'Module 1: Advanced Operating Systems', description: 'In-depth knowledge of operating system concepts and administration.' },
      { title: 'Module 2: Advanced Web Development', description: 'Front-end and back-end development using modern frameworks.' },
      { title: 'Module 3: Database Management Systems', description: 'Designing and managing complex databases.' },
      { title: 'Module 4: Software Engineering Principles', description: 'Understanding the software development lifecycle.' },
      { title: 'Module 5: Networking and Security', description: 'Advanced networking concepts and security measures.' },
    ],
  },
  {
    id: 4,
    title: 'DCA - Diploma in Computer Applications',
    description: 'Learn essential computer applications and gain practical skills for office and professional work.',
    duration: '6 Months',
    level: 'Intermediate',
    students: 950,
    startDate: 'Monthly',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    syllabus: [
      { title: 'Module 1: Computer Fundamentals', description: 'Basic concepts of computers and their applications.' },
      { title: 'Module 2: Operating System Basics', description: 'Working with a graphical user interface.' },
      { title: 'Module 3: Word Processing', description: 'Creating and formatting professional documents.' },
      { title: 'Module 4: Electronic Spreadsheets', description: 'Data analysis and manipulation using spreadsheets.' },
      { title: 'Module 5: Presentation Software', description: 'Creating and delivering engaging presentations.' },
      { title: 'Module 6: Introduction to Internet', description: 'Browsing the web and using email.' },
    ],
  },
  {
    id: 5,
    title: 'Tally with GST',
    description: 'Master Tally ERP 9 with GST implementation. Perfect for accounting professionals and business owners.',
    duration: '3 Months',
    level: 'Professional',
    students: 750,
    startDate: 'Monthly',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    syllabus: [
      { title: 'Module 1: Fundamentals of Accounting', description: 'Basic accounting principles and concepts.' },
      { title: 'Module 2: Introduction to Tally ERP 9', description: 'Navigating and setting up Tally.' },
      { title: 'Module 3: GST Concepts and Implementation', description: 'Understanding Goods and Services Tax.' },
      { title: 'Module 4: Recording Business Transactions', description: 'Entering various business transactions in Tally.' },
      { title: 'Module 5: Generating Reports', description: 'Creating and analyzing financial reports.' },
    ],
  },
  {
    id: 6,
    title: 'Web Development',
    description: 'Learn modern web development technologies including HTML, CSS, JavaScript, and popular frameworks.',
    duration: '6 Months',
    level: 'Advanced',
    students: 450,
    startDate: 'Quarterly',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    syllabus: [
      { title: 'Module 1: HTML5 and CSS3', description: 'Structuring and styling web pages.' },
      { title: 'Module 2: JavaScript Fundamentals', description: 'Adding interactivity to websites.' },
      { title: 'Module 3: Responsive Web Design', description: 'Creating websites that adapt to different screen sizes.' },
      { title: 'Module 4: Front-end Framework (React)', description: 'Building dynamic user interfaces with React.' },
      { title: 'Module 5: Back-end Basics (Node.js)', description: 'Introduction to server-side development with Node.js.' },
    ],
  },
];

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [filteredCourses, setFilteredCourses] = useState(courses);

  const handleCourseClick = (course) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedCourse(course);
      setIsModalOpen(true);
      setIsAnimating(false);
    }, 300);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => course.level.toLowerCase() === activeTab);
      setFilteredCourses(filtered);
    }
  }, [activeTab]);

  return (
    <>
      <div className="courses-container">
        <div className="section-title">
          <h2>Explore Our Professional Courses</h2>
          <p>Invest in your future with our expertly designed training programs.</p>
        </div>

        <div className="course-filter">
          <button
            className={`filter-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Courses
          </button>
          <button
            className={`filter-button ${activeTab === 'beginner' ? 'active' : ''}`}
            onClick={() => setActiveTab('beginner')}
          >
            Beginner
          </button>
          <button
            className={`filter-button ${activeTab === 'intermediate' ? 'active' : ''}`}
            onClick={() => setActiveTab('intermediate')}
          >
            Intermediate
          </button>
          <button
            className={`filter-button ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
          <button
            className={`filter-button ${activeTab === 'professional' ? 'active' : ''}`}
            onClick={() => setActiveTab('professional')}
          >
            Professional
          </button>
        </div>

        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`course-card ${isAnimating ? 'animating' : ''}`}
              onClick={() => handleCourseClick(course)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleCourseClick(course)}
            >
              <div className="course-image-container">
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-image"
                  loading="lazy"
                />
                <div className="course-image-overlay" />
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <div className="meta-item">
                    <Clock size={16} className="meta-icon" aria-hidden="true" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="meta-item">
                    <Users size={16} className="meta-icon" aria-hidden="true" />
                    <span>{course.students}+ students</span>
                  </div>
                </div>
                <div className="course-meta">
                  <div className="meta-item">
                    <Calendar size={16} className="meta-icon" aria-hidden="true" />
                    <span>Starts {course.startDate}</span>
                  </div>
                  <div className="meta-item">
                    <Award size={16} className="meta-icon" aria-hidden="true" />
                    <span>Level: {course.level}</span>
                  </div>
                </div>
                <div className="course-cta">
                  <button className="view-details-btn">
                    View Details <ArrowRight size={16} className="cta-icon" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default Courses;