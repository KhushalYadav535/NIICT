import React from 'react';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import Features from '../components/Features';
import Stats from '../components/Stats';
import Contact from '../components/Contact';
import Testimonial from '../components/Testimonial';
import About from './About';
function Home() {
  return (
    <div>
      <Hero />
      <Courses />
      <Features />
      <Stats />
      <About/>
      <Contact />
      <Testimonial/>
    </div>
  );
}

export default Home;