import React from 'react';
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
import AdminDashboard from './components/admin/AdminDashboard';
import PrintAdmission from './components/admin/PrintAdmission';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/student-portal" element={<StudentPortal />} />
          <Route path="/student-portal/:section" element={<StudentPortal />} />
          <Route path="/admin-login" element={<AdminLogin />} />
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