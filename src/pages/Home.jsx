import React, { Suspense, lazy } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import StatsSection from '../components/StatsSection';
import GKBanner from '../components/GKBanner';

const Courses = lazy(() => import('../components/Courses'));
const Team = lazy(() => import('../components/Team'));
const Testimonial = lazy(() => import('../components/Testimonial'));

const LoadingFallback = () => (
  <div className="loading">
    <div className="spinner"></div>
    Loading...
  </div>
);

function Home() {
  return (
    <div>
      <GKBanner />
      <Hero />
      <AboutSection />
      <StatsSection />
      <Suspense fallback={<LoadingFallback />}>
        <Courses />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Team />
      </Suspense>
      <Suspense fallback={<LoadingFallback />}>
        <Testimonial />
      </Suspense>
    </div>
  );
}

export default Home;
