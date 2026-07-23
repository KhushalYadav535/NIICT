import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Filter, Edit, Printer, CheckCircle, X, Download, CreditCard } from 'lucide-react';
import html2canvas from 'html2canvas';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');

const PaidStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [cardStudent, setCardStudent] = useState(null);
  const [printing, setPrinting] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    fetchStudents();
  }, [selectedSession]);

  const fetchStudents = async () => {
    try {
      let url = `${API_BASE_URL}/api/students?status=paid`;
      if (selectedSession) {
        url += `&session=${encodeURIComponent(selectedSession)}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent({ ...student });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/students/${editingStudent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent)
      });
      if (res.ok) {
        setStudents(prev => prev.map(s => s._id === editingStudent._id ? editingStudent : s));
        setEditingStudent(null);
        alert('Student updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update student:', err);
    }
  };

  const handlePrintIdCard = (student) => {
    setCardStudent(student);
  };

  const handlePrintFromCanvas = async () => {
    if (!cardRef.current) return;
    setPrinting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ID_Card_${cardStudent.studentName || 'Student'}.png`;
      link.href = imgData;
      link.click();
      
      // Close the modal after download
      setCardStudent(null);
    } catch (err) {
      console.error('Download error:', err);
      alert('Could not generate PNG. Please try again.');
    } finally {
      setPrinting(false);
    }
  };
  const handlePrintForm = (student) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Admission Form - ${student.studentName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { text-align: center; color: #1a237e; }
            .form-group { margin-bottom: 15px; }
            label { font-weight: bold; display: block; margin-bottom: 5px; }
            .value { border-bottom: 1px solid #000; padding: 5px 0; }
          </style>
        </head>
        <body>
          <h1>NIICT Admission Form</h1>
          <div class="form-group">
            <label>Student Name:</label>
            <div class="value">${student.studentName}</div>
          </div>
          <div class="form-group">
            <label>Student ID:</label>
            <div class="value">${student.studentId}</div>
          </div>
          <div class="form-group">
            <label>Session:</label>
            <div class="value">${student.session}</div>
          </div>
          <div class="form-group">
            <label>Course:</label>
            <div class="value">${student.courseInterest || student.courseType || 'N/A'}</div>
          </div>
          <div class="form-group">
            <label>Father's Name:</label>
            <div class="value">${student.fatherName || 'N/A'}</div>
          </div>
          <div class="form-group">
            <label>Mother's Name:</label>
            <div class="value">${student.motherName || 'N/A'}</div>
          </div>
          <div class="form-group">
            <label>Contact:</label>
            <div class="value">${student.mobile}</div>
          </div>
          <div class="form-group">
            <label>Email:</label>
            <div class="value">${student.email}</div>
          </div>
          <div class="form-group">
            <label>Date of Birth:</label>
            <div class="value">${student.dob ? new Date(student.dob).toLocaleDateString() : 'N/A'}</div>
          </div>
          <div class="form-group">
            <label>Address:</label>
            <div class="value">${student.address || 'N/A'}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">

      {/* ===== ID CARD MODAL ===== */}
      {cardStudent && (() => {
        const fd = JSON.parse(localStorage.getItem('franchiseData') || '{}');
        const centreName = fd.instituteName || 'NIICT Computer Centre';
        const centreContact = fd.contact1 || cardStudent.mobile || '';
        const centreAddress = fd.instituteAddress || cardStudent.address || '';
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-sm w-full">
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-100 border-b">
                <span className="font-semibold text-gray-800">ID Card Preview</span>
                <button onClick={() => setCardStudent(null)} className="text-gray-500 hover:text-red-500">
                  <X size={20} />
                </button>
              </div>

              {/* Card preview (this is what gets captured) */}
              <div className="p-4 bg-gray-200 flex justify-center">
                {(() => {
                  // Extract short course name
                  const courseStr = cardStudent.courseInterest || cardStudent.courseType || '';
                  const match = courseStr.match(/\(([^)]+)\)/);
                  const shortCourse = match ? match[1].toUpperCase() : (courseStr.length > 20 ? courseStr.substring(0, 20) + '...' : courseStr).toUpperCase();

                  return (
                    <div
                      ref={cardRef}
                      style={{
                        width: 340, height: 540, background: '#ffffff',
                        position: 'relative', overflow: 'hidden',
                        borderRadius: 16, fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        display: 'flex', flexDirection: 'column'
                      }}
                    >
                      {/* Header */}
                      <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)', color: 'white', textAlign: 'center', padding: '24px 20px 45px', position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: -25, left: '-10%', right: '-10%', height: 50, background: '#ffffff', borderRadius: '50%' }}></div>
                        <div style={{ position: 'relative', zIndex: 2 }}>
                          <h1 style={{ fontSize: 18, fontWeight: 900, letterSpacing: 0.5, color: '#fde047', margin: '0 0 4px 0', textTransform: 'uppercase' }}>NIICT COMPUTER CENTRE</h1>
                          <div style={{ fontSize: 10, color: '#cbd5e1', letterSpacing: 1, fontWeight: 600 }}>AUTHORISED TRAINING CENTRE</div>
                        </div>
                      </div>

                      <div style={{ position: 'absolute', top: 85, left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: 'white', padding: '5px 18px', borderRadius: 20, fontSize: 11, fontWeight: 'bold', letterSpacing: 1, zIndex: 10, boxShadow: '0 4px 10px rgba(239,68,68,0.4)' }}>
                        IDENTITY CARD
                      </div>

                      {/* Body */}
                      <div style={{ padding: '35px 24px 15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 15, paddingTop: 5 }}>
                          Session : <span style={{ color: '#2563eb' }}>{cardStudent.session || '2023-24'}</span>
                        </div>

                        {/* Photo + QR */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                          <div style={{ width: 75, height: 75, background: '#f8fafc', padding: 5, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
                              <rect x="0" y="0" width="30" height="30" fill="black"/><rect x="70" y="0" width="30" height="30" fill="black"/><rect x="0" y="70" width="30" height="30" fill="black"/>
                              <rect x="5" y="5" width="20" height="20" fill="white"/><rect x="75" y="5" width="20" height="20" fill="white"/><rect x="5" y="75" width="20" height="20" fill="white"/>
                              <rect x="10" y="10" width="10" height="10" fill="black"/><rect x="80" y="10" width="10" height="10" fill="black"/><rect x="10" y="80" width="10" height="10" fill="black"/>
                              <rect x="35" y="10" width="5" height="5" fill="black"/><rect x="45" y="20" width="5" height="5" fill="black"/><rect x="55" y="15" width="15" height="5" fill="black"/>
                              <rect x="35" y="30" width="15" height="5" fill="black"/><rect x="60" y="35" width="10" height="10" fill="black"/><rect x="35" y="45" width="5" height="15" fill="black"/>
                              <rect x="45" y="55" width="20" height="5" fill="black"/><rect x="75" y="50" width="5" height="10" fill="black"/><rect x="35" y="75" width="10" height="10" fill="black"/>
                              <rect x="50" y="70" width="15" height="5" fill="black"/><rect x="65" y="80" width="20" height="5" fill="black"/>
                            </svg>
                          </div>
                          <div style={{ width: 95, height: 115, background: '#f1f5f9', borderRadius: 8, border: '2px solid #3b82f6', overflow: 'hidden', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' }}>
                            {cardStudent.profilePhoto
                              ? <img src={`${API_BASE_URL}${cardStudent.profilePhoto}`} alt="Student" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>No Photo</div>}
                          </div>
                        </div>

                        {/* Details */}
                        <div style={{ display: 'grid', gridTemplateColumns: '65px 1fr', gap: '8px 4px', fontSize: 13 }}>
                          {[
                            ['Roll No', cardStudent.studentId],
                            ['Name', cardStudent.studentName?.toUpperCase()],
                            ['Father', cardStudent.fatherName?.toUpperCase()],
                            ['DOB', cardStudent.dob ? new Date(cardStudent.dob).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'],
                            ['Contact', cardStudent.mobile],
                            ['Course', shortCourse, true],
                          ].map(([label, value, isHighlight]) => (
                            <React.Fragment key={label}>
                              <div style={{ color: '#64748b', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', paddingTop: 1 }}>{label}</div>
                              <div style={{ color: isHighlight ? '#2563eb' : '#0f172a', fontWeight: 700, display: 'flex' }}>
                                <span style={{ marginRight: 6, color: '#94a3b8' }}>:</span>
                                {value || 'N/A'}
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0', padding: '14px 24px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -2, left: 0, width: '35%', height: 2, background: '#ef4444' }}></div>
                        <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 800, marginBottom: 3, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          Centre Address
                        </div>
                        <div style={{ fontSize: 12, color: '#475569', fontWeight: 700, lineHeight: 1.4, textTransform: 'capitalize' }}>
                          {cardStudent.address || 'Janghai Prayagraj, UP'}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Print button */}
              <div className="px-5 py-4 flex justify-end gap-3 bg-gray-50 border-t">
                <button onClick={() => setCardStudent(null)} className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                  Close
                </button>
                <button
                  onClick={handlePrintFromCanvas}
                  disabled={printing}
                  className="px-6 py-2 bg-[#1a237e] text-white rounded-lg text-sm font-semibold hover:bg-[#0d1b5e] disabled:opacity-60 flex items-center gap-2"
                >
                  {printing ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : <><Download size={16} /> Save as PNG</>}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link to="/franchise-dashboard" className="text-blue-600 flex items-center gap-1 hover:underline">
          <Home size={14} /> Dashboard
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium">All Paid Student</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Filter size={16} /> Filter Session
            </div>
            
            <select 
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 md:max-w-xs"
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
            >
              <option value="">All</option>
              <option value="2022-23">2022-23</option>
              <option value="2023-24">2023-24</option>
              <option value="2024-25">2024-25</option>
            </select>
          </div>

        {/* Exam Info (optional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam For (Final Exam)</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
              <option value="">SDEI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam Start Time</label>
            <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exam End Time</label>
            <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Time</label>
            <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gate Close Time</label>
            <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
          </div>
        </div>
        
        <div className="flex justify-end mb-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
            Update
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-yellow-400 px-6 py-3">
          <h3 className="text-sm font-bold text-gray-800">All Paid Student</h3>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Show</span>
              <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>entries</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Search:</span>
              <input type="text" className="px-2 py-1 border border-gray-300 rounded text-sm" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-700 font-medium">
                  <th className="p-2 text-left border-b">Sr.</th>
                  <th className="p-2 text-left border-b">
                    <div className="flex items-center gap-1">Student ID <ChevronRight size={12} /></div>
                  </th>
                  <th className="p-2 text-left border-b">
                    <div className="flex items-center gap-1">Session <ChevronRight size={12} /></div>
                  </th>
                  <th className="p-2 text-left border-b">
                    <div className="flex items-center gap-1">Name <ChevronRight size={12} /></div>
                  </th>
                  <th className="p-2 text-left border-b">
                    <div className="flex items-center gap-1">Course <ChevronRight size={12} /></div>
                  </th>
                  <th className="p-2 text-left border-b">
                    <div className="flex items-center gap-1">Contact <ChevronRight size={12} /></div>
                  </th>
                  <th className="p-2 text-left border-b">Photo</th>
                  <th className="p-2 text-left border-b">
                    <div className="flex items-center gap-1">Status <ChevronRight size={12} /></div>
                  </th>
                  <th className="p-2 text-left border-b">Action</th>
                  <th className="p-2 text-left border-b">
                    <input type="checkbox" className="rounded" /> All Select
                  </th>
                </tr>
              </thead>
              {loading ? (
                <tbody className="bg-gray-50">
                  <tr>
                    <td colSpan="10" className="p-10 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="bg-gray-50">
                  {students.map((student, index) => (
                    <tr key={student._id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2 font-medium">{student.studentId}</td>
                      <td className="p-2">{student.session}</td>
                      <td className="p-2">{student.studentName}</td>
                      <td className="p-2 text-xs max-w-xs">{student.courseInterest}</td>
                      <td className="p-2">{student.mobile}</td>
                      <td className="p-2">
                        {student.profilePhoto ? (
                          <img 
                            src={`${API_BASE_URL}${student.profilePhoto}`} 
                            alt="Student" 
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Photo</span>
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <CheckCircle size={16} className="text-green-600" />
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col gap-1">
                          <button onClick={() => handleEdit(student)} className="flex items-center gap-1 text-blue-600 hover:underline text-xs">
                            <Edit size={12} /> Edit
                          </button>
                          <button onClick={() => handlePrintIdCard(student)} className="flex items-center gap-1 text-blue-600 hover:underline text-xs">
                            <CreditCard size={14} /> Save as PNG
                          </button>
                          <button onClick={() => handlePrintForm(student)} className="flex items-center gap-1 text-blue-600 hover:underline text-xs">
                            <Printer size={12} /> Print Form
                          </button>
                        </div>
                      </td>
                      <td className="p-2">
                        <input type="checkbox" className="rounded" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Student</h2>
              <button onClick={() => setEditingStudent(null)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                  <input 
                    type="text"
                    value={editingStudent.studentName}
                    onChange={(e) => setEditingStudent({...editingStudent, studentName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                  <input 
                    type="text"
                    value={editingStudent.session}
                    onChange={(e) => setEditingStudent({...editingStudent, session: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <input 
                    type="text"
                    value={editingStudent.courseInterest || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, courseInterest: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input 
                    type="text"
                    value={editingStudent.mobile}
                    onChange={(e) => setEditingStudent({...editingStudent, mobile: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                  <input 
                    type="text"
                    value={editingStudent.fatherName || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, fatherName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                  <input 
                    type="text"
                    value={editingStudent.motherName || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, motherName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={editingStudent.address || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    rows={2}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setEditingStudent(null)} 
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidStudent;
