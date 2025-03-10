import React, { Suspense, lazy } from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';

// Lazy load components for better performance
const Courses = lazy(() => import('../components/Courses'));
const Features = lazy(() => import('../components/Features'));
const Testimonial = lazy(() => import('../components/Testimonial'));
const About = lazy(() => import('./About'));
const Contact = lazy(() => import('./Contact'));
// Loading component
const LoadingFallback = () => (
  <div className="loading">
    <div className="spinner"></div>
    Loading...
  </div>
);

function Home() {
  return (
    <div className="home-container">
      <Hero />
      <Suspense fallback={<LoadingFallback />}>
        <Courses />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Features />
      </Suspense>
      <Stats />
      <Suspense fallback={<LoadingFallback />}>
        <About />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Contact />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Testimonial />
      </Suspense>
    </div>
  );
}

export default Home;