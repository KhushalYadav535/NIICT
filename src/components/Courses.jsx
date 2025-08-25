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
  ArrowRight,
  Star,
  Play,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';
import CourseModal from './CourseModal';
import { motion, AnimatePresence } from 'framer-motion';
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
    rating: 4.8,
    price: '₹5,000',
    originalPrice: '₹7,000',
    discount: '28% OFF',
    features: ['Live Classes', 'Certificate', 'Job Support', 'Lifetime Access'],
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
    description: 'Comprehensive foundation course covering computer fundamentals, programming basics, and digital literacy.',
    duration: '6 Months',
    level: 'Beginner',
    students: 850,
    startDate: 'Monthly',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    rating: 4.9,
    price: '₹8,000',
    originalPrice: '₹12,000',
    discount: '33% OFF',
    features: ['Live Classes', 'Certificate', 'Job Support', 'Lifetime Access'],
    syllabus: [
      { title: 'Module 1: Computer Fundamentals', description: 'Understanding computer architecture and basic operations.' },
      { title: 'Module 2: Programming Concepts', description: 'Introduction to programming logic and algorithms.' },
      { title: 'Module 3: Database Management', description: 'Working with databases and data management.' },
      { title: 'Module 4: Web Technologies', description: 'Introduction to HTML, CSS, and web development.' },
      { title: 'Module 5: Digital Marketing', description: 'Understanding digital marketing concepts and tools.' },
    ],
  },
  {
    id: 3,
    title: 'ADCA - Advanced Diploma in Computer Applications',
    description: 'Advanced diploma program covering comprehensive computer applications and software development.',
    duration: '12 Months',
    level: 'Intermediate',
    students: 650,
    startDate: 'Quarterly',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    rating: 4.7,
    price: '₹15,000',
    originalPrice: '₹20,000',
    discount: '25% OFF',
    features: ['Live Classes', 'Certificate', 'Job Support', 'Lifetime Access'],
    syllabus: [
      { title: 'Module 1: Advanced Programming', description: 'Advanced programming concepts and techniques.' },
      { title: 'Module 2: Database Design', description: 'Database design and management systems.' },
      { title: 'Module 3: Web Development', description: 'Full-stack web development with modern technologies.' },
      { title: 'Module 4: Software Engineering', description: 'Software development lifecycle and methodologies.' },
      { title: 'Module 5: Project Management', description: 'IT project management and team collaboration.' },
    ],
  },
  {
    id: 4,
    title: 'Full Stack Web Development',
    description: 'Complete web development course covering frontend, backend, and database technologies.',
    duration: '8 Months',
    level: 'Advanced',
    students: 450,
    startDate: 'Monthly',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    rating: 4.9,
    price: '₹25,000',
    originalPrice: '₹35,000',
    discount: '28% OFF',
    features: ['Live Classes', 'Certificate', 'Job Support', 'Lifetime Access'],
    syllabus: [
      { title: 'Module 1: Frontend Development', description: 'HTML, CSS, JavaScript, and modern frameworks.' },
      { title: 'Module 2: Backend Development', description: 'Server-side programming and API development.' },
      { title: 'Module 3: Database Integration', description: 'Database design and integration with applications.' },
      { title: 'Module 4: DevOps & Deployment', description: 'Deployment strategies and cloud platforms.' },
      { title: 'Module 5: Project Portfolio', description: 'Building real-world projects and portfolio development.' },
    ],
  },
  {
    id: 5,
    title: 'Data Science & Analytics',
    description: 'Learn data science, machine learning, and analytics to become a data-driven professional.',
    duration: '10 Months',
    level: 'Advanced',
    students: 320,
    startDate: 'Quarterly',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    rating: 4.8,
    price: '₹30,000',
    originalPrice: '₹40,000',
    discount: '25% OFF',
    features: ['Live Classes', 'Certificate', 'Job Support', 'Lifetime Access'],
    syllabus: [
      { title: 'Module 1: Data Fundamentals', description: 'Understanding data types, structures, and analysis.' },
      { title: 'Module 2: Statistical Analysis', description: 'Statistical methods and data interpretation.' },
      { title: 'Module 3: Machine Learning', description: 'Machine learning algorithms and applications.' },
      { title: 'Module 4: Data Visualization', description: 'Creating compelling data visualizations.' },
      { title: 'Module 5: Real-world Projects', description: 'Industry projects and case studies.' },
    ],
  },
  {
    id: 6,
    title: 'Digital Marketing & SEO',
    description: 'Master digital marketing strategies, SEO, and social media marketing for business growth.',
    duration: '6 Months',
    level: 'Intermediate',
    students: 580,
    startDate: 'Monthly',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    rating: 4.6,
    price: '₹12,000',
    originalPrice: '₹18,000',
    discount: '33% OFF',
    features: ['Live Classes', 'Certificate', 'Job Support', 'Lifetime Access'],
    syllabus: [
      { title: 'Module 1: Digital Marketing Fundamentals', description: 'Core concepts and digital marketing landscape.' },
      { title: 'Module 2: SEO & SEM', description: 'Search engine optimization and marketing strategies.' },
      { title: 'Module 3: Social Media Marketing', description: 'Social media platforms and marketing techniques.' },
      { title: 'Module 4: Content Marketing', description: 'Content strategy and creation for digital platforms.' },
      { title: 'Module 5: Analytics & ROI', description: 'Measuring performance and return on investment.' },
    ],
  },
];

const Courses = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [activeTab, setActiveTab] = useState('all');
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.courses-container');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

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

  // Removed the loading timer since we don't need it
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => course.level.toLowerCase() === activeTab);
      setFilteredCourses(filtered);
    }
  }, [activeTab]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hover: {
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Only show loading if actually loading (which we're not doing)
  if (loading) {
    return (
      <motion.section
        className="courses-container loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loading-content">
          <div className="spinner"></div>
          <p className="loading-text">Loading Premium Courses...</p>
        </div>
      </motion.section>
    );
  }

  return (
    <>
      <motion.section
        className={`courses-container ${isVisible ? 'visible' : ''}`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="section-title">
          <motion.div variants={itemVariants} className="title-decoration">
            <Sparkles size={24} color="#00d4ff" />
            <span>Premium Learning</span>
            <Sparkles size={24} color="#00d4ff" />
          </motion.div>
          <motion.h2 variants={itemVariants} className="gradient-text">
            Explore Our Professional Courses
          </motion.h2>
          <motion.p variants={itemVariants} className="section-subtitle">
            Invest in your future with our expertly designed training programs.
          </motion.p>
        </div>

        <motion.div 
          className="course-filter"
          variants={itemVariants}
        >
          <div className="filter-tabs">
            {[
              { id: 'all', label: 'All Courses', count: courses.length, icon: <TrendingUp size={16} /> },
              { id: 'beginner', label: 'Beginner', count: courses.filter(c => c.level === 'Beginner').length, icon: <Zap size={16} /> },
              { id: 'intermediate', label: 'Intermediate', count: courses.filter(c => c.level === 'Intermediate').length, icon: <GraduationCap size={16} /> },
              { id: 'advanced', label: 'Advanced', count: courses.filter(c => c.level === 'Advanced').length, icon: <Award size={16} /> }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="tab-icon">{tab.icon}</div>
                <span className="tab-label">{tab.label}</span>
                <span className="tab-count">{tab.count}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="courses-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="wait">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                className="course-card glass"
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleCourseClick(course)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="course-image">
                  <img src={course.image} alt={course.title} />
                  <div className="course-overlay">
                    <motion.button
                      className="play-button glass"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Play size={24} />
                    </motion.button>
                  </div>
                  <div className="course-badge">
                    <span className={`level-badge ${course.level.toLowerCase()}`}>
                      {course.level}
                    </span>
                  </div>
                  {course.discount && (
                    <div className="discount-badge">
                      <span className="discount-text">{course.discount}</span>
                    </div>
                  )}
                </div>

                <div className="course-content">
                  <div className="course-header">
                    <h3 className="course-title">{course.title}</h3>
                    <div className="course-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < Math.floor(course.rating) ? "#ffd700" : "none"}
                            color={i < Math.floor(course.rating) ? "#ffd700" : "#666"}
                          />
                        ))}
                      </div>
                      <span className="rating-text">{course.rating}</span>
                    </div>
                  </div>

                  <p className="course-description">{course.description}</p>

                  <div className="course-features">
                    {course.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="course-meta">
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="meta-item">
                      <Users size={16} />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{course.startDate}</span>
                    </div>
                  </div>

                  <div className="course-footer">
                    <div className="course-price">
                      <span className="current-price">{course.price}</span>
                      <span className="original-price">{course.originalPrice}</span>
                    </div>
                    <motion.button
                      className="enroll-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Enroll Now</span>
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.section>

      <CourseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        course={selectedCourse}
      />
    </>
  );
};

export default Courses;