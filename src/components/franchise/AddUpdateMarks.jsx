import React, { useState } from 'react';
import { FileText, Search, Save, CheckCircle } from 'lucide-react';

const AddUpdateMarks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for UI demonstration
  const [students, setStudents] = useState([
    { id: 'STU001', name: 'Rahul Sharma', session: '2023-24', course: 'ADCA', marks: 85, status: 'Generated' },
    { id: 'STU002', name: 'Priya Singh', session: '2023-24', course: 'DCA', marks: '', status: 'Pending' },
    { id: 'STU003', name: 'Amit Kumar', session: '2023-24', course: 'Tally Prime', marks: 92, status: 'Generated' },
    { id: 'STU004', name: 'Neha Gupta', session: '2023-24', course: 'ADCA', marks: '', status: 'Pending' }
  ]);

  const handleMarkChange = (id, value) => {
    setStudents(students.map(s => s.id === id ? { ...s, marks: value } : s));
  };

  const handleSaveMarks = () => {
    // Mock save
    setStudents(students.map(s => s.marks !== '' ? { ...s, status: 'Generated' } : s));
    alert('Marks have been successfully saved and results generated for students with marks!');
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <FileText className="text-indigo-600" size={28} />
            Add/Update Marks
          </h2>
          <p className="text-slate-500 mt-1">Input or update exam marks for your enrolled students.</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
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
          <button 
            onClick={handleSaveMarks}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200 flex-shrink-0"
          >
            <Save size={18} /> Save & Generate
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Student ID</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Student Name</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Session</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Course</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Marks (%)</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-700">{student.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800">{student.name}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-medium">{student.session}</td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-sm">
                      {student.course}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <input 
                      type="number"
                      value={student.marks}
                      onChange={(e) => handleMarkChange(student.id, e.target.value)}
                      placeholder="e.g. 85"
                      className="w-24 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-center font-bold"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full inline-flex ${student.status === 'Generated' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {student.status === 'Generated' && <CheckCircle size={14} />}
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddUpdateMarks;
