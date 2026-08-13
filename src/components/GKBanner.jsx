import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, ChevronRight, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GKBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenBanner = sessionStorage.getItem('hasSeenGKBanner');
    if (!hasSeenBanner) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeBanner = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenGKBanner', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] rounded-[2rem] shadow-[0_0_50px_-12px_rgba(79,70,229,0.5)] border border-indigo-500/30"
          >
            {/* Animated glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

            {/* Close Button */}
            <button 
              onClick={closeBanner}
              className="absolute top-4 right-4 z-20 p-2 text-white/70 bg-white/5 hover:bg-white/10 hover:text-white rounded-full backdrop-blur-md transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Banner Background & Graphic */}
            <div className="relative pt-12 pb-8 px-8 text-white overflow-hidden text-center">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500 rounded-full blur-[60px]"></div>
                <div className="absolute bottom-10 -left-10 w-32 h-32 bg-indigo-500 rounded-full blur-[60px]"></div>
              </div>

              <motion.div 
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
                className="relative z-10 mx-auto w-24 h-24 mb-6 bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.3)] border border-amber-300/50"
              >
                <div className="absolute inset-0 rounded-full border border-amber-100/50 animate-ping opacity-20" />
                <Trophy className="w-12 h-12 text-amber-950" />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 inline-flex items-center gap-2 px-5 py-2 mb-6 text-xs font-bold tracking-widest text-amber-950 uppercase bg-gradient-to-r from-amber-200 to-amber-400 rounded-full shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                Registrations Open
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 mb-4 text-4xl font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-white"
              >
                State Level <br/> GK Competition 2026
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative z-10 text-indigo-200/80 text-base max-w-sm mx-auto font-medium"
              >
                Test your knowledge, compete with the best, and win exciting prizes & scholarships!
              </motion.p>
            </div>

            {/* Bottom Content & Action Buttons */}
            <div className="relative z-10 px-8 pb-8 pt-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4"
              >
                <Link 
                  to="/competition" 
                  onClick={closeBanner}
                  className="group relative flex items-center justify-center w-full px-8 py-4 text-lg font-bold text-white transition-all overflow-hidden rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Fill the Form Now
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <button 
                  onClick={closeBanner}
                  className="w-full px-8 py-3.5 text-sm font-semibold text-indigo-300/60 transition-all rounded-xl hover:bg-white/5 hover:text-white"
                >
                  Maybe Later
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GKBanner;
