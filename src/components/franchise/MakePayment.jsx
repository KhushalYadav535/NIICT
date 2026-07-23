import React, { useState, useEffect } from 'react';
import { CreditCard, Search, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');

const MakePayment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const franchiseData = JSON.parse(localStorage.getItem('franchiseData'));
      const token = localStorage.getItem('franchiseToken');
      
      const res = await fetch(`${API_BASE_URL}/api/students?franchiseId=${franchiseData._id}&status=pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch pending students', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredStudents.map(s => s._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkPayment = () => {
    if (selectedIds.length === 0) return;
    
    // In a real app, this would open a payment gateway or deduct from wallet
    const confirmPayment = window.confirm(`Proceed to pay for ${selectedIds.length} students from your wallet?`);
    if (confirmPayment) {
      alert(`Payment of ₹${selectedIds.length * 1000} successful! Students have been marked as Paid.`);
      // Mock update locally
      setStudents(students.filter(s => !selectedIds.includes(s._id)));
      setSelectedIds([]);
    }
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.enrollmentNumber && s.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalAmount = selectedIds.length * 1000; // Mock fee per student

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <CreditCard className="text-indigo-600" size={28} />
            Make Payment
          </h2>
          <p className="text-slate-500 mt-1">Select pending students to process their admission fees.</p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-3/4 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-4 px-6 w-12 text-center">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300 cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Student Name</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Course</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Contact</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 text-sm text-center">Amount Due</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-slate-500 font-medium">Loading pending students...</p>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="text-green-500" size={32} />
                      </div>
                      <p className="text-slate-600 font-medium text-lg">Hooray! No pending payments.</p>
                      <p className="text-slate-400 text-sm mt-1">All your students are fully paid.</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(student._id)}
                          onChange={() => handleSelectOne(student._id)}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300 cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={student.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=random`} 
                            alt={student.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-800">{student.fullName}</p>
                            <p className="text-xs text-slate-500">{student.session}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-slate-700">{student.courseInterest || student.courseType}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-slate-600">{student.studentMobile}</p>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-black text-slate-800">₹1,000</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full lg:w-1/4 sticky top-6">
          <div className="bg-indigo-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5 blur-xl pointer-events-none"></div>
             
             <h3 className="text-lg font-bold text-indigo-100 mb-6">Payment Summary</h3>
             
             <div className="space-y-4 mb-6">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-indigo-200">Selected Students</span>
                 <span className="font-bold">{selectedIds.length}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-indigo-200">Fee per Student</span>
                 <span className="font-bold">₹1,000</span>
               </div>
               <div className="h-px bg-indigo-800 w-full"></div>
               <div className="flex justify-between items-center">
                 <span className="text-indigo-100 font-bold uppercase tracking-wider text-sm">Total Due</span>
                 <span className="text-3xl font-black">₹{totalAmount.toLocaleString()}</span>
               </div>
             </div>

             <button 
               onClick={handleBulkPayment}
               disabled={selectedIds.length === 0}
               className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${selectedIds.length > 0 ? 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-white/20' : 'bg-indigo-800 text-indigo-400 cursor-not-allowed shadow-none'}`}
             >
               Pay Now <ArrowRight size={18} />
             </button>
             
             {selectedIds.length > 0 && (
               <p className="text-center text-xs text-indigo-300 mt-4">
                 Amount will be deducted from your wallet balance.
               </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;
