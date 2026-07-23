import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Filter, Plus, Edit, Printer, XCircle, Trash2, FileText, CreditCard } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');

const PendingStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [selectedSession]);

  const fetchStudents = async () => {
    try {
      let url = `${API_BASE_URL}/api/students?status=pending`;
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

  const markAsPaid = async (studentId) => {
    if (confirm('Are you sure you want to mark this student as paid?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'paid' })
        });
        
        if (response.ok) {
          alert('Student marked as paid!');
          fetchStudents();
        }
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    }
  };

  const deleteStudent = async (studentId) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/students/${studentId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          alert('Student deleted!');
          fetchStudents();
        }
      } catch (err) {
        console.error('Failed to delete student:', err);
      }
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
    // Extract short course name
    const courseStr = student.courseInterest || student.courseType || '';
    const match = courseStr.match(/\(([^)]+)\)/);
    const shortCourse = match ? match[1].toUpperCase() : (courseStr.length > 20 ? courseStr.substring(0, 20) + '...' : courseStr).toUpperCase();

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>ID Card - ${student.studentName}</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #eef2f6; padding: 20px; }
            .toolbar { margin-bottom: 20px; display: flex; justify-content: flex-end; width: 340px; }
            .toolbar button { background: #4f46e5; color: white; border: none; padding: 10px 24px; font-weight: 600; font-size: 14px; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); transition: all 0.2s; }
            .toolbar button:hover { background: #4338ca; transform: translateY(-1px); }
            
            .id-card {
              width: 340px;
              height: 540px;
              background: #ffffff;
              border-radius: 16px;
              position: relative;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.15);
              display: flex;
              flex-direction: column;
            }
            
            .header {
              background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
              color: white;
              text-align: center;
              padding: 24px 20px 45px;
              position: relative;
            }
            .header::after {
              content: '';
              position: absolute;
              bottom: -25px;
              left: -10%;
              right: -10%;
              height: 50px;
              background: #ffffff;
              border-radius: 50%;
            }
            .header h1 {
              font-size: 18px;
              font-weight: 900;
              letter-spacing: 0.5px;
              color: #fde047;
              margin-bottom: 4px;
              text-transform: uppercase;
            }
            .header .subtitle {
              font-size: 10px;
              color: #cbd5e1;
              letter-spacing: 1px;
              font-weight: 600;
            }
            
            .id-badge {
              position: absolute;
              top: 85px;
              left: 50%;
              transform: translateX(-50%);
              background: #ef4444;
              color: white;
              padding: 5px 18px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: bold;
              letter-spacing: 1px;
              z-index: 10;
              box-shadow: 0 4px 10px rgba(239,68,68,0.4);
            }
            
            .body-content {
              padding: 35px 24px 15px;
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            
            .profile-section {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 20px;
            }
            
            .qr-wrapper {
              width: 75px;
              height: 75px;
              background: #f8fafc;
              padding: 5px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .qr-wrapper svg { width: 100%; height: 100%; }
            
            .photo-wrapper {
              width: 95px;
              height: 115px;
              background: #f1f5f9;
              border-radius: 8px;
              border: 2px solid #3b82f6;
              overflow: hidden;
              box-shadow: 0 4px 12px rgba(59,130,246,0.25);
            }
            .photo-wrapper img { width: 100%; height: 100%; object-fit: cover; }
            .no-photo { width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#94a3b8; font-size: 12px; font-weight:600; }
            
            .details-grid {
              display: grid;
              grid-template-columns: 65px 1fr;
              gap: 8px 4px;
              font-size: 13px;
            }
            .label {
              color: #64748b;
              font-weight: 700;
              font-size: 11px;
              text-transform: uppercase;
              padding-top: 1px;
            }
            .value {
              color: #0f172a;
              font-weight: 700;
              display: flex;
            }
            .value::before {
              content: ':';
              margin-right: 6px;
              color: #94a3b8;
            }
            .value.highlight {
              color: #2563eb;
            }
            
            .footer {
              background: #f8fafc;
              border-top: 2px solid #e2e8f0;
              padding: 14px 24px;
              position: relative;
            }
            .footer::before {
              content: '';
              position: absolute;
              top: -2px;
              left: 0;
              width: 35%;
              height: 2px;
              background: #ef4444;
            }
            .footer .address-title {
              font-size: 10px;
              color: #ef4444;
              font-weight: 800;
              margin-bottom: 3px;
              text-transform: uppercase;
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .footer .address-text {
              font-size: 12px;
              color: #475569;
              font-weight: 700;
              line-height: 1.4;
              text-transform: capitalize;
            }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <button onclick="downloadPNG(this)">Save as PNG</button>
          </div>
          <div class="id-card">
            <div class="header">
              <h1>NIICT COMPUTER CENTRE</h1>
              <div class="subtitle">AUTHORISED TRAINING CENTRE</div>
            </div>
            
            <div class="id-badge">IDENTITY CARD</div>
            
            <div class="body-content">
              <div style="text-align:center; font-size:12px; font-weight:800; color:#334155; margin-bottom:15px; padding-top: 5px;">
                Session : <span style="color:#2563eb;">${student.session || '2023-24'}</span>
              </div>
              
              <div class="profile-section">
                <div class="qr-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="30" height="30" fill="black"/><rect x="70" y="0" width="30" height="30" fill="black"/><rect x="0" y="70" width="30" height="30" fill="black"/>
                    <rect x="5" y="5" width="20" height="20" fill="white"/><rect x="75" y="5" width="20" height="20" fill="white"/><rect x="5" y="75" width="20" height="20" fill="white"/>
                    <rect x="10" y="10" width="10" height="10" fill="black"/><rect x="80" y="10" width="10" height="10" fill="black"/><rect x="10" y="80" width="10" height="10" fill="black"/>
                    <rect x="35" y="10" width="5" height="5" fill="black"/><rect x="45" y="20" width="5" height="5" fill="black"/><rect x="55" y="15" width="15" height="5" fill="black"/>
                    <rect x="35" y="30" width="15" height="5" fill="black"/><rect x="60" y="35" width="10" height="10" fill="black"/><rect x="35" y="45" width="5" height="15" fill="black"/>
                    <rect x="45" y="55" width="20" height="5" fill="black"/><rect x="75" y="50" width="5" height="10" fill="black"/><rect x="35" y="75" width="10" height="10" fill="black"/>
                    <rect x="50" y="70" width="15" height="5" fill="black"/><rect x="65" y="80" width="20" height="5" fill="black"/>
                  </svg>
                </div>
                <div class="photo-wrapper">
                  ${student.profilePhoto ? `<img src="${API_BASE_URL}${student.profilePhoto}" crossorigin="anonymous" />` : `<div class="no-photo">No Photo</div>`}
                </div>
              </div>
              
              <div class="details-grid">
                <div class="label">Roll No</div>
                <div class="value">${student.studentId || 'N/A'}</div>
                
                <div class="label">Name</div>
                <div class="value">${student.studentName?.toUpperCase() || 'N/A'}</div>
                
                <div class="label">Father</div>
                <div class="value">${student.fatherName?.toUpperCase() || 'N/A'}</div>
                
                <div class="label">DOB</div>
                <div class="value">${student.dob ? new Date(student.dob).toLocaleDateString('en-IN', { day:'2-digit', month:'2-digit', year:'numeric' }) : 'N/A'}</div>
                
                <div class="label">Contact</div>
                <div class="value">${student.mobile || 'N/A'}</div>
                
                <div class="label">Course</div>
                <div class="value highlight">${shortCourse}</div>
              </div>
            </div>
            
            <div class="footer">
              <div class="address-title">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                Centre Address
              </div>
              <div class="address-text">${student.address || 'Janghai Prayagraj, UP'}</div>
            </div>
          </div>
          <script>
            function downloadPNG(btn) {
              btn.innerText = "Processing...";
              btn.disabled = true;
              setTimeout(() => {
                html2canvas(document.querySelector('.id-card'), {
                  scale: 3, // High quality
                  useCORS: true,
                  backgroundColor: null
                }).then(canvas => {
                  const link = document.createElement('a');
                  link.download = 'ID_Card_${student.studentName || 'Student'}.png';
                  link.href = canvas.toDataURL('image/png');
                  link.click();
                  btn.innerText = "Save as PNG";
                  btn.disabled = false;
                }).catch(err => {
                  console.error('Error generating image:', err);
                  alert('Could not generate PNG. Please try again.');
                  btn.innerText = "Save as PNG";
                  btn.disabled = false;
                });
              }, 100);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
    <div className="w-full bg-white min-h-screen -m-6 p-6">
      {/* Top action row */}
      <div className="flex justify-end mb-4">
        <button className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">
          Update
        </button>
      </div>

      {/* Main Panel */}
      <div className="border border-gray-200 shadow-sm bg-white">
        {/* Yellow Header */}
        <div className="bg-[#ffc107] px-4 py-2.5 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-800">All Pending Student</h3>
        </div>
        
        {/* Controls */}
        <div className="p-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Show</span>
            <select className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Search:</span>
            <input type="text" className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto px-4 pb-4">
          <table className="w-full text-sm border-t border-l border-r border-gray-200">
            <thead>
              <tr className="border-b border-gray-200 text-gray-700 font-bold bg-white">
                <th className="p-3 text-left border-r border-gray-200 w-12">
                  <div className="flex items-center justify-between">Sr. <span className="text-gray-300 text-[10px]">⇅</span></div>
                </th>
                <th className="p-3 text-left border-r border-gray-200">
                  <div className="flex items-center justify-between">Student<br/>ID <span className="text-gray-300 text-[10px]">⇅</span></div>
                </th>
                <th className="p-3 text-left border-r border-gray-200">
                  <div className="flex items-center justify-between">Session <span className="text-gray-300 text-[10px]">⇅</span></div>
                </th>
                <th className="p-3 text-left border-r border-gray-200 min-w-[150px]">
                  <div className="flex items-center justify-between">Name <span className="text-gray-300 text-[10px]">⇅</span></div>
                </th>
                <th className="p-3 text-left border-r border-gray-200 min-w-[200px]">
                  <div className="flex items-center justify-between">Course <span className="text-gray-300 text-[10px]">⇅</span></div>
                </th>
                <th className="p-3 text-left border-r border-gray-200">
                  <div className="flex items-center justify-between">Contact <span className="text-gray-300 text-[10px]">⇅</span></div>
                </th>
                <th className="p-3 text-left border-r border-gray-200">
                  <div className="flex items-center justify-between">Photo <span className="text-gray-300 text-[10px]">⇅</span></div>
                </th>
                <th className="p-3 text-center border-r border-gray-200">
                  <div className="flex items-center justify-between">Status <span className="text-gray-300 text-[10px]">⇅</span></div>
                </th>
                <th className="p-3 text-left border-r border-gray-200 w-28">
                  <div className="flex items-center justify-between">Action <span className="text-gray-300 text-[10px]">⇅</span></div>
                </th>
                <th className="p-2 text-center w-20">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-1 font-normal"><input type="checkbox" className="rounded border-gray-300" /> All Select <span className="text-gray-300 text-[10px]">⇅</span></div>
                  </div>
                </th>
              </tr>
            </thead>
            {loading ? (
              <tbody className="bg-white">
                <tr>
                  <td colSpan="10" className="p-10 text-center text-gray-500 border-b border-gray-200">
                    Loading...
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="bg-white">
                {students.map((student, index) => (
                  <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 border-r border-gray-200 align-top text-gray-700">{index + 1}</td>
                    <td className="p-3 font-bold border-r border-gray-200 align-top text-gray-800">{student.studentId}</td>
                    <td className="p-3 border-r border-gray-200 align-top text-gray-600">{student.session}</td>
                    <td className="p-3 border-r border-gray-200 align-top">
                      <div className="text-gray-700">{student.studentName?.toUpperCase()}</div>
                      <div className="font-bold text-gray-900 mt-1">{student.dob ? new Date(student.dob).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/\//g, '-') : ''}</div>
                    </td>
                    <td className="p-3 border-r border-gray-200 align-top text-gray-600 text-[13px]">
                      {student.courseInterest ? `[269] ${student.courseInterest.toUpperCase()}` : ''}
                    </td>
                    <td className="p-3 border-r border-gray-200 align-top text-gray-600">{student.mobile}</td>
                    <td className="p-3 border-r border-gray-200 align-top">
                      {student.profilePhoto ? (
                        <img 
                          src={`${API_BASE_URL}${student.profilePhoto}`} 
                          alt="Student" 
                          className="w-[50px] h-[60px] object-cover"
                        />
                      ) : (
                        <div className="w-[50px] h-[60px] bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-[10px]">No Photo</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 border-r border-gray-200 align-top text-center">
                      <div className="w-5 h-5 rounded-full bg-gray-800 text-white flex items-center justify-center mx-auto text-xs font-bold leading-none select-none">
                        ×
                      </div>
                    </td>
                    <td className="p-3 border-r border-gray-200 align-top">
                      <div className="flex flex-col gap-2 text-[13px] text-[#337ab7]">
                        <button onClick={() => handleEdit(student)} className="flex items-center gap-1.5 hover:text-[#23527c] text-left">
                          <Edit size={13} /> Edit
                        </button>
                        <button onClick={() => deleteStudent(student._id)} className="flex items-center gap-1.5 hover:text-[#23527c] text-left">
                          <Trash2 size={13} /> Delete
                        </button>
                        <button onClick={() => handlePrintIdCard(student)} className="flex items-center gap-1.5 hover:text-[#23527c] text-left">
                          <CreditCard size={13} /> Id-card
                        </button>
                        <button onClick={() => handlePrintForm(student)} className="flex items-center gap-1.5 hover:text-[#23527c] text-left">
                          <Printer size={13} /> Print Form
                        </button>
                      </div>
                    </td>
                    <td className="p-3 align-top text-center">
                      <input type="checkbox" className="rounded border-gray-400 w-3.5 h-3.5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
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

export default PendingStudent;
