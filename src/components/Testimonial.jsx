import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Ravi Yadav',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    text: 'All notes were easy to read, and I found the homework challenging, but not impossible. I enjoyed researching! Very good. Lots of feedback!',
  },
  {
    id: 2,
    name: 'Aman Kumar',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    text: 'I had a great time doing this course and everyone involved in the NIICT has made it a great experience. I look forward to doing more courses with you guys in the future.',
  },
  {
    id: 3,
    name: 'Reena Singh',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&q=80&w=150',
    text: 'Loved every minute studying and gained great knowledge. Looking forward to life as a professional and being part of changing lives for the better.',
  },
  {
    id: 4,
    name: 'Pooja Verma',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    text: 'No difficulties for me, I found everything was just right. Always had good feedback after handing in assessments with some good advice attached.',
  },
  {
    id: 5,
    name: 'Akash Patel',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    text: 'I would like to thank you for the helpful guidance provided by the NIICT department. I am happy with my teachers who are very efficient.',
  },
];

const Testimonial = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);

  return (
    <section id="testim" className="testim py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Students Says <span className="text-[#245894]">About NIICT</span>
          </h2>
        </div>
      </div>

      <div className="wrap max-w-4xl mx-auto px-6 relative">
        {/* Arrows */}
        <button onClick={prev} className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#245894] transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#245894] transition-colors">
          <ChevronRight size={20} />
        </button>

        {/* Testimonial Content */}
        <div id="testim-content" className="cont min-h-[300px] flex items-center justify-center">
          {testimonials.map((t, idx) => (
            <div key={t.id} className={`transition-all duration-500 text-center px-8 ${idx === current ? 'block' : 'hidden'}`}>
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-[#245894]/20 mb-6">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t.name}</h2>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto italic">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Dots */}
        <ul id="testim-dots" className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, idx) => (
            <li key={idx} className="list-none">
              <button
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === current ? 'bg-[#245894] w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Testimonial;
