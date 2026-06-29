import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import niictLogo from '../assets/logo.jpg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Courses', path: '/courses' },
    { label: 'Affiliations', path: '/about' },
    {
      label: 'Student',
      dropdown: [
        { label: 'Semester Result', path: '/results' },
        { label: 'Final Result', path: '/results' },
        { label: 'Verification', path: '/student-portal' },
      ]
    },
    {
      label: 'Online Exam',
      dropdown: [
        { label: 'Test Paper', path: '/student-portal' },
        { label: 'Semester Exam', path: '/student-portal' },
        { label: 'Final Exam', path: '/student-portal' },
      ]
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav ref={dropdownRef} className={`sticky top-0 z-[1030] transition-all duration-300 bg-white shadow-sm`}>
      {/* Top gradient border like SDEI */}
      <div className="h-1 bg-gradient-to-r from-purple-700 via-pink-600 to-orange-500"></div>
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Left Logo & Name - NIICT */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={niictLogo} 
              alt="NIICT Logo" 
              className="h-20"
            />
            <div className="flex flex-col">
              <span className="text-[#245894] font-bold text-xl tracking-wide">NIICT</span>
              <span className="text-gray-600 text-xs uppercase tracking-wider">Nihanshi Institute of Information &amp; Computer Technology</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0">
            {navItems.map((item, idx) => (
              <div key={idx} className="relative">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold transition-colors h-20 ${
                        openDropdown === idx ? 'text-[#d13030]' : 'text-gray-800 hover:text-[#d13030]'
                      }`}
                    >
                      {item.label}
                      <ChevronDown size={12} className={`transition-transform ${openDropdown === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === idx && (
                      <div className="absolute top-full left-0 mt-0 w-48 bg-white shadow-lg border border-gray-100 py-2 z-50 rounded-b-lg">
                        {item.dropdown.map((drop, di) => (
                          <Link
                            key={di}
                            to={drop.path}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#d13030] hover:bg-gray-50 transition-colors"
                          >
                            {drop.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors h-20 ${
                      isActive(item.path) ? 'text-[#d13030] border-b-2 border-[#d13030]' : 'text-gray-800 hover:text-[#d13030]'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Franchise Button - like SDEI */}
            <Link to="/franchise" className="ml-3 bg-[#245894] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#1a3f6a] transition-colors uppercase">
              Franchise
            </Link>
          </div>



          {/* Mobile menu button */}
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 text-gray-800 hover:text-[#d13030]">
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item, idx) => (
              <div key={idx}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm font-semibold text-gray-800 hover:text-[#d13030] hover:bg-gray-50 rounded-md"
                    >
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform ${openDropdown === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === idx && (
                      <div className="pl-4 space-y-1 pb-2">
                        {item.dropdown.map((drop, di) => (
                          <Link key={di} to={drop.path} className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#d13030] hover:bg-gray-50 rounded-md">
                            {drop.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={item.path} className={`block px-4 py-3 text-sm font-semibold rounded-md ${
                    isActive(item.path) ? 'text-[#d13030] bg-gray-50' : 'text-gray-800 hover:text-[#d13030] hover:bg-gray-50'
                  }`}>
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link to="/franchise" className="block text-center bg-[#245894] text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-[#1a3f6a] transition-colors mt-3 uppercase">
              Franchise
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
