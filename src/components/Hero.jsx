import React, { useRef } from 'react';
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Network, Cpu, Code } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef(null);
  
  // Elegant, smooth mouse tracking for premium 3D Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Very smooth springs for a luxurious, heavy 3D feel
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { damping: 50, stiffness: 100 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { damping: 50, stiffness: 100 });
  
  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], ['-1%', '1%']), { damping: 60, stiffness: 80 });
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], ['-1%', '1%']), { damping: 60, stiffness: 80 });

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

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen bg-[#FAFAFA] overflow-hidden flex flex-col justify-center items-center [perspective:2000px] select-none" 
      id="hero"
    >
      
      {/* Premium 3D Ambient Background */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center scale-110 pointer-events-none"
        style={{ x: bgX, y: bgY }}
      >
        <div className="absolute inset-0 bg-[#FFFFFF]"></div>
        
        {/* Soft Luxurious Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-400/10 rounded-full blur-[150px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-300/15 rounded-full blur-[150px] mix-blend-multiply"></div>
        <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-indigo-400/10 rounded-full blur-[120px] mix-blend-multiply"></div>
        
        {/* Ultra-subtle Premium Dot Grid (Not a harsh cyber grid, just elegant texture) */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
      </motion.div>

      {/* Premium Floating 3D Tech & AI Elements */}
      
      {/* 1. Floating AI Brain Node */}
      <motion.div
        className="absolute top-[20%] right-[15%] w-32 h-32 rounded-3xl bg-white/30 border border-white/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(34,211,238,0.15)] pointer-events-none z-10 flex items-center justify-center text-cyan-500"
        style={{ 
          x: useTransform(mouseX, [-0.5, 0.5], [80, -80]), 
          y: useTransform(mouseY, [-0.5, 0.5], [80, -80]),
          rotateZ: useTransform(mouseX, [-0.5, 0.5], [-15, 15]),
          rotateX: 30,
          rotateY: -20
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-3xl animate-pulse"></div>
        <Brain size={48} strokeWidth={1.5} />
      </motion.div>

      {/* 2. Floating Code Snippet Card */}
      <motion.div
        className="absolute bottom-[25%] right-[25%] w-64 h-auto rounded-2xl bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.2)] pointer-events-none z-10 p-5 font-mono text-[10px] text-cyan-300 leading-relaxed"
        style={{ 
          x: useTransform(mouseX, [-0.5, 0.5], [-100, 100]), 
          y: useTransform(mouseY, [-0.5, 0.5], [-50, 50]),
          rotateX: 20,
          rotateY: 25,
          scale: useTransform(mouseY, [-0.5, 0.5], [0.9, 1.1])
        }}
      >
        <div className="flex gap-2 mb-3 border-b border-slate-700 pb-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
        <div className="text-blue-400">async function <span className="text-yellow-300">initAI</span>() {'{'}</div>
        <div className="pl-4 text-purple-400">const <span className="text-white">model</span> = await <span className="text-cyan-300">NeuralNet.load</span>();</div>
        <div className="pl-4 text-purple-400">await <span className="text-white">model</span>.<span className="text-yellow-300">train</span>(dataset);</div>
        <div className="text-blue-400">{'}'}</div>
      </motion.div>

      {/* 3. Floating Network/Cloud Node */}
      <motion.div
        className="absolute top-[30%] left-[15%] w-40 h-40 rounded-full bg-gradient-to-tr from-blue-100/40 to-indigo-100/40 border border-white/80 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,102,255,0.1)] pointer-events-none z-10 flex items-center justify-center text-blue-600"
        style={{ 
          x: useTransform(mouseX, [-0.5, 0.5], [-60, 60]), 
          y: useTransform(mouseY, [-0.5, 0.5], [60, -60]),
          rotateZ: useTransform(mouseX, [-0.5, 0.5], [10, -10]),
          scale: useTransform(mouseY, [-0.5, 0.5], [0.95, 1.05])
        }}
      >
        <Network size={56} strokeWidth={1} className="opacity-80" />
      </motion.div>

      {/* 4. Floating CPU/Microchip Node */}
      <motion.div
        className="absolute bottom-[20%] left-[20%] w-24 h-24 rounded-2xl bg-white/50 border-2 border-slate-200/50 backdrop-blur-xl shadow-[0_15px_30px_rgba(15,23,42,0.05)] pointer-events-none z-10 flex items-center justify-center text-slate-700"
        style={{ 
          x: useTransform(mouseX, [-0.5, 0.5], [120, -120]), 
          y: useTransform(mouseY, [-0.5, 0.5], [-90, 90]),
          rotateX: -20,
          rotateY: -30
        }}
      >
        <Cpu size={40} strokeWidth={1.5} />
      </motion.div>

      {/* 5. Floating Code Icon */}
      <motion.div
        className="absolute top-[10%] left-[40%] w-16 h-16 rounded-xl bg-cyan-50/50 border border-cyan-200/50 backdrop-blur-md shadow-sm pointer-events-none z-10 flex items-center justify-center text-cyan-600"
        style={{ 
          x: useTransform(mouseX, [-0.5, 0.5], [-40, 40]), 
          y: useTransform(mouseY, [-0.5, 0.5], [-20, 20]),
          rotateZ: 15
        }}
      >
        <Code size={24} strokeWidth={2} />
      </motion.div>

      {/* Main Content inside a deeply preserved 3D container */}
      <motion.div 
        className="relative z-20 w-full flex flex-col items-center text-center px-6 [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
      >
        
        {/* Display Headline - Massive, Elegant, 3D Premium */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, z: -100, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, z: 100, filter: 'blur(0px)' }}
          transition={{ duration: 1.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[70px] sm:text-[100px] md:text-[130px] lg:text-[160px] leading-[0.85] tracking-tight text-slate-900 mt-12 mb-6 max-w-7xl [transform:translateZ(100px)] relative"
        >
          <span className="relative z-10 text-slate-900">Architects of</span><br/>
          <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 pb-4">
            The Future
          </span>
        </motion.h1>

        {/* Premium Eyebrow Text Moved Below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[11px] md:text-[13px] tracking-[6px] md:tracking-[10px] uppercase text-slate-500 mb-8 [transform:translateZ(60px)] font-medium"
        >
          Nihanshi Institute of Information & Computer Technology
        </motion.div>

        {/* Elegant Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-slate-500 font-sans text-lg md:text-xl leading-relaxed mb-12 [transform:translateZ(80px)]"
        >
          Pioneering the next generation of global technology leaders through immersive, cutting-edge education and real-world innovation.
        </motion.p>

        {/* Primary CTA - Premium Liquid/Glass Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="[transform:translateZ(120px)]"
        >
          <Link 
            to="/courses" 
            className="group relative font-sans text-[15px] font-semibold tracking-wide text-white bg-slate-900 rounded-full px-[48px] py-[20px] overflow-hidden inline-flex items-center shadow-[0_20px_40px_rgba(15,23,42,0.2)] hover:shadow-[0_20px_60px_rgba(0,102,255,0.3)] transition-all duration-500"
          >
            {/* Elegant Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            
            <span className="relative z-10 flex items-center gap-3">
              Explore Programs
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default Hero;
