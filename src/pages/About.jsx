import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Users, 
  Target, 
  Eye, 
  Heart, 
  Lightbulb, 
  BookOpen, 
  GraduationCap,
  Star,
  ArrowRight,
  Quote,
  Sparkles,
  CheckCircle,
  Globe,
  Zap
} from 'lucide-react';
import rameshSir from '../assets/tutor1.jpeg';
import sksir from '../assets/sksir.jpg';
import schinSir from '../assets/sachinsir.png';
import hemantSir from '../assets/hemant.jpeg';
import deepakSir from '../assets/gauravsir.png';
import KhushalSir from '../assets/gaurav.jpg';

function About() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('mission');
  const [isVisible, setIsVisible] = useState(false);

  const instructors = [
    {
      name: 'Ramesh Sir',
      role: 'Director & Founder',
      bio: 'With over 10 years of experience in the IT industry, Ramesh Sir leads NIICT with a vision to transform education through innovation and practical learning. He is committed to fostering a supportive learning atmosphere that encourages students to explore their full potential.',
      image: rameshSir,
      expertise: ['Leadership', 'Innovation', 'Strategic Planning'],
      rating: 5,
      experience: '10+ Years'
    },
    {
      name: 'SK Sir',
      role: 'Senior Mentor',
      bio: 'SK Sir is a seasoned computer professional and mentor, specializing in Excel, Paint, and CorelDRAW. He focuses on data analysis with practical applications and real-world scenarios.',
      image: sksir,
      expertise: ['Excel', 'Data Analysis', 'CorelDRAW'],
      rating: 5,
      experience: '8+ Years'
    },
    {
      name: 'Deepak Sir',
      role: 'Programming Mentor',
      bio: 'Deepak Sir is a dedicated mentor with expertise in computer fundamentals and programming concepts. His teaching approach emphasizes practical learning and problem-solving skills.',
      image: deepakSir,
      expertise: ['Programming', 'Problem Solving', 'Computer Fundamentals'],
      rating: 5,
      experience: '7+ Years'
    },
    {
      name: 'Hemant Sir',
      role: 'English & Communication Mentor',
      bio: 'Hemant Sir is skilled in English Grammar and literature, inspiring students to communicate effectively and think critically. His expertise helps students develop strong language and communication skills.',
      image: hemantSir,
      expertise: ['English Grammar', 'Communication', 'Literature'],
      rating: 5,
      experience: '6+ Years'
    },
    {
      name: 'Sachin Sir',
      role: 'Computer Science Mentor',
      bio: 'Sachin Sir is an expert in fundamental computer science and programming, providing students with a strong foundation in these areas. His teaching methodology focuses on practical applications.',
      image: schinSir,
      expertise: ['Computer Science', 'Programming', 'Practical Applications'],
      rating: 5,
      experience: '9+ Years'
    },
    {
      name: 'Khushal Sir',
      role: 'Full Stack Development Expert',
      bio: 'Khushal Sir specializes in computer programming and software development. His expertise in various programming languages and modern development tools helps students master coding skills.',
      image: KhushalSir,
      expertise: ['Full Stack Development', 'Modern Tools', 'Software Development'],
      rating: 5,
      experience: '5+ Years'
    },
  ];

  const values = [
    {
      icon: <Award size={24} />,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of education and training.'
    },
    {
      icon: <Lightbulb size={24} />,
      title: 'Innovation',
      description: 'Embracing new technologies and creative teaching methodologies.'
    },
    {
      icon: <BookOpen size={24} />,
      title: 'Practical Learning',
      description: 'Hands-on experience with real-world projects and applications.'
    },
    {
      icon: <Heart size={24} />,
      title: 'Student Success',
      description: 'Your success is our priority. We\'re committed to your growth.'
    }
  ];

  const approaches = [
    {
      icon: <Target size={24} />,
      title: 'Industry-Aligned Curriculum',
      description: 'Our courses are designed to meet current industry standards and requirements.'
    },
    {
      icon: <Zap size={24} />,
      title: 'Hands-on Training',
      description: 'Learn by doing with practical exercises and real-world projects.'
    },
    {
      icon: <Users size={24} />,
      title: 'Expert Mentorship',
      description: 'Get guidance from experienced professionals in the field.'
    },
    {
      icon: <GraduationCap size={24} />,
      title: 'Career Support',
      description: 'Comprehensive support to help you achieve your career goals.'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Students Trained', icon: <Users size={20} /> },
    { number: '95%', label: 'Success Rate', icon: <CheckCircle size={20} /> },
    { number: '50+', label: 'Industry Partners', icon: <Globe size={20} /> },
    { number: '10+', label: 'Years Experience', icon: <Award size={20} /> }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="about-page"
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      {/* Hero Section */}
      <motion.section className="about-hero" variants={itemVariants}>
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <motion.div className="hero-text" variants={itemVariants}>
            <motion.h1 className="hero-title gradient-text">
              About NIICT
            </motion.h1>
            <motion.p className="hero-subtitle">
              Empowering Dreams Through Technology Education
            </motion.p>
            <motion.p className="hero-description">
              NIICT (Nihanshi Institute of Information and Computer Technology) is a premier institution 
              dedicated to empowering students with cutting-edge technology skills and knowledge. 
              We believe in transforming lives through quality education and practical learning.
            </motion.p>
          </motion.div>
          
          {/* Stats Section */}
          <motion.div className="stats-grid" variants={itemVariants}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card glass"
                variants={cardVariants}
                whileHover="hover"
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
              >
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <div className="stat-number gradient-text">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Mission & Vision Section */}
      <motion.section className="mission-vision-section" variants={itemVariants}>
        <div className="section-container">
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title gradient-text">Our Mission & Vision</h2>
            <p className="section-subtitle">
              Driving innovation and excellence in technology education
            </p>
          </motion.div>

          <div className="tabs-container">
            <div className="tabs-header">
              {[
                { id: 'mission', label: 'Mission', icon: <Target size={20} /> },
                { id: 'vision', label: 'Vision', icon: <Eye size={20} /> }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  variants={tabVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="tab-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === 'mission' && (
                  <div className="content-card glass">
                    <div className="content-icon">
                      <Target size={40} />
                    </div>
                    <h3 className="content-title">Our Mission</h3>
                    <p className="content-description">
                      To provide world-class IT education and training that enables our students to excel 
                      in their careers and contribute to the technological advancement of society. We are 
                      committed to fostering innovation, creativity, and practical skills that prepare 
                      students for the dynamic technology landscape.
                    </p>
                    <div className="mission-points">
                      <div className="point">
                        <CheckCircle size={20} />
                        <span>Quality Education</span>
                      </div>
                      <div className="point">
                        <CheckCircle size={20} />
                        <span>Practical Skills</span>
                      </div>
                      <div className="point">
                        <CheckCircle size={20} />
                        <span>Industry Relevance</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'vision' && (
                  <div className="content-card glass">
                    <div className="content-icon">
                      <Eye size={40} />
                    </div>
                    <h3 className="content-title">Our Vision</h3>
                    <p className="content-description">
                      To be the leading technology training institute, recognized globally for excellence 
                      in education, innovation, and producing industry-ready professionals. We envision 
                      a future where every student has access to world-class technology education and 
                      the opportunity to shape the digital world.
                    </p>
                    <div className="vision-points">
                      <div className="point">
                        <Star size={20} />
                        <span>Global Recognition</span>
                      </div>
                      <div className="point">
                        <Star size={20} />
                        <span>Innovation Hub</span>
                      </div>
                      <div className="point">
                        <Star size={20} />
                        <span>Industry Leadership</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Values & Approach Section */}
      <motion.section className="values-approach-section" variants={itemVariants}>
        <div className="section-container">
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title gradient-text">Our Values & Approach</h2>
            <p className="section-subtitle">
              The foundation of our success and your growth
            </p>
          </motion.div>

          <div className="values-approach-grid">
            <motion.div className="values-section" variants={itemVariants}>
              <h3 className="subsection-title">
                <Heart size={24} />
                Our Core Values
              </h3>
              <div className="values-grid">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    className="value-card glass"
                    variants={cardVariants}
                    whileHover="hover"
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="value-icon">
                      {value.icon}
                    </div>
                    <h4 className="value-title">{value.title}</h4>
                    <p className="value-description">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="approach-section" variants={itemVariants}>
              <h3 className="subsection-title">
                <Target size={24} />
                Our Teaching Approach
              </h3>
              <div className="approach-grid">
                {approaches.map((approach, index) => (
                  <motion.div
                    key={index}
                    className="approach-card glass"
                    variants={cardVariants}
                    whileHover="hover"
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="approach-icon">
                      {approach.icon}
                    </div>
                    <h4 className="approach-title">{approach.title}</h4>
                    <p className="approach-description">{approach.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Instructors Section */}
      <motion.section className="instructors-section" variants={itemVariants}>
        <div className="section-container">
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title gradient-text">Meet Our Expert Instructors</h2>
            <p className="section-subtitle">
              Learn from industry professionals with years of experience
            </p>
          </motion.div>

          <div className="instructors-grid">
            {instructors.map((instructor, index) => (
              <motion.div
                key={index}
                className={`instructor-card glass ${expandedIndex === index ? 'expanded' : ''}`}
                variants={cardVariants}
                whileHover="hover"
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <div className="instructor-image-container">
                  <img 
                    src={instructor.image} 
                    alt={instructor.name} 
                    className="instructor-image"
                    loading="lazy"
                  />
                  <div className="instructor-overlay">
                    <Sparkles size={24} />
                  </div>
                </div>
                
                <div className="instructor-content">
                  <div className="instructor-header">
                    <h3 className="instructor-name">{instructor.name}</h3>
                    <div className="instructor-rating">
                      {[...Array(instructor.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  
                  <p className="instructor-role">{instructor.role}</p>
                  <p className="instructor-experience">{instructor.experience} Experience</p>
                  
                  <div className="instructor-expertise">
                    {instructor.expertise.map((skill, skillIndex) => (
                      <span key={skillIndex} className="expertise-tag">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.div
                        className="instructor-bio"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Quote size={20} className="quote-icon" />
                        <p>{instructor.bio}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    className="expand-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight 
                      size={16} 
                      className={expandedIndex === index ? 'rotated' : ''} 
                    />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section className="about-cta" variants={itemVariants}>
        <div className="cta-container glass">
          <motion.div className="cta-content" variants={itemVariants}>
            <h2 className="cta-title gradient-text">
              Ready to Start Your Journey?
            </h2>
            <p className="cta-description">
              Join thousands of successful students who have transformed their careers with NIICT. 
              Take the first step towards your dream career in technology.
            </p>
            <motion.div className="cta-buttons">
              <motion.button
                className="cta-button primary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Courses</span>
                <ArrowRight size={20} />
              </motion.button>
              <motion.button
                className="cta-button secondary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Contact Us</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export default About;