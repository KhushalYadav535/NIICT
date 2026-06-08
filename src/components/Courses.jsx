import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Programs' },
    { id: 'degree', label: 'Degree' },
    { id: 'diploma', label: 'Diploma' },
    { id: 'certification', label: 'Certification' },
    { id: 'programming', label: 'Development' },
    { id: 'data', label: 'AI & Data' },
    { id: 'design', label: 'Design & Media' },
    { id: 'business', label: 'Business & Finance' }
  ];

  const courses = [
    { id: 1, title: 'BCA (Bachelor of Computer Applications)', category: 'degree', level: 'Degree', price: 45000, image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2000&auto=format&fit=crop', description: 'Full-time undergraduate program in computer applications and software development.', features: ['3 Years', 'University Degree', 'Placement Support'] },
    { id: 2, title: 'O-LEVEL', category: 'certification', level: 'Certification', price: 15000, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop', description: 'Foundation course in computer applications recognized by the government.', features: ['1 Year', 'Govt. Recognized', 'IT Tools'] },
    { id: 3, title: 'DIT (Diploma in IT)', category: 'diploma', level: 'Diploma', price: 12000, image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop', description: 'Comprehensive diploma in information technology basics and software.', features: ['6 Months', 'Practical Labs', 'Certification'] },
    { id: 4, title: 'Web Development', category: 'programming', level: 'Advanced', price: 25000, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80', description: 'Master full-stack web development using modern frameworks like React and Node.js.', features: ['React', 'Node.js', 'MongoDB'] },
    { id: 5, title: 'Data Analytics', category: 'data', level: 'Intermediate', price: 30000, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80', description: 'Learn to analyze data and build visualizations using Python and PowerBI.', features: ['Python', 'SQL', 'PowerBI'] },
    { id: 6, title: 'Android Development', category: 'programming', level: 'Intermediate', price: 28000, image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80', description: 'Build native and cross-platform mobile apps for Android devices.', features: ['Java/Kotlin', 'React Native', 'App Store'] },
    { id: 7, title: 'Video Editing', category: 'design', level: 'Beginner', price: 18000, image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2000&auto=format&fit=crop', description: 'Professional video editing and motion graphics creation.', features: ['Premiere Pro', 'After Effects', 'Color Grading'] },
    { id: 8, title: 'Agentic AI', category: 'data', level: 'Advanced', price: 40000, image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop', description: 'Build autonomous AI agents and integrate large language models.', features: ['LLMs', 'LangChain', 'Autonomous Agents'] },
    { id: 9, title: 'ADCA', category: 'diploma', level: 'Diploma', price: 18000, image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2000&auto=format&fit=crop', description: 'Advanced Diploma in Computer Applications covering advanced IT skills.', features: ['1 Year', 'Advanced Tools', 'Project Work'] },
    { id: 10, title: 'CCC', category: 'certification', level: 'Beginner', price: 5000, image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2000&auto=format&fit=crop', description: 'Course on Computer Concepts, essential for government jobs.', features: ['3 Months', 'Basic IT', 'Govt. Approved'] },
    { id: 11, title: 'BCC', category: 'certification', level: 'Beginner', price: 4000, image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=2000&auto=format&fit=crop', description: 'Basic Computer Course for absolute beginners in digital literacy.', features: ['2 Months', 'Fundamentals', 'Internet'] },
    { id: 12, title: 'Accounting Tally', category: 'business', level: 'Intermediate', price: 12000, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2000&auto=format&fit=crop', description: 'Computerized accounting and taxation using Tally Prime.', features: ['Tally Prime', 'GST', 'Taxation'] }
  ];

  const filteredCourses = courses.filter(course => 
    selectedCategory === 'all' || course.category === selectedCategory
  );

  return (
    <section className="bg-white text-slate-900 py-32 relative overflow-hidden" id="courses">
      
      {/* Premium Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-blue-100 rounded-full blur-[150px] pointer-events-none opacity-50 mix-blend-multiply"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs md:text-sm font-sans tracking-[0.2em] text-blue-600 uppercase mb-6 border border-blue-200 px-4 py-1 rounded-full bg-blue-50/50 backdrop-blur-md font-semibold shadow-sm"
          >
            Elite Programs
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display uppercase tracking-tight text-slate-900 mb-6 drop-shadow-sm"
          >
            Curated <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400">Curriculum</span>
          </motion.h2>
        </div>

        {/* Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2.5 rounded-full font-mono text-[11px] uppercase tracking-[2px] transition-all duration-500 ${
                selectedCategory === category.id 
                ? 'bg-slate-900 text-white shadow-[0_10px_20px_rgba(15,23,42,0.2)] font-bold scale-105 border border-slate-900' 
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Course Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredCourses.map((course) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={course.id} 
                className="group relative rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-2xl overflow-hidden hover:border-blue-400/50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,102,255,0.08)] hover:-translate-y-2 flex flex-col"
              >
                <div className="relative h-64 overflow-hidden rounded-t-3xl m-2 mb-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10 transition-opacity group-hover:opacity-80"></div>
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[0.16,1,0.3,1]" 
                  />
                  
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[1px] z-20 text-slate-800 font-bold shadow-sm">
                    {course.level}
                  </div>
                </div>

                <div className="p-8 relative z-20 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-display uppercase tracking-[1px] text-slate-900 group-hover:text-blue-600 transition-colors mb-4 font-bold leading-tight">
                      {course.title}
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed mb-6 font-sans">
                      {course.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {course.features.map((feature, idx) => (
                        <span key={idx} className="text-[10px] font-mono uppercase tracking-[1px] border border-slate-200 bg-slate-50 rounded-md px-2.5 py-1 text-slate-600 shadow-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-[2px] text-slate-400 mb-1">Tuition</div>
                      <div className="text-xl font-bold text-slate-900">
                        ₹{course.price.toLocaleString()}
                      </div>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-[0_10px_20px_rgba(0,102,255,0.3)]">
                      <ArrowRight size={20} className="group-hover:-rotate-45 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Courses;