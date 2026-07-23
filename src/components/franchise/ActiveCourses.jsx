import React, { useState, useEffect } from 'react';
import { BookOpen, Eye, Search, AlertCircle, FileText } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');

const ActiveCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null); // For modal view

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <BookOpen className="text-indigo-600" size={28} />
            Active Courses
          </h2>
          <p className="text-slate-500 mt-1">View list of all available active courses and their details.</p>
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm w-16">Sr No.</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Course Name</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Course Fees</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Duration</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Level</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-slate-500 font-medium">Loading courses...</p>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <AlertCircle className="text-slate-400" size={32} />
                    </div>
                    <p className="text-slate-500 font-medium text-lg">No active courses found.</p>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course, index) => (
                  <tr key={course._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-500 font-medium">{index + 1}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="text-indigo-600" size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{course.title}</p>
                          {course.discount && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block mt-1">
                              {course.discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">₹{course.price}</span>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <span className="text-xs text-slate-400 line-through">₹{course.originalPrice}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{course.duration}</td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                        {course.level || 'Standard'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <button 
                          onClick={() => setSelectedCourse(course)}
                          className="flex items-center gap-2 bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                        >
                          <Eye size={16} /> View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden relative flex flex-col">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800">Course Details</h3>
              <button 
                onClick={() => setSelectedCourse(null)}
                className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center transition-colors font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {selectedCourse.image && (
                  <div className="w-full md:w-1/3">
                    <img 
                      src={selectedCourse.image} 
                      alt={selectedCourse.title} 
                      className="w-full h-auto object-cover rounded-2xl shadow-sm border border-slate-100"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-3xl font-black text-slate-800">{selectedCourse.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full">
                        {selectedCourse.duration}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                        {selectedCourse.level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-slate-600 leading-relaxed">{selectedCourse.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Course Fee</p>
                      <p className="text-2xl font-black text-slate-800">₹{selectedCourse.price}</p>
                    </div>
                    {selectedCourse.originalPrice && (
                      <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Original Fee</p>
                        <p className="text-xl font-bold text-slate-400 line-through">₹{selectedCourse.originalPrice}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedCourse.features && selectedCourse.features.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className="text-indigo-500" /> Key Features
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCourse.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                        <span className="text-slate-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-indigo-500" /> Syllabus / Semesters
                  </h4>
                  <div className="space-y-4">
                    {selectedCourse.syllabus.map((item, i) => (
                      <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-indigo-200 hover:shadow-sm transition-all">
                        <h5 className="font-bold text-slate-800 text-lg mb-2">{item.title}</h5>
                        <p className="text-slate-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex justify-end">
              <button 
                onClick={() => setSelectedCourse(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-xl font-bold transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveCourses;
