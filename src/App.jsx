import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Courses from './components/Courses';
import StudentPortal from './pages/StudentPortal';
import Testimonial from './components/Testimonial';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/testimonial" element={<Testimonial />} />
          <Route path="/student-portal/:section" element={<StudentPortal />} />
          <Route path="/student-portal" element={<StudentPortal />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;