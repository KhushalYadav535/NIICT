import React, { useState, useRef, useEffect } from 'react';
import { Award, Search, Download, Printer, X } from 'lucide-react';
import html2canvas from 'html2canvas';

const FinalResult = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewMode, setViewMode] = useState(null); // 'marksheet' or 'certificate'
  const [franchiseProfile, setFranchiseProfile] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const data = localStorage.getItem('franchiseData');
    if (data) {
      setFranchiseProfile(JSON.parse(data));
    }
  }, []);
  
  // Mock data for UI
  const students = [
    { 
      id: 'STU001', 
      name: 'Rahul Sharma',
      fatherName: 'Mr. Ramesh Sharma',
      motherName: 'Mrs. Sunita Sharma',
      dob: '15-Aug-2001',
      session: '2023-24', 
      course: 'ADCA',
      duration: '12 Months',
      issueDate: '15-Nov-2023',
      grade: 'A+',
      totalMarks: 500,
      obtainedMarks: 420,
      subjects: [
        { name: 'Computer Fundamentals', max: 100, obt: 85 },
        { name: 'Operating System (Windows)', max: 100, obt: 78 },
        { name: 'MS Office (Word, Excel, PowerPoint)', max: 100, obt: 92 },
        { name: 'Internet & Web Design', max: 100, obt: 88 },
        { name: 'Programming in C', max: 100, obt: 77 }
      ]
    },
    { 
      id: 'STU003', 
      name: 'Amit Kumar', 
      fatherName: 'Mr. Suresh Kumar',
      motherName: 'Mrs. Anita Devi',
      dob: '22-Jan-2002',
      session: '2023-24', 
      course: 'Tally Prime', 
      duration: '3 Months',
      issueDate: '15-Nov-2023',
      grade: 'A',
      totalMarks: 300,
      obtainedMarks: 245,
      subjects: [
        { name: 'Basics of Accounting', max: 100, obt: 82 },
        { name: 'Tally Prime Features', max: 100, obt: 85 },
        { name: 'GST & Taxation', max: 100, obt: 78 }
      ]
    },
  ];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (student, type) => {
    setSelectedStudent(student);
    setViewMode(type);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!printRef.current) return;
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `${selectedStudent.name}_${viewMode}.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Award className="text-indigo-600" size={28} />
            Final Results & Marksheets
          </h2>
          <p className="text-slate-500 mt-1">View final results and download digital marksheets.</p>
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

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Student ID</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Student Info</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm">Issue Date</th>
                <th className="py-4 px-6 font-semibold text-slate-600 text-sm text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-700">{student.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 mb-1">{student.name}</p>
                    <div className="flex gap-2">
                      <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">{student.session}</span>
                      <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded">{student.course}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{student.issueDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => handleAction(student, 'marksheet')}
                        className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                      >
                        <Printer size={16} /> Marksheet
                      </button>
                      <button 
                        onClick={() => handleAction(student, 'certificate')}
                        className="flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                      >
                        <Download size={16} /> Certificate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">No generated results found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Print View */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm print:static print:bg-white print:p-0 print:block">
          
          <div className="bg-slate-100 rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative print:w-[210mm] print:h-[297mm] print:p-0 print:bg-white print:overflow-hidden print:max-w-none print:shadow-none">
            
            {/* Modal Controls (Hidden in Print) */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20 px-6 py-4 border-b border-slate-200 flex justify-between items-center print:hidden">
              <h3 className="text-xl font-bold text-slate-800 capitalize">
                {viewMode} Preview - {selectedStudent.name}
              </h3>
              <div className="flex gap-3">
                {viewMode === 'marksheet' ? (
                  <button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                    <Printer size={16} /> Print Full Page
                  </button>
                ) : (
                  <button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                    <Download size={16} /> Download as PNG
                  </button>
                )}
                <button onClick={() => setSelectedStudent(null)} className="w-10 h-10 bg-slate-200 hover:bg-red-100 hover:text-red-600 text-slate-600 rounded-full flex items-center justify-center transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-8 flex justify-center print:p-0 bg-slate-200 print:bg-white min-h-[800px]">
              
              <div 
                ref={printRef} 
                className="bg-white w-[210mm] min-h-[297mm] relative shadow-2xl print:shadow-none mx-auto overflow-hidden text-slate-800"
                style={{ padding: '40px' }}
              >
                {viewMode === 'marksheet' ? (
                  /* ================= MARKSHEET TEMPLATE ================= */
                  <div className="border-8 border-indigo-900 p-8 h-full flex flex-col relative bg-white">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                      <Award size={400} />
                    </div>

                    {/* Header */}
                    <div className="text-center border-b-2 border-indigo-900 pb-6 mb-6">
                      <h1 className="text-3xl font-black text-indigo-900 tracking-wider uppercase mb-2">Nihanshi Institute of Information & Computer Technology</h1>
                      <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Govt. Regd. ISO 9001:2015 Certified Organization</p>
                      <h2 className="text-xl font-bold bg-indigo-900 text-white inline-block px-8 py-2 rounded-full mt-4 uppercase tracking-widest">Statement of Marks</h2>
                    </div>

                    {/* Student Details Grid */}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-8 border border-slate-300 p-4 relative z-10 bg-white/50">
                      <div className="space-y-2">
                        <p><span className="font-bold w-32 inline-block">Enrollment No:</span> {selectedStudent.id}</p>
                        <p><span className="font-bold w-32 inline-block">Student Name:</span> <span className="font-black text-base">{selectedStudent.name}</span></p>
                        <p><span className="font-bold w-32 inline-block">Father's Name:</span> {selectedStudent.fatherName}</p>
                        <p><span className="font-bold w-32 inline-block">Mother's Name:</span> {selectedStudent.motherName}</p>
                      </div>
                      <div className="space-y-2">
                        <p><span className="font-bold w-32 inline-block">Course:</span> <span className="font-bold">{selectedStudent.course}</span></p>
                        <p><span className="font-bold w-32 inline-block">Duration:</span> {selectedStudent.duration}</p>
                        <p><span className="font-bold w-32 inline-block">Session:</span> {selectedStudent.session}</p>
                        <p><span className="font-bold w-32 inline-block">Center Code:</span> {franchiseProfile?.instituteName || 'ATC-001'}</p>
                      </div>
                    </div>

                    {/* Marks Table */}
                    <table className="w-full border-collapse border border-slate-400 mb-8 relative z-10 bg-white">
                      <thead>
                        <tr className="bg-indigo-50">
                          <th className="border border-slate-400 p-3 text-left">Subject Name</th>
                          <th className="border border-slate-400 p-3 text-center w-24">Max Marks</th>
                          <th className="border border-slate-400 p-3 text-center w-24">Min Marks</th>
                          <th className="border border-slate-400 p-3 text-center w-32">Marks Obtained</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedStudent.subjects.map((sub, idx) => (
                          <tr key={idx}>
                            <td className="border border-slate-400 p-3 font-medium">{sub.name}</td>
                            <td className="border border-slate-400 p-3 text-center">{sub.max}</td>
                            <td className="border border-slate-400 p-3 text-center">{sub.max * 0.4}</td>
                            <td className="border border-slate-400 p-3 text-center font-bold">{sub.obt}</td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50 font-black text-lg">
                          <td className="border border-slate-400 p-3 text-right">Grand Total:</td>
                          <td className="border border-slate-400 p-3 text-center">{selectedStudent.totalMarks}</td>
                          <td className="border border-slate-400 p-3 text-center">-</td>
                          <td className="border border-slate-400 p-3 text-center">{selectedStudent.obtainedMarks}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Grade Section */}
                    <div className="flex justify-between items-center border border-slate-300 p-4 mb-8 bg-indigo-50/50">
                      <div>
                        <p className="font-bold text-slate-700">Percentage: <span className="text-indigo-900 text-xl">{((selectedStudent.obtainedMarks / selectedStudent.totalMarks) * 100).toFixed(1)}%</span></p>
                        <p className="font-bold text-slate-700 mt-1">Result: <span className="text-green-600">PASS</span></p>
                      </div>
                      <div className="text-center border-l border-slate-300 pl-8">
                        <p className="font-bold text-slate-700 mb-1">Final Grade</p>
                        <h3 className="text-4xl font-black text-indigo-900">{selectedStudent.grade}</h3>
                      </div>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="mt-auto pt-8 flex justify-between items-end">
                      <div className="text-center">
                        <p className="font-bold text-slate-700">Issue Date: {selectedStudent.issueDate}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-48 border-b-2 border-slate-800 h-12 flex items-end justify-center">
                           <span className="font-['Brush_Script_MT',cursive] text-2xl text-blue-900">ATC Director</span>
                        </div>
                        <p className="font-bold mt-2">Center Director</p>
                      </div>
                      <div className="text-center">
                        <div className="w-48 border-b-2 border-slate-800 h-12 flex items-end justify-center">
                          <span className="font-['Brush_Script_MT',cursive] text-3xl text-blue-900">Director</span>
                        </div>
                        <p className="font-bold mt-2">Controller of Examination</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ================= CERTIFICATE TEMPLATE ================= */
                  <div className="border-[12px] border-emerald-900 p-8 h-full flex flex-col relative bg-[#fdfbf7]">
                    {/* Background Pattern/Watermark */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#065f46 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                      <Award size={600} />
                    </div>

                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-24 h-24 border-t-8 border-l-8 border-yellow-500"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-8 border-r-8 border-yellow-500"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 border-b-8 border-l-8 border-yellow-500"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 border-b-8 border-r-8 border-yellow-500"></div>

                    {/* Header */}
                    <div className="text-center mb-10 relative z-10 pt-4">
                      <h1 className="text-4xl font-black text-emerald-900 tracking-wider uppercase mb-2">Nihanshi Institute of Information & Computer Technology</h1>
                      <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">ISO 9001:2015 Certified Educational Institution</p>
                    </div>

                    {/* Certificate Title */}
                    <div className="text-center my-10 relative z-10">
                      <h2 className="text-6xl font-black text-yellow-600 tracking-widest uppercase" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Certificate
                      </h2>
                      <p className="text-xl italic text-slate-600 mt-2">of completion</p>
                    </div>

                    {/* Content */}
                    <div className="text-center space-y-6 relative z-10 max-w-2xl mx-auto flex-1">
                      <p className="text-lg text-slate-700">This is proudly presented to</p>
                      
                      <h3 className="text-5xl font-bold text-slate-900 border-b-2 border-emerald-900 inline-block pb-2 px-12" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {selectedStudent.name}
                      </h3>
                      
                      <p className="text-lg text-slate-700 leading-relaxed mt-8">
                        In recognition of successful completion of the course
                      </p>
                      
                      <h4 className="text-3xl font-black text-emerald-900 uppercase tracking-wider my-4">
                        {selectedStudent.course}
                      </h4>
                      
                      <p className="text-lg text-slate-700 leading-relaxed">
                        with duration of <strong>{selectedStudent.duration}</strong> and securing Grade <strong>{selectedStudent.grade}</strong>.
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-8 text-sm bg-white/50 p-4 border border-slate-200 rounded text-left w-3/4 mx-auto">
                        <p><span className="font-bold w-24 inline-block">Enrollment:</span> {selectedStudent.id}</p>
                        <p><span className="font-bold w-24 inline-block">Session:</span> {selectedStudent.session}</p>
                        <p><span className="font-bold w-24 inline-block">Center:</span> {franchiseProfile?.instituteName || 'ATC-001'}</p>
                        <p><span className="font-bold w-24 inline-block">Issue Date:</span> {selectedStudent.issueDate}</p>
                      </div>
                    </div>

                    {/* Footer / Signatures */}
                    <div className="mt-auto pt-12 flex justify-between items-end relative z-10 px-8">
                      <div className="text-center w-48">
                        <div className="border-b-2 border-slate-800 h-16 flex items-end justify-center pb-2">
                           <span className="font-['Brush_Script_MT',cursive] text-2xl text-emerald-900">ATC Director</span>
                        </div>
                        <p className="font-bold mt-2 text-sm uppercase tracking-wider">Center Director</p>
                      </div>
                      
                      <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-emerald-900 shadow-xl">
                        <div className="w-28 h-28 border-2 border-dashed border-emerald-900 rounded-full flex items-center justify-center text-center bg-white">
                          <Award size={48} className="text-yellow-600" />
                        </div>
                      </div>
                      
                      <div className="text-center w-48">
                        <div className="border-b-2 border-slate-800 h-16 flex items-end justify-center pb-2">
                          <span className="font-['Brush_Script_MT',cursive] text-3xl text-emerald-900">Director</span>
                        </div>
                        <p className="font-bold mt-2 text-sm uppercase tracking-wider">Managing Director</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:static { position: static !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:w-\\[210mm\\] { width: 210mm !important; }
          .print\\:h-\\[297mm\\] { height: 297mm !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:overflow-hidden { overflow: hidden !important; }
          .print\\:max-w-none { max-width: none !important; }
          
          /* The specific print reference container */
          .bg-white.w-\\[210mm\\].min-h-\\[297mm\\] {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0 !important;
            border: none;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .bg-white.w-\\[210mm\\].min-h-\\[297mm\\] * { visibility: visible; }
          
          /* Ensure no margins on page */
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}} />
    </div>
  );
};

export default FinalResult;
