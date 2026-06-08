import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Award, BookOpen, Users, Target, TrendingUp, Clock, Globe, Shield, Heart, Star, ChevronRight, ChevronLeft, Play, CheckCircle, Zap, Lightbulb, Rocket, Milestone } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const [activeInstructorIndex, setActiveInstructorIndex] = useState(2);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const missionVision = [
    {
      id: 'mission',
      title: 'Our Mission',
      content: 'To provide world-class IT education that empowers students with cutting-edge skills and knowledge, enabling them to excel in the rapidly evolving technology landscape and contribute meaningfully to the digital economy.',
      icon: <Target size={24} />
    },
    {
      id: 'vision',
      title: 'Our Vision',
      content: 'To become the leading IT education institute in India, recognized for our innovative teaching methods, industry-relevant curriculum, and outstanding student success stories.',
      icon: <Lightbulb size={24} />
    },
    {
      id: 'values',
      title: 'Our Values',
      content: 'Excellence, Innovation, Integrity, Student Success, Continuous Learning, and Industry Partnership. We believe in creating a learning environment that fosters growth and creativity.',
      icon: <Heart size={24} />
    }
  ];

  const timeline = [
    { year: '2008', title: 'The Inception', description: 'NIICT was founded with a singular vision to democratize elite tech education and bridge the gap between academia and industry.' },
    { year: '2012', title: 'First 1000 Placements', description: 'Crossed the major milestone of 1000 successful corporate placements, solidifying our reputation in the IT sector.' },
    { year: '2015', title: 'Advanced Tech Campus', description: 'Launched our modern tech campus equipped with cutting-edge robotics, networking, and software engineering labs.' },
    { year: '2020', title: 'Global Curriculum Integration', description: 'Partnered with international tech giants like Microsoft and Google to completely redesign our core curriculum.' },
    { year: '2024', title: 'Pioneering Agentic AI', description: 'Introduced the nation\'s first dedicated comprehensive curriculum for Agentic AI, Autonomous Agents, and LLMs.' }
  ];

  const achievements = [
    { id: 1, number: '10,000+', label: 'Successful Alumni', icon: <Users size={32} />, description: 'Graduates dominating the global tech industry' },
    { id: 2, number: '95%', label: 'Placement Rate', icon: <TrendingUp size={32} />, description: 'Secured careers within 6 months of graduation' },
    { id: 3, number: '50+', label: 'Corporate Partners', icon: <Award size={32} />, description: 'Direct hiring tie-ups with Fortune 500s' },
    { id: 4, number: '15+', label: 'Years of Excellence', icon: <Star size={32} />, description: 'Unwavering commitment to quality education' }
  ];

  const instructors = [
    {
      id: 1,
      name: 'Ramesh Kumar',
      role: 'Founder & CEO',
      expertise: ['Full Stack Development', 'Cloud Architecture', 'DevOps'],
      experience: '15+ years',
      image: '/src/assets/tutor1.jpeg',
      bio: 'With over 10 years of experience in the IT industry, Ramesh Sir leads NIICT with a vision to transform education through innovation and practical learning. He is committed to fostering a supportive learning atmosphere that encourages students to explore their full potential',
      education: 'Ph.D. in Computer Science, MIT',
      achievements: ['Published 20+ research papers', 'Industry expert speaker', 'Mentored 5000+ students']
    },
    {
      id: 2,
      name: 'SK Sir',
      role: 'Head of Data Science',
      expertise: ['Machine Learning', 'Data Analytics', 'AI Research'],
      experience: '4+ years',
      image: '/src/assets/sksir.jpg',
      bio: 'SK Sir is a seasoned computer professional and mentor, specializing in Excel, Paint, and CorelDRAW. He focuses on data analysis with practical applications and real-world scenario',
      education: 'M.S. in Data Science, Stanford University',
      achievements: ['AI research award winner', 'Published 15+ papers', 'Industry consultant']
    },
    {
      id: 3,
      name: 'Sachin Sir',
      role: 'Senior Web Development Instructor',
      expertise: ['React', 'Node.js', 'MongoDB', 'AWS'],
      experience: '4+ years',
      image: '/src/assets/sachinsir.png',
      bio: 'Sachin Sir is an expert in fundamental computer science and programming, providing students with a strong foundation in these areas. His teaching methodology focuses on practical applications.',
      education: 'B.Tech in Computer Science, IIT Delhi',
      achievements: ['Built 50+ web applications', 'Tech conference speaker', 'Open source contributor']
    },
    {
      id: 4,
      name: 'Hemant Sir',
      role: 'English & Personality Development Expert',
      expertise: ['Spoken English', 'Personality Development', 'Communication Skills'],
      experience: '6+ years',
      image: '/src/assets/hemant.jpeg',
      bio: 'Hemant Sir is skilled in English Grammar and literature, inspiring students to communicate effectively and think critically. His expertise helps students develop strong language and communication skills.',
      education: 'M.A. in English Literature',
      achievements: ['Best Communication Coach Award', 'Trained 10,000+ students', 'Corporate Soft Skills Trainer']
    },
    {
      id: 5,
      name: 'Khushal Sir',
      role: 'Programming & Startup Enthusiast',
      expertise: ['Software Development', 'Programming Languages', 'Startup Ecosystem'],
      experience: '5+ years',
      image: '/src/assets/gaurav.jpg',
      bio: 'Khushal Sir is a computer programming and development enthusiast with a strong passion for the startup ecosystem. He helps students bridge the gap between coding and building real-world products.',
      education: 'B.Tech in Computer Science',
      achievements: ['Tech Startup Mentor', 'Product Builder', 'Hackathon Winner']
    }
  ];

  const facilities = [
    { id: 1, title: 'Modern Classrooms', description: 'State-of-the-art interactive environments equipped with smart boards and immersive tech.', icon: <BookOpen size={24} /> },
    { id: 2, title: 'Supercomputing Labs', description: 'High-performance rigs powered by the latest GPUs for AI training and rendering.', icon: <Zap size={24} /> },
    { id: 3, title: 'Digital Library', description: '24/7 access to millions of research papers, OReilly books, and enterprise databases.', icon: <Globe size={24} /> },
    { id: 4, title: 'Placement Cell', description: 'A dedicated task force connecting you with elite global job opportunities.', icon: <Rocket size={24} /> }
  ];

  const partnerships = [
    { id: 1, name: 'Microsoft', logo: '/src/assets/partners/microsoft.png', description: 'Official Learning Partner' },
    { id: 2, name: 'Google', logo: '/src/assets/partners/google.png', description: 'Cloud Training Partner' },
    { id: 3, name: 'Amazon', logo: '/src/assets/partners/amazon.png', description: 'AWS Academy Partner' },
    { id: 4, name: 'IBM', logo: '/src/assets/partners/ibm.png', description: 'Skills Academy Partner' }
  ];

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveInstructorIndex((prev) => (prev + 1) % instructors.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered, instructors.length]);

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-slate-900 overflow-x-hidden">
      
      {/* Hyper Cinematic Parallax Hero */}
      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-100 rounded-full blur-[120px] mix-blend-multiply opacity-60"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-100 rounded-full blur-[120px] mix-blend-multiply opacity-60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-slate-200 backdrop-blur-md mb-8 text-sm font-mono tracking-widest text-blue-600 uppercase shadow-sm">
              <Star size={14} /> The NIICT Story
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display uppercase tracking-tight text-slate-900 mb-8 drop-shadow-sm leading-[0.85]">
              Redefining <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400">Education</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-sans leading-relaxed">
              Empowering the next generation of IT professionals with world-class education, 
              cutting-edge curriculum, and unparalleled industry connections.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cinematic Foundation Bento Grid */}
      <section className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tight text-slate-900">Our Foundation</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Tabs */}
            <div className="flex flex-col gap-4">
              {missionVision.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative p-6 text-left rounded-3xl transition-all duration-500 overflow-hidden border ${
                    activeTab === item.id 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-105 z-10' 
                    : 'bg-white/60 text-slate-500 border-slate-200 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`p-3 rounded-2xl ${activeTab === item.id ? 'bg-blue-500/20 text-cyan-300' : 'bg-slate-100 text-slate-400'}`}>
                      {item.icon}
                    </div>
                    <span className="font-display text-2xl uppercase tracking-wide">{item.title}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Right Content */}
            <div className="lg:col-span-2">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-3xl p-10 md:p-16 flex flex-col justify-center shadow-[0_20px_40px_rgba(0,0,0,0.04)]"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full flex items-center justify-center text-blue-600 mb-8 shadow-inner border border-blue-100">
                  {missionVision.find(item => item.id === activeTab).icon}
                </div>
                <h3 className="text-4xl font-display uppercase tracking-wide mb-6 text-slate-900">
                  {missionVision.find(item => item.id === activeTab).title}
                </h3>
                <p className="text-xl text-slate-500 leading-relaxed font-sans">
                  {missionVision.find(item => item.id === activeTab).content}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* The Journey Timeline (Hyper Cinematic Advanced) */}
      <section className="py-32 relative bg-slate-900 text-white overflow-hidden">
        {/* Dark Mode Timeline Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-blue-900/20 blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tight text-white mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Journey</span>
            </h2>
            <p className="text-slate-400 font-sans text-lg">A legacy built on relentless innovation and student success.</p>
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0 -translate-x-1/2"></div>
            
            {timeline.map((event, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`relative flex md:justify-between items-center mb-16 md:mb-24 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full bg-cyan-400 -translate-x-1/2 shadow-[0_0_20px_rgba(34,211,238,0.8)] border-4 border-slate-900 z-10"></div>
                
                {/* Empty Space for Grid Alignment (Desktop) */}
                <div className="hidden md:block w-[45%]"></div>
                
                {/* Content Card */}
                <div className="w-full md:w-[45%] pl-12 md:pl-0">
                  <div className={`p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-500 ${idx % 2 === 0 ? 'md:text-right' : 'text-left'}`}>
                    <div className={`font-mono text-cyan-400 text-lg tracking-widest mb-2 ${idx % 2 === 0 ? 'md:justify-end' : ''} flex items-center gap-2`}>
                      <Milestone size={18} /> {event.year}
                    </div>
                    <h3 className="text-3xl font-display uppercase tracking-wide mb-4">{event.title}</h3>
                    <p className="text-slate-400 font-sans leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Achievements Grid */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tight text-slate-900">Impact By Numbers</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, idx) => (
              <motion.div 
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 text-center hover:-translate-y-2 transition-transform duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
              >
                <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                  {achievement.icon}
                </div>
                <div className="text-5xl font-display font-bold text-slate-900 mb-2">{achievement.number}</div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-3">{achievement.label}</h3>
                <p className="text-slate-500 text-sm font-sans">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors 3D Carousel (Premium Cinematic) */}
      <section className="py-32 bg-white relative z-10 overflow-hidden">
        {/* Soft Ambient Light for Carousel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-blue-50/80 rounded-full blur-[150px] pointer-events-none mix-blend-multiply"></div>

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tight text-slate-900 mb-4">Our Elite Mentors</h2>
          <div className="font-mono text-[12px] tracking-[3px] text-blue-600 uppercase font-bold">Industry Experts Leading The Way</div>
        </div>
        
        <div 
          className="relative w-full max-w-6xl mx-auto h-[450px] flex justify-center items-center [perspective:1000px] mb-12 z-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          
          {/* Left Button */}
          <button 
            onClick={() => setActiveInstructorIndex((prev) => (prev - 1 + instructors.length) % instructors.length)}
            className="absolute left-4 md:left-12 z-30 w-12 h-12 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-900 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-slate-200 hover:scale-110"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Carousel Cards */}
          {instructors.map((instructor, i) => {
            let offset = i - activeInstructorIndex;
            if (offset < -2) offset += instructors.length;
            if (offset > 2) offset -= instructors.length;

            // 3D positioning logic
            const isActive = offset === 0;
            const x = offset * 180; // horizontal spread
            const scale = isActive ? 1 : 1 - Math.abs(offset) * 0.2;
            const zIndex = 10 - Math.abs(offset);
            const opacity = Math.abs(offset) > 2 ? 0 : 1;
            const filter = isActive ? 'grayscale(0%) brightness(1.1)' : 'grayscale(60%) brightness(0.9)';
            const boxShadow = isActive ? '0 30px 60px rgba(15,23,42,0.15)' : '0 10px 30px rgba(15,23,42,0.05)';

            return (
              <motion.div
                key={instructor.id}
                initial={false}
                animate={{ x, scale, zIndex, opacity, filter, boxShadow }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute w-[280px] h-[380px] rounded-2xl overflow-hidden cursor-pointer border ${isActive ? 'border-slate-200/80' : 'border-slate-200/40'} bg-white`}
                onClick={() => setActiveInstructorIndex(i)}
              >
                <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
                
                {/* Premium elegant gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-6 left-0 right-0 text-center px-6"
                  >
                    <h3 className="font-display text-3xl tracking-[1px] text-white uppercase font-bold drop-shadow-md">{instructor.name}</h3>
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Right Button */}
          <button 
            onClick={() => setActiveInstructorIndex((prev) => (prev + 1) % instructors.length)}
            className="absolute right-4 md:right-12 z-30 w-12 h-12 rounded-full bg-white/80 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-900 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-slate-200 hover:scale-110"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Premium Dots Indicator */}
        <div className="flex justify-center gap-3 mb-16 relative z-10">
          {instructors.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveInstructorIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${activeInstructorIndex === i ? 'bg-blue-600 scale-[2] shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-300 hover:bg-slate-400'}`}
            />
          ))}
        </div>

        {/* Active Instructor Details (Premium Layout) */}
        <motion.div 
          key={activeInstructorIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center px-6 relative z-10"
        >
          <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-3xl p-10 md:p-14 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
            <h3 className="font-display text-4xl tracking-tight text-slate-900 uppercase mb-2 font-bold">
              {instructors[activeInstructorIndex].name}
            </h3>
            <p className="font-mono text-[13px] tracking-[2px] text-blue-600 uppercase mb-8 font-semibold">
              {instructors[activeInstructorIndex].role}
            </p>
            
            <p className="text-slate-500 text-lg font-sans leading-relaxed mb-10 max-w-3xl mx-auto">
              {instructors[activeInstructorIndex].bio}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {instructors[activeInstructorIndex].expertise.map((skill, index) => (
                <span key={index} className="border border-blue-100 text-blue-700 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-[1.5px] bg-blue-50/50 shadow-sm font-semibold">
                  {skill}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-10 text-left">
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-mono text-[11px] tracking-[2px] text-slate-400 uppercase mb-4 font-bold flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-500" />
                  Education
                </h4>
                <div className="text-[15px] text-slate-700 font-medium">
                  {instructors[activeInstructorIndex].education}
                </div>
              </div>
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h4 className="font-mono text-[11px] tracking-[2px] text-slate-400 uppercase mb-4 font-bold flex items-center gap-2">
                  <Award size={16} className="text-blue-500" />
                  Key Achievements
                </h4>
                <ul className="space-y-3">
                  {instructors[activeInstructorIndex].achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start gap-3 text-[15px] text-slate-700 font-medium">
                      <CheckCircle size={18} className="text-cyan-500 shrink-0 mt-0.5" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Facilities & Premium Partners Grid */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-slate-900 mb-4">Infrastructure & Partners</h2>
            <p className="text-slate-500 font-sans">World-class facilities backed by global tech leaders.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {facilities.map((facility) => (
              <div key={facility.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 border border-slate-100 mb-6">
                  {facility.icon}
                </div>
                <h3 className="text-xl font-display uppercase tracking-wide mb-3 font-bold text-slate-900">{facility.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{facility.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partnerships.map((partner) => (
              <div key={partner.id} className="bg-white py-8 px-4 rounded-2xl border border-slate-200 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 shadow-sm hover:shadow-md">
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark Premium CTA */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-16 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.3)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-white mb-6">
                Ready to Shape Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Future?</span>
              </h2>
              <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg font-sans">
                Join thousands of successful students who have transformed their careers with our comprehensive IT education programs.
              </p>
              <button className="group inline-flex items-center justify-center font-sans text-sm font-bold uppercase tracking-widest text-slate-900 bg-white hover:bg-slate-50 px-8 py-4 rounded-full transition-all duration-300 shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:-translate-y-1">
                Explore Courses
                <Rocket size={18} className="ml-3 text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;