import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  const [counters, setCounters] = useState({
    students: 0,
    courses: 0,
    years: 0,
    success: 0
  });

  useEffect(() => {
    const targetValues = { students: 10000, courses: 50, years: 15, success: 95 };
    const duration = 2000;
    const steps = 60;
    const increment = {
      students: targetValues.students / steps,
      courses: targetValues.courses / steps,
      years: targetValues.years / steps,
      success: targetValues.success / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCounters({
        students: Math.min(Math.floor(increment.students * currentStep), targetValues.students),
        courses: Math.min(Math.floor(increment.courses * currentStep), targetValues.courses),
        years: Math.min(Math.floor(increment.years * currentStep), targetValues.years),
        success: Math.min(Math.floor(increment.success * currentStep), targetValues.success)
      });
      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { id: 1, title: 'Alumni Network', value: counters.students, suffix: '+' },
    { id: 2, title: 'Premium Modules', value: counters.courses, suffix: '+' },
    { id: 3, title: 'Years of Excellence', value: counters.years, suffix: '+' },
    { id: 4, title: 'Placement Rate', value: counters.success, suffix: '%' }
  ];

  return (
    <section className="bg-white text-slate-900 py-[120px] relative overflow-hidden" id="stats">
      {/* Premium Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-xs md:text-sm font-sans tracking-[0.2em] text-blue-600 uppercase mb-6 border border-blue-200 px-6 py-2 rounded-full bg-blue-50/80 backdrop-blur-md font-semibold shadow-sm"
          >
            GLOBAL IMPACT
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-[48px] md:text-[64px] uppercase tracking-tight text-slate-900 drop-shadow-sm font-bold"
          >
            A LEGACY OF <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">SUCCESS</span>
          </motion.h2>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-32 relative">
          {/* Subtle connecting line behind stats */}
          <div className="hidden lg:block absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent -translate-y-1/2 z-0"></div>

          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="text-center bg-white/60 backdrop-blur-2xl border border-slate-200/60 p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,102,255,0.06)] hover:-translate-y-2 transition-all duration-500 relative z-10"
            >
              <div className="font-display text-[48px] md:text-[56px] tracking-tight text-slate-900 mb-2 font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-700">
                {stat.value}{stat.suffix}
              </div>
              <div className="font-mono text-[11px] md:text-[12px] tracking-[2px] text-blue-600 uppercase font-semibold">
                {stat.title}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bars Section - Premium Cinematic */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white border border-slate-200 p-10 md:p-16 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden"
        >
          {/* Subtle glow inside the card */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-50/50 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="space-y-12 relative z-10">
            {[ 
              { label: 'CORPORATE PLACEMENTS', value: 95 },
              { label: 'STUDENT SATISFACTION', value: 98 },
              { label: 'INDUSTRY RECOGNITION', value: 92 },
              { label: 'CURRICULUM RELEVANCE', value: 99 }
            ].map((metric, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-center mb-4 font-mono text-[11px] md:text-[13px] tracking-[2px] uppercase font-semibold">
                  <span className="text-slate-500 group-hover:text-blue-600 transition-colors duration-300">{metric.label}</span>
                  <span className="text-slate-900 font-bold">{metric.value}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 md:h-3 rounded-full relative overflow-hidden shadow-inner">
                  <motion.div 
                    className="h-full absolute left-0 top-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.value}%` }}
                    transition={{ duration: 1.5, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                    viewport={{ once: true }}
                  >
                    {/* Shimmer effect inside the bar */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;