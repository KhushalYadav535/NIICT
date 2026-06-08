import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Users, Award, BookOpen, TrendingUp, Heart, MessageCircle } from 'lucide-react';

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Full Stack Developer',
      company: 'Tech Solutions Inc.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      testimonial: 'The Full Stack Development course at NIICT completely transformed my career. The practical approach and expert guidance helped me land my dream job at a leading tech company.',
      course: 'Full Stack Web Development',
      achievement: 'Placed at Google with 300% salary hike'
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Data Scientist',
      company: 'Analytics Pro',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      testimonial: 'NIICT\'s Data Science program exceeded my expectations. The comprehensive curriculum and hands-on experience with real datasets prepared me for the industry.',
      course: 'Data Science & Machine Learning',
      achievement: 'Promoted to Senior Data Scientist in 6 months'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      role: 'UI/UX Designer',
      company: 'Creative Studio',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      testimonial: 'The UI/UX Design Masterclass was exactly what I needed to transition into design. The instructors are industry experts who genuinely care about student success.',
      course: 'UI/UX Design Masterclass',
      achievement: 'Won National Design Award 2023'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      role: 'Mobile App Developer',
      company: 'AppWorks',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      testimonial: 'I came to NIICT with zero programming knowledge and left as a confident mobile app developer. The structured learning path and continuous support made all the difference.',
      course: 'Mobile App Development',
      achievement: 'Published 5 apps with 100K+ downloads'
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' : 'text-slate-200'}
        fill={i < rating ? 'currentColor' : 'none'}
      />
    ));
  };

  return (
    <section className="py-32 bg-[#FAFAFA] relative overflow-hidden" id="testimonials">
      {/* Premium Ambient Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[150px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-50/50 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6 text-xs font-mono font-semibold tracking-widest text-blue-600 uppercase"
          >
            <MessageCircle size={16} />
            Student Success Stories
            <Heart size={14} className="text-red-500 fill-red-500" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight text-slate-900 mb-6 drop-shadow-sm"
          >
            Voices of <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Triumph</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg text-slate-500 max-w-2xl mx-auto font-sans leading-relaxed"
          >
            Hear from our successful alumni who transformed their careers with NIICT's elite guidance and support.
          </motion.p>
        </div>

        {/* Main Testimonial Display (Cinematic Glass Card) */}
        <div className="max-w-5xl mx-auto mb-20 relative">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden"
            >
              <Quote className="absolute top-10 right-12 text-slate-100/80 w-32 h-32 -rotate-12 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full blur-[20px] opacity-40"></div>
                  <img 
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-xl relative z-10"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-6">
                    <h3 className="text-3xl md:text-4xl font-display uppercase tracking-wide text-slate-900 mb-2 font-bold">{testimonials[currentIndex].name}</h3>
                    <p className="font-mono text-[13px] tracking-[2px] text-blue-600 font-semibold mb-4 uppercase">
                      {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                    </p>
                    <div className="flex justify-center md:justify-start gap-2 text-[13px] font-sans font-medium text-slate-600 mb-4 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full inline-flex items-center">
                      <BookOpen size={14} className="text-blue-500" />
                      <span>{testimonials[currentIndex].course}</span>
                    </div>
                    <div className="flex justify-center md:justify-start gap-1">
                      {renderStars(testimonials[currentIndex].rating)}
                    </div>
                  </div>
                  
                  <p className="text-xl md:text-2xl italic text-slate-700 mb-8 font-serif leading-relaxed">
                    "{testimonials[currentIndex].testimonial}"
                  </p>
                  
                  <div className="inline-flex items-center gap-3 text-sm font-semibold tracking-wide text-slate-900 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 px-6 py-3 rounded-2xl shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-yellow-500 shadow-sm border border-slate-100">
                      <Award size={16} />
                    </div>
                    <span>{testimonials[currentIndex].achievement}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls Overlay */}
          <div className="absolute top-1/2 -left-6 md:-left-8 -translate-y-1/2 z-20 hidden md:block">
            <button onClick={prevTestimonial} className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-110 transition-all">
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="absolute top-1/2 -right-6 md:-right-8 -translate-y-1/2 z-20 hidden md:block">
            <button onClick={nextTestimonial} className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-110 transition-all">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center justify-center gap-6 mb-16 md:hidden">
          <button onClick={prevTestimonial} className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600">
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-blue-600 scale-150' : 'bg-slate-300'
                }`}
                onClick={() => goToTestimonial(index)}
              />
            ))}
          </div>
          <button onClick={nextTestimonial} className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Desktop Dots Indicator */}
        <div className="hidden md:flex justify-center gap-3 mb-20">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'bg-blue-600 w-10 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-slate-300 w-2.5 hover:bg-slate-400'
              }`}
              onClick={() => goToTestimonial(index)}
            />
          ))}
        </div>

        {/* Testimonials Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white border p-6 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                index === currentIndex ? 'border-blue-300 shadow-[0_10px_30px_rgba(37,99,235,0.1)] ring-2 ring-blue-50' : 'border-slate-200/60 shadow-sm hover:border-blue-200'
              }`}
              onClick={() => goToTestimonial(index)}
            >
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-100"
                />
                <div>
                  <h4 className="font-display uppercase tracking-wide font-bold text-slate-900 text-[15px] leading-tight">{testimonial.name}</h4>
                  <p className="text-[11px] font-mono tracking-wide text-blue-600 uppercase">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-sm text-slate-500 font-sans leading-relaxed line-clamp-3">
                "{testimonial.testimonial}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;