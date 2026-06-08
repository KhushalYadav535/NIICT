import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isHome = location.pathname === '/';
  const textColor = isHome && !isScrolled ? 'text-white' : 'text-slate-900';
  const logoColor = isHome && !isScrolled ? 'text-cyan-400' : 'text-primary';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1030] h-[56px] flex items-center justify-between px-6 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'}`}>
        
        {/* Left: Menu Toggle */}
        <button 
          onClick={toggleMenu}
          className={`font-mono text-[12px] uppercase tracking-[2px] hover:text-primary transition-colors font-bold ${textColor}`}
        >
          {isMenuOpen ? 'CLOSE' : 'MENU'}
        </button>

        {/* Center: Wordmark */}
        <Link 
          to="/" 
          className={`font-display text-[16px] font-bold uppercase tracking-[6px] absolute left-1/2 -translate-x-1/2 drop-shadow-sm ${logoColor}`}
        >
          NIICT
        </Link>

        {/* Right: Portal/Admin */}
        <div className="flex gap-6">
          <Link 
            to="/student-portal" 
            className={`font-mono text-[12px] uppercase tracking-[2px] hover:text-primary hidden md:block font-bold ${textColor}`}
          >
            PORTAL
          </Link>
          <Link 
            to="/admin-login" 
            className={`font-mono text-[12px] uppercase tracking-[2px] hover:text-primary font-bold ${textColor}`}
          >
            ADMIN
          </Link>
        </div>
      </nav>

      {/* Fullscreen Minimal Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[1020] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-10">
            <Link to="/" className="font-display text-[32px] tracking-[3px] text-slate-900 hover:text-primary uppercase" onClick={toggleMenu}>Home</Link>
            <Link to="/about" className="font-display text-[32px] tracking-[3px] text-slate-900 hover:text-primary uppercase" onClick={toggleMenu}>About</Link>
            <Link to="/courses" className="font-display text-[32px] tracking-[3px] text-slate-900 hover:text-primary uppercase" onClick={toggleMenu}>Courses</Link>
            <Link to="/admission" className="font-display text-[32px] tracking-[3px] text-slate-900 hover:text-primary uppercase" onClick={toggleMenu}>Admission</Link>
            <Link to="/results" className="font-display text-[32px] tracking-[3px] text-slate-900 hover:text-primary uppercase" onClick={toggleMenu}>Results</Link>
            <Link to="/contact" className="font-display text-[32px] tracking-[3px] text-slate-900 hover:text-primary uppercase" onClick={toggleMenu}>Contact</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
