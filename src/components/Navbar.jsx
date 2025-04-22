import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import { Menu } from '@headlessui/react';
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
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'materials', label: 'Course Materials', icon: '📚' },
    { id: 'schedule', label: 'Class Schedule', icon: '📅' },
    { id: 'progress', label: 'Progress Report', icon: '📊' }
  ];

  return (
    <header className={`header ${isScrolled ? 'shadow-lg' : ''}`}>
      <nav className="nav-container">
        <Link to="/" className="logo">
          <img src={logo} alt="NIICT Logo" className="logo-image" />
          <div className="logo-text-container">
            <div className="main-text-wrapper">
              <span className="logo-text">NIICT<sup className="trademark">TM</sup></span>
              {/* <span className="logo-subtext">एक विश्‍वास</span> */}
            </div>
          </div>
        </Link>

        <button 
          className="mobile-menu-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/')}`} onClick={handleMenuItemClick}>Home</Link>
          <Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={handleMenuItemClick}>About</Link>
          <Link to="/courses" className={`nav-link ${isActive('/courses')}`} onClick={handleMenuItemClick}>Courses</Link>
          <Link to="/admission" className={`nav-link ${isActive('/admission')}`} onClick={handleMenuItemClick}>Admission</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact')}`} onClick={handleMenuItemClick}>Contact</Link>

          <Menu as="div" className="dropdown">
            {({ open }) => (
              <>
                <Menu.Button className={`dropdown-button ${open ? 'active' : ''}`}>
                  Student Portal <ChevronDown className={`dropdown-icon ${open ? 'rotate' : ''}`} size={16} />
                </Menu.Button>
                <Menu.Items className={`dropdown-menu ${open ? 'open' : ''}`}>
                  <div className="dropdown-items">
                    {menuItems.map((item) => (
                      <Menu.Item key={item.id}>
                        {({ active }) => (
                          <Link
                            to={`/student-portal/${item.id}`}
                            className={`dropdown-item ${active ? 'active' : ''}`}
                            onClick={handleMenuItemClick}
                          >
                            <span className="item-icon">{item.icon}</span>
                            {item.label}
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