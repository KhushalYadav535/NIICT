import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu as MenuIcon, X, User, BookOpen, GraduationCap, FileText, Calendar, BarChart3 } from 'lucide-react';
import { Menu } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.jpg';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { id: 'assignments', label: 'Assignments', icon: <FileText size={16} /> },
    { id: 'materials', label: 'Course Materials', icon: <BookOpen size={16} /> },
    { id: 'schedule', label: 'Class Schedule', icon: <Calendar size={16} /> },
    { id: 'progress', label: 'Progress Report', icon: <BarChart3 size={16} /> }
  ];

  // Sheryians-inspired animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const logoVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      height: 'auto',
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -8,
      scale: 0.98
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.98,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.header 
      className={`header ${isScrolled ? 'scrolled' : ''}`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <nav className="nav-container">
        {/* Logo - Sheryians style */}
        <motion.div
          variants={logoVariants}
          whileHover="hover"
        >
          <Link to="/" className="logo" onClick={handleMenuItemClick}>
            <motion.img 
              src={logo} 
              alt="NIICT Logo" 
              className="logo-image"
              whileHover={{ rotate: 2 }}
              transition={{ duration: 0.2 }}
            />
            <div className="logo-text-container">
              <span className="logo-text" style={{ color: '#FFD700' }}>NIICT<sup style={{ color: '#FFD700' }}>™</sup></span>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation - Sheryians style */}
        <div className="nav-links desktop-only">
          {[
            { path: '/', label: 'Home' },
            { path: '/courses', label: 'Courses' },
            { path: '/admission', label: 'Admission' },
            { path: '/competition', label: 'Competition' },
            { path: '/admit-card', label: 'Admit Card' },
            { path: '/contact', label: 'Contact' }
          ].map((item, i) => (
            <motion.div
              key={item.path}
              custom={i}
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link 
                to={item.path} 
                className={`nav-link ${isActive(item.path)}`} 
                onClick={handleMenuItemClick}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
          
          {/* Student Portal Dropdown - Sheryians style */}
          <motion.div
            custom={5}
            variants={menuItemVariants}
            initial="hidden"
            animate="visible"
            className="dropdown-container"
          >
            <Menu as="div" className="dropdown">
              {({ open }) => (
                <>
                  <Menu.Button className="dropdown-button">
                    <motion.div
                      className="dropdown-content"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Student Portal</span>
                      <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ChevronDown size={14} />
                      </motion.div>
                    </motion.div>
                  </Menu.Button>
                  
                  <AnimatePresence>
                    {open && (
                      <Menu.Items
                        as={motion.div}
                        className="dropdown-menu glass"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        static
                      >
                        {menuItems.map((item, i) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/student-portal/${item.id}`}
                                  className={`dropdown-item ${active ? 'active' : ''}`}
                                  onClick={handleMenuItemClick}
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="dropdown-item-content"
                                  >
                                    {item.icon}
                                    <span>{item.label}</span>
                                  </motion.div>
                                </Link>
                              )}
                            </Menu.Item>
                          </motion.div>
                        ))}
                      </Menu.Items>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Menu>
          </motion.div>

          {/* Sign In Button - Sheryians style */}
          <motion.div
            custom={6}
            variants={menuItemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link 
              to="/admin-login" 
              className="nav-link sign-in-button" 
              onClick={handleMenuItemClick}
            >
              <span>Sign In</span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Toggle - Sheryians style */}
        <motion.button 
          className="mobile-menu-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X size={20} className="menu-icon" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MenuIcon size={20} className="menu-icon" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Mobile Menu - Sheryians style */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="nav-links mobile-menu glass"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {[
                { path: '/', label: 'Home' },
                { path: '/courses', label: 'Courses' },
                { path: '/admission', label: 'Admission' },
                { path: '/competition', label: 'Competition' },
                { path: '/admit-card', label: 'Admit Card' },
                { path: '/contact', label: 'Contact' }
              ].map((item, i) => (
                <motion.div
                  key={item.path}
                  custom={i}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link 
                    to={item.path} 
                    className={`nav-link ${isActive(item.path)}`} 
                    onClick={handleMenuItemClick}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              {/* Mobile Student Portal Links */}
              <div className="mobile-portal-links">
                <h4 className="portal-title">Student Portal</h4>
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    custom={i + 5}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      to={`/student-portal/${item.id}`}
                      className="nav-link portal-link"
                      onClick={handleMenuItemClick}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Sign In */}
              <motion.div
                custom={9}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link 
                  to="/admin-login" 
                  className="nav-link sign-in-button mobile" 
                  onClick={handleMenuItemClick}
                >
                  <span>Sign In</span>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

export default Navbar;
