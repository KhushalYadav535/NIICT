import React, { useState } from 'react';
import { Keyboard, Search } from 'lucide-react';

const TypingResult = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for UI
  const students = [
    { id: 'STU005', name: 'Sonia Verma', session: '2023-24', course: 'Hindi & English Typing', speedEng: 45, speedHin: 32, grade: 'A' },
    { id: 'STU006', name: 'Manish Tiwari', session: '2023-24', course: 'English Typing', speedEng: 52, speedHin: null, grade: 'A+' },
  ];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Keyboard className="text-indigo-600" size={28} />
            Typing Results
          </h2>
          <p className="text-slate-500 mt-1">View typing speed and grades for typing course students.</p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search student..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
          />
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Student ID</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Student Name</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Course</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm text-center">English (WPM)</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm text-center">Hindi (WPM)</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm text-center">Final Grade</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-700">{student.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500">{student.session}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-sm">
                      {student.course}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {student.speedEng ? (
                      <span className="font-black text-indigo-600 text-lg">{student.speedEng}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {student.speedHin ? (
                      <span className="font-black text-indigo-600 text-lg">{student.speedHin}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-black flex items-center justify-center mx-auto text-lg border-2 border-emerald-200">
                      {student.grade}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">No typing results found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TypingResult;
