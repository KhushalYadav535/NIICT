import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import { Menu } from '@headlessui/react';
import logo from '../assets/logo.jpg';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
        header.classList.add('shadow-lg');
      } else {
        header.classList.remove('shadow-lg');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleMenuItemClick = () => {
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 1000); // Delay closing the menu by 1000 milliseconds
  };

  return (
    <header className="header">
      <nav className="nav-container">
        <Link to="/" className="logo">
          <img src={logo} alt="NIICT Logo" className="logo-image" />
          <span>NIICT</span>
        </Link>

        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link to="/courses" className={`nav-link ${isActive('/courses')}`} onClick={() => setIsMobileMenuOpen(false)}>Courses</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>

          {/* Dropdown Menu */}
          <Menu as="div" className="dropdown">
            {({ open }) => (
              <>
                <Menu.Button className="dropdown-button">
                  Student Portal <ChevronDown size={16} />
                </Menu.Button>
                <Menu.Items className={`dropdown-menu ${open ? 'open' : ''}`}>
                  <div className="px-1 py-1">
                    {['Assignments', 'Course Materials', 'Class Schedule', 'Progress Report'].map((item, index) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <Link
                            to={`/student/${item.toLowerCase().replace(/ /g, '-')}`}
                            className={`dropdown-item ${active ? 'active' : ''}`}
                            onClick={handleMenuItemClick}
                          >
                            {item}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </>
            )}
          </Menu>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;