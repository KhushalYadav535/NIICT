import React, { useState } from 'react';
import { Calendar, Search, RefreshCw, CheckCircle } from 'lucide-react';

const SemesterResult = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('generated');
  
  // Mock data for UI
  const students = [
    { id: 'STU010', name: 'Vikas Patel', session: '2023-24', course: 'ADCA', semester: 'Semester 1', marks: 88, status: 'generated' },
    { id: 'STU011', name: 'Pooja Singh', session: '2023-24', course: 'PGDCA', semester: 'Semester 1', marks: 91, status: 'generated' },
    { id: 'STU012', name: 'Rohan Sharma', session: '2023-24', course: 'ADCA', semester: 'Semester 2', marks: null, status: 'online' },
  ];

  const filteredStudents = students.filter(s => 
    s.status === activeTab &&
    (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     s.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Calendar className="text-indigo-600" size={28} />
            Semester Results
          </h2>
          <p className="text-slate-500 mt-1">Manage generated and pending online semester results.</p>
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
        
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('generated')}
            className={`flex-1 py-4 font-bold text-sm tracking-wide transition-all ${activeTab === 'generated' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Generated Results
          </button>
          <button 
            onClick={() => setActiveTab('online')}
            className={`flex-1 py-4 font-bold text-sm tracking-wide transition-all ${activeTab === 'online' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Pending Online Results
          </button>
        </div>

        <div className="overflow-x-auto p-4 md:p-6">
          {activeTab === 'online' && filteredStudents.length > 0 && (
            <div className="mb-6 flex justify-end">
              <button 
                onClick={() => alert('Processing selected marks... Results will be generated shortly!')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200"
              >
                <RefreshCw size={18} /> Generate Selected Marks
              </button>
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {activeTab === 'online' && <th className="py-4 px-4 w-12"><input type="checkbox" className="w-4 h-4 rounded text-indigo-600" /></th>}
                <th className="py-4 px-4 font-semibold text-slate-600 text-sm">Student Info</th>
                <th className="py-4 px-4 font-semibold text-slate-600 text-sm">Course & Semester</th>
                <th className="py-4 px-4 font-semibold text-slate-600 text-sm text-center">Marks (%)</th>
                <th className="py-4 px-4 font-semibold text-slate-600 text-sm text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                  {activeTab === 'online' && <td className="py-4 px-4"><input type="checkbox" className="w-4 h-4 rounded text-indigo-600" /></td>}
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-800">{student.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{student.id} | {student.session}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded">{student.course}</span>
                      <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">{student.semester}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {student.marks ? (
                      <span className="font-black text-emerald-600 text-lg">{student.marks}%</span>
                    ) : (
                      <span className="text-slate-400 text-sm italic">Not Generated</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {activeTab === 'generated' ? (
                      <button 
                        onClick={() => alert(`Opening update form for ${student.name}...`)}
                        className="text-indigo-600 font-bold hover:underline text-sm"
                      >
                        Update Marks
                      </button>
                    ) : (
                      <span className="text-amber-600 font-bold text-sm flex items-center justify-center gap-1">
                        Pending <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={activeTab === 'online' ? "5" : "4"} className="py-12 text-center text-slate-500">
                    No {activeTab} results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SemesterResult;
