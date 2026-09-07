import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Courses from './components/Courses';
import StudentPortal from './pages/StudentPortal';
import Testimonial from './components/Testimonial';
import Admission from './pages/Admission';
import AdmitCardLookup from './pages/AdmitCardLookup';
import Franchise from './pages/Franchise';
import FranchiseLogin from './pages/FranchiseLogin';
import FranchiseDashboard from './pages/FranchiseDashboard';
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
import FranchiseManagement from './components/admin/FranchiseManagement';
import TestManagement from './components/admin/TestManagement';
import ScheduleManagement from './components/admin/ScheduleManagement';
import DoubtManagement from './components/admin/DoubtManagement';
import PrintAdmission from './components/admin/PrintAdmission';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import AdminNavbar from './components/admin/AdminNavbar';

function AppContent() {
  const location = useLocation();
  
  // Check if current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/admin/') || 
                           location.pathname.startsWith('/franchise-dashboard');
  const isAdminRoute = location.pathname.startsWith('/admin/') && !location.pathname.startsWith('/admin/print');

  useEffect(() => {
    const handleScroll = () => {};
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      {!isDashboardRoute && <TopBar />}
      {!isDashboardRoute && <Navbar />}
      {isAdminRoute && <AdminNavbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/franchise" element={<Franchise />} />
        <Route path="/franchise-login" element={<FranchiseLogin />} />
            <Route path="/franchise-dashboard/*" element={<FranchiseDashboard />} />
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
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/print/:id" element={<ProtectedRoute><PrintAdmission /></ProtectedRoute>} />
        <Route path="/admin/competition" element={<ProtectedRoute><CompetitionManagement /></ProtectedRoute>} />
        <Route path="/admin/results" element={<ProtectedRoute><ResultManagement /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute><CourseManagement /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute><JobManagement /></ProtectedRoute>} />
        <Route path="/admin/news" element={<ProtectedRoute><NewsManagement /></ProtectedRoute>} />
        <Route path="/admin/mentors" element={<ProtectedRoute><MentorManagement /></ProtectedRoute>} />
        <Route path="/admin/flashcards" element={<ProtectedRoute><FlashcardManagement /></ProtectedRoute>} />
        <Route path="/admin/papers" element={<ProtectedRoute><PaperManagement /></ProtectedRoute>} />
        <Route path="/admin/interview" element={<ProtectedRoute><InterviewManagement /></ProtectedRoute>} />
        <Route path="/admin/franchise" element={<ProtectedRoute><FranchiseManagement /></ProtectedRoute>} />
        <Route path="/admin/tests" element={<ProtectedRoute><TestManagement /></ProtectedRoute>} />
        <Route path="/admin/schedules" element={<ProtectedRoute><ScheduleManagement /></ProtectedRoute>} />
        <Route path="/admin/doubts" element={<ProtectedRoute><DoubtManagement /></ProtectedRoute>} />
      </Routes>
      <ScrollToTop />
      {!isDashboardRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
