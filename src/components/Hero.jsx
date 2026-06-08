import React, { useRef } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Zap, Lightbulb, Rocket } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef(null);
  
  // Elegant, smooth mouse tracking for premium 3D Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Very smooth springs for a luxurious, heavy 3D feel
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { damping: 50, stiffness: 100 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { damping: 50, stiffness: 100 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseX.set((x / rect.width) - 0.5);
    mouseY.set((y / rect.height) - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Cinematic Word Reveal Animation setup
  const headlineText = ["ARCHITECTS", "OF", "THE", "FUTURE"];

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.5 }
    }
  };

  const wordVariants = {
    hidden: { y: "150%", rotateZ: 5 },
    visible: { 
      y: "0%", 
      rotateZ: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen bg-[#0B1120] overflow-hidden flex flex-col justify-center items-center [perspective:2000px] select-none" 
      id="hero"
    >
      {/* Deep Cinematic Ambient Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(56,189,248,0.15)_0%,rgba(11,17,32,0)_70%)] pointer-events-none blur-[100px] z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle,rgba(167,139,250,0.15)_0%,rgba(11,17,32,0)_70%)] pointer-events-none blur-[100px] z-0"></div>
      
      {/* Moving Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] opacity-30 z-0"></div>

      {/* Circular Animated Tech Lifecycle Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[650px] h-[70vw] max-h-[650px] pointer-events-none opacity-40 z-0 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border border-slate-700/50 relative shadow-[0_0_120px_rgba(56,189,248,0.1)_inset]"
        >
          {/* Tech Nodes on the Ring */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 p-5 rounded-2xl border border-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.3)] text-cyan-400 flex flex-col items-center justify-center">
            <BookOpen size={28} />
            <span className="text-[10px] font-mono uppercase tracking-[2px] mt-2">Learn</span>
          </div>
          <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-slate-900 p-5 rounded-2xl border border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.3)] text-blue-400 flex flex-col items-center justify-center rotate-90">
            <Zap size={28} />
            <span className="text-[10px] font-mono uppercase tracking-[2px] mt-2">Code</span>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 p-5 rounded-2xl border border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.3)] text-purple-400 flex flex-col items-center justify-center rotate-180">
            <Lightbulb size={28} />
            <span className="text-[10px] font-mono uppercase tracking-[2px] mt-2">Innovate</span>
          </div>
          <div className="absolute top-1/2 -left-6 -translate-y-1/2 bg-slate-900 p-5 rounded-2xl border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)] text-emerald-400 flex flex-col items-center justify-center -rotate-90">
            <Rocket size={28} />
            <span className="text-[10px] font-mono uppercase tracking-[2px] mt-2">Deploy</span>
          </div>

          {/* Inner Ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] left-[10%] right-[10%] bottom-[10%] rounded-full border-2 border-slate-700/40 border-dashed"
          ></motion.div>
        </motion.div>
      </div>

      {/* Main Content inside a deeply preserved 3D container */}
      <motion.div 
        className="relative z-20 w-full flex flex-col items-center text-center px-6 pt-24 [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
      >
        {/* Premium Eyebrow Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[10px] md:text-[13px] tracking-[4px] md:tracking-[8px] uppercase text-cyan-300 mb-6 font-bold drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] relative z-50"
        >
          Nihanshi Institute of Information & Computer Technology
        </motion.div>

        {/* Display Headline - Cinematic Masking Word Reveal Animation */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-display text-[60px] sm:text-[90px] md:text-[120px] lg:text-[150px] leading-[0.85] tracking-tight mt-4 mb-8 max-w-7xl relative flex flex-wrap justify-center gap-x-6 gap-y-2 uppercase z-30"
        >
          {headlineText.map((word, index) => (
            <div key={index} className="overflow-hidden pb-4">
              <motion.div 
                variants={wordVariants}
                className={`relative z-10 block ${index >= 2 ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-500 drop-shadow-[0_0_40px_rgba(56,189,248,0.5)]' : 'text-white'}`}
              >
                {word}
              </motion.div>
            </div>
          ))}
        </motion.h1>

        {/* Elegant Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl text-slate-300 font-sans text-lg md:text-2xl leading-relaxed mb-14 font-medium relative z-30"
        >
          Pioneering the next generation of global technology leaders through immersive, cutting-edge education and real-world innovation.
        </motion.p>

        {/* Primary CTA - Premium Liquid/Glass Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-30"
        >
          <Link 
            to="/courses" 
            className="group relative font-sans text-[16px] font-bold uppercase tracking-[3px] text-cyan-50 bg-slate-900/60 backdrop-blur-2xl border border-cyan-500/40 rounded-full px-[54px] py-[22px] overflow-hidden inline-flex items-center shadow-[0_0_40px_rgba(34,211,238,0.2)] hover:shadow-[0_0_80px_rgba(34,211,238,0.6)] transition-all duration-700 hover:-translate-y-2 hover:border-cyan-400"
          >
            {/* Elegant Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>
            
            <span className="relative z-10 flex items-center gap-4">
              Explore Programs
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Hero;
