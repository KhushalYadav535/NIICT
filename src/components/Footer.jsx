import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

function Footer() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.footer 
      className="footer"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="footer-background">
        <div className="footer-overlay"></div>
      </div>
      
      <div className="footer-content">
        <div className="footer-grid">
          {/* Company Info */}
          <motion.div 
            className="footer-section company-info"
            custom={0}
            variants={itemVariants}
          >
            <div className="footer-logo">
              <h3 className="gradient-text">NIICT</h3>
              <p className="company-tagline">Computer Training Institute</p>
            </div>
            <p className="company-description">
              Transform your career with expert IT training. Join 1000+ successful students who found their dream jobs through NIICT.
            </p>
            <div className="social-links">
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaFacebook size={20} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTwitter size={20} />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaLinkedin size={20} />
              </motion.a>
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaInstagram size={20} />
              </motion.a>
              <motion.a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaYoutube size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="footer-section"
            custom={1}
            variants={itemVariants}
          >
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">About</Link>
              </li>
              <li>
                <Link to="/courses" className="footer-link">Courses</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact</Link>
              </li>
              <li>
                <Link to="/admission" className="footer-link">Admission</Link>
              </li>
              <li>
                <Link to="/competition" className="footer-link">GK & Computer Competition</Link>
              </li>
              <li>
                <Link to="/admit-card" className="footer-link">Admit Card</Link>
              </li>
            </ul>
          </motion.div>

          {/* Popular Courses */}
          <motion.div 
            className="footer-section"
            custom={2}
            variants={itemVariants}
          >
            <h4 className="footer-title">Popular Courses</h4>
            <ul className="footer-links">
              <li>
                <Link to="/courses" className="footer-link">Full Stack Development</Link>
              </li>
              <li>
                <Link to="/courses" className="footer-link">Data Science</Link>
              </li>
              <li>
                <Link to="/courses" className="footer-link">Artificial Intelligence</Link>
              </li>
              <li>
                <Link to="/courses" className="footer-link">Cloud Computing</Link>
              </li>
              <li>
                <Link to="/courses" className="footer-link">Web Development</Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="footer-section"
            custom={3}
            variants={itemVariants}
          >
            <h4 className="footer-title">Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">Phone:</span>
                <a href="tel:+918182838680" className="contact-link">+91 8182838680</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <a href="mailto:niict01@gmail.com" className="contact-link">niict01@gmail.com</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Address:</span>
                <p className="contact-text">
                  Janghai Station Road, Besides Nagrik Degree College, Janghai Jaunpur (U.P)
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div 
          className="footer-bottom"
          custom={4}
          variants={itemVariants}
        >
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} NIICT. All rights reserved. | Computer Training Institute
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
              <Link to="/sitemap" className="footer-bottom-link">Sitemap</Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            className="scroll-to-top-button glass"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <FaArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.footer>
  );
}

export default Footer;