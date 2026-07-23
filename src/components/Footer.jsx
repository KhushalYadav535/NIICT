import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-[#1a237e] text-white">
      <div className="footer-top py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Logo & About */}
            <div className="footer-contact">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  NI
                </div>
                <div>
                  <div className="font-bold text-xl">NIICT</div>
                  <div className="text-[10px] text-blue-200 uppercase tracking-widest">Nihanshi Institute</div>
                </div>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed text-justify">
                NIICT A Unit of <strong className="text-white">NIHANSHI DIGITAL EDUCATION INSTITUTE.</strong> Registered Under Ministry of Corporate Affairs Govt. of India. We are An ISO 9001:2015 Certified Educational Organization.
              </p>
            </div>

            {/* Useful Links */}
            <div className="footer-links">
              <h4 className="text-white font-bold text-lg mb-6">Useful Links</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Home', path: '/' },
                  { label: 'About us', path: '/about' },
                  { label: 'Courses', path: '/courses' },
                  { label: 'Contact', path: '/contact' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.path} className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
                      <ChevronRight size={14} className="text-white/50" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Courses */}
            <div className="footer-links">
              <h4 className="text-white font-bold text-lg mb-6">Our Courses</h4>
              <ul className="space-y-3">
                {[
                  'Certificate Courses',
                  'Diploma Courses',
                  'Vocational Training Courses',
                  'Beautician Courses',
                  'Additional Technical Courses',
                ].map((course, idx) => (
                  <li key={idx}>
                    <Link to="/courses" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
                      <ChevronRight size={14} className="text-white/50" />
                      {course}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other Links */}
            <div className="footer-links">
              <h4 className="text-white font-bold text-lg mb-6">Other Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
                    <ChevronRight size={14} className="text-white/50" />
                    Our Affiliations
                  </Link>
                </li>
                <li>
                  <Link to="/franchise" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
                    <ChevronRight size={14} className="text-white/50" />
                    Franchise Registration
                  </Link>
                </li>
                <li>
                  <Link to="/franchise-login" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
                    <ChevronRight size={14} className="text-white/50" />
                    Center Login
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
                    <ChevronRight size={14} className="text-white/50" />
                    Online Payment
                  </Link>
                </li>
                <li>
                  <Link to="/student-portal" className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm">
                    <ChevronRight size={14} className="text-white/50" />
                    Student Portal
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar - exactly like SDEI */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-blue-200 text-sm">
              &copy; Copyright {currentYear} <strong className="text-white">NIICT</strong>. All Rights Reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-blue-200">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-white/30">|</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
