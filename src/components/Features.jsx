import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Award, Users, Clock, BookOpen, Rocket, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: <Zap size={24} className="text-blue-600" />,
      title: 'Accelerated Mastery',
      description: 'Intensive programs engineered to compress years of learning into months of focused mastery.',
      colSpan: 'md:col-span-2 lg:col-span-2',
      bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      icon: <Target size={24} className="text-blue-600" />,
      title: 'Precision Focus',
      description: 'Curriculums designed with pinpoint accuracy for modern tech industry demands.',
      colSpan: 'md:col-span-1 lg:col-span-1',
    },
    {
      id: 3,
      icon: <Award size={24} className="text-blue-600" />,
      title: 'Elite Instructors',
      description: 'Learn directly from industry veterans who have built planetary-scale systems.',
      colSpan: 'md:col-span-1 lg:col-span-1',
    },
    {
      id: 4,
      icon: <Shield size={24} className="text-blue-600" />,
      title: 'Career Shield',
      description: 'Guaranteed placement assistance and lifelong alumni network access to secure your future.',
      colSpan: 'md:col-span-2 lg:col-span-2',
    },
    {
      id: 5,
      icon: <Clock size={24} className="text-blue-600" />,
      title: 'Adaptive Pacing',
      description: 'Flexible schedules that mold around your lifestyle without compromising academic rigor.',
      colSpan: 'md:col-span-2 lg:col-span-1',
    },
    {
      id: 6,
      icon: <Users size={24} className="text-blue-600" />,
      title: 'Global Syndicate',
      description: 'Join a high-caliber community of driven individuals pushing the boundaries of tech.',
      colSpan: 'md:col-span-1 lg:col-span-2',
    }
  ];

  return (
    <section className="bg-[#FAFAFA] text-slate-900 py-32 relative overflow-hidden" id="features">
      {/* Soft Premium Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-blue-100/60 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs md:text-sm font-sans font-semibold tracking-[0.2em] text-blue-600 uppercase mb-6 border border-blue-200 px-6 py-2 rounded-full bg-blue-50/80 backdrop-blur-md shadow-sm"
          >
            The NIICT Advantage
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight text-slate-900 mb-6 drop-shadow-sm"
          >
            Engineered for <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Excellence</span>
          </motion.h2>
        </div>

        {/* Premium Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          {features.map((feature, idx) => (
            <motion.div 
              key={feature.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`group relative rounded-3xl overflow-hidden border border-slate-200/60 bg-white/60 backdrop-blur-2xl hover:border-blue-300 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,102,255,0.06)] hover:-translate-y-1 ${feature.colSpan}`}
            >
              {feature.bgImage && (
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-transparent z-10"></div>
                  <img src={feature.bgImage} alt="" className="w-full h-full object-cover opacity-20 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000 ease-[0.16,1,0.3,1]" />
                </div>
              )}
              
              <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:shadow-[0_10px_20px_rgba(0,102,255,0.1)] transition-all duration-500">
                  {feature.icon}
                </div>
                
                <div>
                  <h3 className="text-2xl font-display uppercase tracking-wide mb-3 text-slate-900 group-hover:text-blue-600 transition-colors duration-300 font-bold">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-sans">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Premium Dark CTA Card */}
        <motion.div 
          className="mt-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-800 to-black p-12 md:p-16 text-center shadow-[0_20px_50px_rgba(15,23,42,0.5)]">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] opacity-10 mix-blend-overlay"></div>
            
            {/* Dark Card Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full bg-blue-500/20 blur-[100px] rounded-full pointer-events-none z-0"></div>

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <h3 className="text-3xl md:text-5xl font-display tracking-tight mb-6 text-white uppercase font-bold">
                Ready to elevate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">trajectory?</span>
              </h3>
              <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto font-sans">
                Join a cohort of ambitious individuals and master the skills required to dominate the modern technological landscape.
              </p>
              <button className="group inline-flex items-center justify-center font-sans text-[15px] font-semibold tracking-wide text-slate-900 bg-white hover:bg-slate-50 px-8 py-4 rounded-full transition-all duration-300 shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)] hover:-translate-y-1">
                Begin Your Journey
                <Rocket size={18} className="ml-3 text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;