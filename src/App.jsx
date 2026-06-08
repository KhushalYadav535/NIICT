import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import WhatsAppChat from './components/WhatsAppChat';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Courses from './components/Courses';
import StudentPortal from './pages/StudentPortal';
import Testimonial from './components/Testimonial';
import Admission from './pages/Admission';
import AdmitCardLookup from './pages/AdmitCardLookup';
import CompetitionForm from './components/CompetitionForm';
import Results from './pages/Results';
import AdminDashboard from './components/admin/AdminDashboard';
import CompetitionManagement from './components/admin/CompetitionManagement';
import ResultManagement from './components/admin/ResultManagement';
import CourseManagement from './components/admin/CourseManagement';
import JobManagement from './components/admin/JobManagement';
import NewsManagement from './components/admin/NewsManagement';
import MentorManagement from './components/admin/MentorManagement';
import FlashcardManagement from './components/admin/FlashcardManagement';
import PaperManagement from './components/admin/PaperManagement';
import InterviewManagement from './components/admin/InterviewManagement';
import PrintAdmission from './components/admin/PrintAdmission';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Admin routes moved to the ProtectedRoute section below */}
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/competition" element={<CompetitionForm />} />
          <Route path="/results" element={<Results />} />
          <Route path="/admit-card" element={<AdmitCardLookup />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/student-portal" element={<StudentPortal />} />
          <Route path="/student-portal/:section" element={<StudentPortal />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/print/:id" 
            element={
              <ProtectedRoute>
                <PrintAdmission />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/competition" 
            element={
              <ProtectedRoute>
                <CompetitionManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/results" 
            element={
              <ProtectedRoute>
                <ResultManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/courses" 
            element={
              <ProtectedRoute>
                <CourseManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/jobs" 
            element={
              <ProtectedRoute>
                <JobManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/news" 
            element={
              <ProtectedRoute>
                <NewsManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/mentors" 
            element={
              <ProtectedRoute>
                <MentorManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/flashcards" 
            element={
              <ProtectedRoute>
                <FlashcardManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/papers" 
            element={
              <ProtectedRoute>
                <PaperManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/interview" 
            element={
              <ProtectedRoute>
                <InterviewManagement />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <div className="chat-icons-container">
          <ChatBot />
          <WhatsAppChat />
        </div>
        <ScrollToTop />
        <Footer />
      </div>
    </Router>
  );
}

export default App;