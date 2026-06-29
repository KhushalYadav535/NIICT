import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { 
    id: 1, 
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2000',
    mainTitle: 'NIICT',
    subTitle: 'A Professional Computer',
    highlightTitle: 'Training Institute',
    bottomText: 'Education For',
    bottomHighlight: 'EveryOne'
  },
  { 
    id: 2, 
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=2000',
    mainTitle: 'Your',
    subTitle: 'career starts with',
    highlightTitle: 'our computer education',
    bottomText: '',
    bottomHighlight: ''
  },
  { 
    id: 3, 
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000',
    mainTitle: 'NIICT',
    subTitle: 'A Professional Computer',
    highlightTitle: 'Training Institute',
    bottomText: 'Education For',
    bottomHighlight: 'EveryOne'
  },
  { 
    id: 4, 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
    mainTitle: 'Your',
    subTitle: 'career starts with',
    highlightTitle: 'our computer education',
    bottomText: '',
    bottomHighlight: ''
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = () => goTo((current + 1) % slides.length);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  // Reset timer on manual navigation
  const handleManualNav = (fn) => {
    clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);
  };

  return (
    <section>
      {/* ── Full-width Image Slider (SDEI-style) with text overlays ── */}
      <div className="sdei-slider relative w-full overflow-hidden bg-white select-none">
        {/* Slides */}
        <div className="relative w-full h-[320px] sm:h-[420px] md:h-[520px] lg:h-[580px]">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={`NIICT Banner ${idx + 1}`}
                className="w-full h-full object-cover object-center brightness-100 contrast-100"
                draggable={false}
              />
              {/* Text Overlay like SDEI */}
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-7xl mx-auto px-6 w-full">
                  <div className="relative z-20">
                    {/* Decorative left element */}
                    <div className="absolute -left-4 top-0 w-1 h-16 bg-blue-600"></div>
                    
                    <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-light mb-2 ml-2">
                      {slide.mainTitle}
                    </h2>
                    <h3 className="text-white text-2xl md:text-4xl lg:text-5xl font-light mb-2 ml-2">
                      {slide.subTitle}
                    </h3>
                    <h3 className="text-orange-400 text-2xl md:text-4xl lg:text-5xl font-semibold mb-6 ml-2">
                      {slide.highlightTitle}
                    </h3>
                    
                    {(slide.bottomText || slide.bottomHighlight) && (
                      <div className="mt-8 ml-2">
                        <span className="text-white text-xl md:text-2xl font-light">
                          {slide.bottomText}
                        </span>
                        <span className="text-white text-xl md:text-2xl font-bold ml-2">
                          {slide.bottomHighlight}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() => handleManualNav(prev)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => handleManualNav(next)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleManualNav(() => goTo(idx))}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
                idx === current ? 'bg-white scale-110' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
