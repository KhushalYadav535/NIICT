import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Clock, ChevronRight, Heart, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import logoImg from '../assets/logo.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 1, title: 'About Us', href: '#about' },
    { id: 2, title: 'Courses', href: '#courses' },
    { id: 3, title: 'Admission', href: '#admission' },
    { id: 4, title: 'Results', href: '#results' },
    { id: 5, title: 'Contact', href: '#contact' },
    { id: 6, title: 'Blog', href: '#blog' }
  ];

  const courses = [
    { id: 1, title: 'Full Stack Development', href: '#courses' },
    { id: 2, title: 'Data Science', href: '#courses' },
    { id: 3, title: 'UI/UX Design', href: '#courses' },
    { id: 4, title: 'Mobile Development', href: '#courses' },
    { id: 5, title: 'Digital Marketing', href: '#courses' },
    { id: 6, title: 'Cloud Computing', href: '#courses' }
  ];

  const resources = [
    { id: 1, title: 'Student Portal', href: '#student-portal' },
    { id: 2, title: 'Study Materials', href: '#materials' },
    { id: 3, title: 'Career Guidance', href: '#career' },
    { id: 4, title: 'FAQs', href: '#faq' },
    { id: 5, title: 'Support', href: '#support' },
    { id: 6, title: 'Terms & Conditions', href: '#terms' }
  ];

  const socialLinks = [
    { id: 1, icon: <Facebook size={18} />, href: '#', label: 'Facebook' },
    { id: 2, icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
    { id: 3, icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
    { id: 4, icon: <Linkedin size={18} />, href: '#', label: 'LinkedIn' },
    { id: 5, icon: <Youtube size={18} />, href: '#', label: 'YouTube' }
  ];

  const contactInfo = [
    { id: 1, icon: <MapPin size={18} />, text: 'Janghai Station Road, Besides Nagrik Degree College, Janghai Jaunpur (U.P)' },
    { id: 2, icon: <Phone size={18} />, text: '+91 8182838680' },
    { id: 3, icon: <Mail size={18} />, text: 'niict01@gmail.com' },
    { id: 4, icon: <Clock size={18} />, text: 'Mon - Sat: 9:00 AM - 6:00 PM' }
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 relative overflow-hidden pt-10">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-100/50 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Premium Dark Cinematic Newsletter Section */}
        <div className="relative w-full rounded-[3rem] overflow-hidden mb-24 shadow-2xl border border-slate-800">
          {/* Dark Background */}
          <div className="absolute inset-0 bg-[#0A0F1C]"></div>
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 px-8 py-20 text-center flex flex-col items-center">
            <h3 className="font-display text-4xl md:text-5xl uppercase tracking-tight text-white mb-6 drop-shadow-md font-bold">
              Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Connected</span>
            </h3>
            <p className="text-slate-400 font-sans text-lg mb-10 max-w-2xl">
              Join our mailing list to receive the latest updates on new courses, exclusive workshops, and tech industry insights.
            </p>
            
            <form className="w-full max-w-xl relative flex items-center group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-full py-5 pl-8 pr-40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner backdrop-blur-md"
                required
              />
              <button type="submit" className="absolute right-2 inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold uppercase tracking-widest text-[11px] py-3.5 px-6 rounded-full hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300">
                <span>Subscribe</span>
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Brand Col */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-slate-200 p-2 flex items-center justify-center">
                <img src={logoImg} alt="NIICT Logo" className="w-full h-full object-contain rounded-xl" />
              </div>
              <div>
                <h4 className="font-display text-2xl font-bold tracking-tight text-slate-900">NIICT</h4>
                <p className="font-mono text-[10px] uppercase tracking-[2px] text-blue-600 font-bold">Tech Institute</p>
              </div>
            </div>
            <p className="text-slate-500 font-sans leading-relaxed mb-8">
              NIICT is a premier IT education institute committed to providing world-class training to students aspiring to build successful careers in the global technology industry.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Cols */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-lg uppercase tracking-wider font-bold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-sans font-medium text-[15px]">
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <span>{link.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display text-lg uppercase tracking-wider font-bold text-slate-900 mb-6">Premium Courses</h4>
            <ul className="space-y-4">
              {courses.map((course) => (
                <li key={course.id}>
                  <a href={course.href} className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-sans font-medium text-[15px]">
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <span>{course.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display text-lg uppercase tracking-wider font-bold text-slate-900 mb-6">Resources</h4>
            <ul className="space-y-4">
              {resources.map((resource) => (
                <li key={resource.id}>
                  <a href={resource.href} className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-sans font-medium text-[15px]">
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <span>{resource.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Contact Info Bar */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-12 shadow-[0_5px_15px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info) => (
              <div key={info.id} className="flex items-center gap-4 text-slate-600">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-blue-500 flex-shrink-0 border border-slate-100">
                  {info.icon}
                </div>
                <span className="text-[14px] font-medium font-sans">{info.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-200 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 font-sans text-sm text-center md:text-left">
            © {currentYear} NIICT. All rights reserved. Made with{' '}
            <Heart size={14} className="inline text-red-500 fill-red-500" />
            {' '}by NIICT Design Team.
          </p>
          
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[1px] font-bold text-slate-400">
            <a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;