import React from 'react';
import { Monitor, Code, Database, Smartphone, Video, Bot, Terminal, Shield, Calculator, FileSpreadsheet, Keyboard, BookOpen, Layers } from 'lucide-react';

const courses = [
  { name: 'BCA', icon: <Monitor size={20} className="text-blue-500" />, color: 'bg-blue-500/10' },
  { name: 'O-LEVEL', icon: <BookOpen size={20} className="text-orange-500" />, color: 'bg-orange-500/10' },
  { name: 'DIT', icon: <Terminal size={20} className="text-indigo-500" />, color: 'bg-indigo-500/10' },
  { name: 'WEB DEV', icon: <Code size={20} className="text-cyan-500" />, color: 'bg-cyan-500/10' },
  { name: 'DATA ANALYTICS', icon: <Database size={20} className="text-green-500" />, color: 'bg-green-500/10' },
  { name: 'ANDROID DEV', icon: <Smartphone size={20} className="text-pink-500" />, color: 'bg-pink-500/10' },
  { name: 'VIDEO EDITING', icon: <Video size={20} className="text-purple-500" />, color: 'bg-purple-500/10' },
  { name: 'AGENTIC AI', icon: <Bot size={20} className="text-teal-500" />, color: 'bg-teal-500/10' },
  { name: 'ADCA', icon: <Layers size={20} className="text-sky-500" />, color: 'bg-sky-500/10' },
  { name: 'CCC', icon: <Keyboard size={20} className="text-yellow-500" />, color: 'bg-yellow-500/10' },
  { name: 'BCC', icon: <Shield size={20} className="text-red-500" />, color: 'bg-red-500/10' },
  { name: 'ACCOUNTING', icon: <Calculator size={20} className="text-emerald-500" />, color: 'bg-emerald-500/10' },
  { name: 'TALLY', icon: <FileSpreadsheet size={20} className="text-blue-400" />, color: 'bg-blue-400/10' },
];

const CourseMarquee = () => {
  // We duplicate the courses array a few times to ensure seamless infinite scrolling
  const duplicatedCourses = [...courses, ...courses, ...courses, ...courses];

  return (
    <div className="w-full bg-[#0A0F1C] py-8 overflow-hidden relative border-y border-slate-800">
      
      {/* Edge Gradients for smooth fade in/out */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0A0F1C] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0A0F1C] to-transparent z-10 pointer-events-none"></div>

      <div className="animate-marquee gap-6 items-center px-4">
        {duplicatedCourses.map((course, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-4 bg-[#111827] border border-slate-800 hover:border-slate-600 rounded-2xl px-6 py-4 cursor-pointer transition-all duration-300 hover:bg-[#1F2937] min-w-max"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${course.color} shadow-inner`}>
              {course.icon}
            </div>
            <span className="font-display uppercase tracking-wide text-slate-300 text-lg font-medium">{course.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseMarquee;
