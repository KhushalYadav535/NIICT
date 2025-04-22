import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube} from 'react-icons/fa';
//import './Footer.css'; // Import your CSS file

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

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Popular Courses</h3>
          <ul className="footer-links">
            <li><Link to="/courses/fullstack">Full Stack Development</Link></li>
            <li><Link to="/courses/datascience">Data Science</Link></li>
            <li><Link to="/courses/ai">Artificial Intelligence</Link></li>
            <li><Link to="/courses/cloud">Cloud Computing</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul className="footer-links">
            <li>Phone: +91 8182838680</li>
            <li>Email: niict01@gmail.com</li>
            <li>Address: Janghai Station Road , Besides Nagrik Degree College, Janghai Jaunpur (U.P)</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <ul className="footer-links social-links">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
                Facebook
              </a>
            </li>
            <li>
              <a href="https://YouTube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube />
                YouTube
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 NIICT. All rights reserved.</p>
      </div>

      {/* Back to Top Button */}
      <div
        className={`back-to-top ${showButton ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </div>
    </footer>
  );
}

export default Footer;