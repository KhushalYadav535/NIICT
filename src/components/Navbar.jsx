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
        { label: '🏆 Competition Result (2026-27)', path: '/results', isSpecial: true },
        { label: 'Semester Result', path: '/results' },
        { label: 'Final Result', path: '/results' },
        { label: 'Admit Card', path: '/admit-card' },
        { label: 'Verification', path: '/student-portal' },
      ]
    },
    { label: 'Results', path: '/results', badge: '2026-27 LIVE' },
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
                      <div className="absolute top-full left-0 mt-0 w-52 bg-white shadow-lg border border-gray-100 py-2 z-50 rounded-b-lg">
                        {item.dropdown.map((drop, di) => (
                          <Link
                            key={di}
                            to={drop.path}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              drop.isSpecial
                                ? 'text-emerald-700 font-bold bg-emerald-50/70 hover:bg-emerald-100/80 hover:text-emerald-800'
                                : 'text-gray-700 hover:text-[#d13030] hover:bg-gray-50'
                            }`}
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
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold transition-colors h-20 ${
                      isActive(item.path) ? 'text-[#d13030] border-b-2 border-[#d13030]' : 'text-gray-800 hover:text-[#d13030]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="relative flex items-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                        <span className="relative inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white tracking-wide shadow-sm">
                          {item.badge}
                        </span>
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}

            {/* Franchise Button */}
            <Link
              to="/franchise"
              className="ml-3 bg-[#245894] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#1a3f6a] transition-colors uppercase"
            >
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
                          <Link key={di} to={drop.path} className={`block px-4 py-2.5 text-sm rounded-md transition-colors ${
                            drop.isSpecial
                              ? 'text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100'
                              : 'text-gray-700 hover:text-[#d13030] hover:bg-gray-50'
                          }`}>
                            {drop.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link to={item.path} className={`flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-md ${
                    isActive(item.path) ? 'text-[#d13030] bg-gray-50' : 'text-gray-800 hover:text-[#d13030] hover:bg-gray-50'
                  }`}>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
            <div className="mt-3 space-y-2">
              <Link to="/results" className="block text-center bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-5 py-3 rounded-full text-sm font-black shadow-lg shadow-amber-500/25 transition-colors uppercase tracking-wide">
                🏆 Check Results (2026-27 LIVE)
              </Link>
              <Link to="/franchise" className="block text-center bg-[#245894] text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-[#1a3f6a] transition-colors uppercase">
                New Registration
              </Link>
              <Link to="/franchise-login" className="block text-center border border-[#245894] text-[#245894] px-5 py-3 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors uppercase">
                Center Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
