import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, Card, CardContent, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import { FaTrophy, FaSearch, FaPrint, FaEye, FaTrash, FaDownload } from 'react-icons/fa';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const CURRENT_SESSION = '2026-2027'; // Update this each year

const CompetitionManagement = () => {
  const [applications, setApplications] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(CURRENT_SESSION);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [libsLoaded, setLibsLoaded] = useState(false);
  const attendanceContainerId = 'attendance-export-container';
  const html2canvasRef = useRef(null);
  const jsPDFRef = useRef(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    loadApplications(activeSession);
    setSearchTerm('');
    setPaymentFilter('all');
  }, [activeSession]);

  const loadSessions = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/competition-applications/sessions`);
      if (res.ok) {
        const data = await res.json();
        // Always include current session even if empty
        const merged = Array.from(new Set([CURRENT_SESSION, ...data])).sort().reverse();
        setAvailableSessions(merged);
      }
    } catch (e) {
      console.error('Failed to load sessions:', e);
      setAvailableSessions([CURRENT_SESSION]);
    }
  };

  const loadApplications = async (session) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const url = session
        ? `${API_BASE_URL}/api/competition-applications?session=${encodeURIComponent(session)}`
        : `${API_BASE_URL}/api/competition-applications`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load');
      setApplications(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/competition-applications/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Delete failed');
      }
      setApplications(prev => prev.filter(a => a._id !== id));
    } catch (e) {
      console.error(e);
      alert(e.message || 'Delete failed');
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetails(true);
  };

  const updatePaymentStatus = async (id, status) => {
    try {
      setUpdating(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/competition-applications/${id}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setApplications(prev => prev.map(a => (a._id === id ? data : a)));
      if (selectedApplication && selectedApplication._id === id) setSelectedApplication(data);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const printAdmitCard = (application) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Competition Admit Card - ${application.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: #f5f5f5; 
              padding: 20px;
            }
            .admit-card { 
              background: white; 
              border: 3px solid #1976d2; 
              border-radius: 15px; 
              padding: 0; 
              max-width: 800px; 
              margin: 0 auto; 
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #1976d2, #0d47a1); 
              color: white; 
              padding: 25px; 
              text-align: center; 
              position: relative;
            }
            .institute-name { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 5px;
            }
            .certification { 
              font-size: 12px; 
              opacity: 0.9; 
              margin-bottom: 15px;
            }
            .admit-title { 
              font-size: 24px; 
              font-weight: bold; 
              text-transform: uppercase; 
              letter-spacing: 1px;
              border-top: 2px solid rgba(255,255,255,0.3);
              padding-top: 15px;
            }
            .main-content { 
              display: flex; 
              padding: 30px;
            }
            .candidate-info { 
              flex: 2; 
              padding-right: 30px;
            }
            .photo-section { 
              flex: 1; 
              text-align: center;
            }
            .info-item { 
              display: flex; 
              margin-bottom: 15px; 
              align-items: center;
            }
            .info-label { 
              font-weight: bold; 
              color: #333; 
              min-width: 120px; 
              font-size: 14px;
            }
            .info-value { 
              color: #1976d2; 
              font-weight: 600; 
              font-size: 15px;
            }
            .roll-number { 
              font-size: 18px; 
              color: #0d47a1; 
              font-weight: bold;
            }
            .photo-box { 
              border: 2px solid #ddd; 
              width: 120px; 
              height: 150px; 
              margin: 0 auto 20px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              background: #f9f9f9;
              border-radius: 8px;
            }
            .photo-placeholder { 
              color: #999; 
              font-size: 12px; 
              text-align: center;
            }
            .instructions { 
              background: #fff3e0; 
              padding: 25px; 
              margin: 0 30px 30px;
              border-radius: 10px;
              border-left: 5px solid #ff9800;
            }
            .instructions h3 { 
              color: #e65100; 
              margin-bottom: 15px; 
              font-size: 18px;
              text-align: center;
            }
            .instructions ol { 
              padding-left: 20px;
            }
            .instructions li { 
              margin-bottom: 8px; 
              line-height: 1.5;
              color: #333;
            }
            .exam-details { 
              background: linear-gradient(135deg, #e3f2fd, #bbdefb); 
              padding: 25px; 
              margin: 0 30px 30px;
              border-radius: 10px;
              border: 2px solid #1976d2;
            }
            .exam-details h3 { 
              color: #0d47a1; 
              margin-bottom: 20px; 
              font-size: 20px;
              text-align: center;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .exam-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 15px;
            }
            .exam-item { 
              display: flex; 
              justify-content: space-between; 
              align-items: center;
              padding: 8px 0;
              border-bottom: 1px solid rgba(25, 118, 210, 0.2);
            }
            .exam-label { 
              font-weight: bold; 
              color: #0d47a1;
            }
            .exam-value { 
              color: #1976d2; 
              font-weight: 600;
            }
            @media print { 
              body { margin: 0; background: white; font-size: 12px; }
              .admit-card { 
                box-shadow: none; 
                border: 2px solid #000; 
                max-width: 100%; 
                padding: 0;
                page-break-inside: avoid;
              }
              .header { padding: 15px; }
              .institute-name { font-size: 14px; }
              .certification { font-size: 10px; }
              .admit-title { font-size: 16px; padding-top: 10px; }
              .main-content { padding: 15px; }
              .info-item { margin-bottom: 8px; }
              .info-label { font-size: 11px; min-width: 100px; }
              .info-value { font-size: 12px; }
              .photo-box { width: 80px; height: 100px; }
              .instructions { padding: 15px; margin: 0 15px 15px; }
              .instructions h3 { font-size: 14px; margin-bottom: 10px; }
              .instructions li { margin-bottom: 4px; font-size: 10px; line-height: 1.3; }
              .exam-details { padding: 15px; margin: 0 15px 15px; }
              .exam-details h3 { font-size: 14px; margin-bottom: 10px; }
              .exam-item { padding: 4px 0; }
              .exam-label, .exam-value { font-size: 11px; }
              .result-info { padding: 10px; margin: 0 15px 15px; }
              .result-info h3 { font-size: 12px; margin-bottom: 5px; }
              .result-info p { font-size: 11px; }
            }
          </style>
        </head>
        <body>
          <div class="admit-card">
            <!-- Header Section -->
            <div class="header">
              <div class="institute-name">NIICT Computer Institute of IT Management</div>
              <div class="certification">AN ISO 9001:2015 CERTIFIED ORGANIZATION</div>
              <div class="admit-title">Candidate Admit Card (Competition Exam)</div>
            </div>

            <!-- Main Content -->
            <div class="main-content">
              <!-- Candidate Information -->
              <div class="candidate-info">
                <div class="info-item">
                  <span class="info-label">Roll No:</span>
                  <span class="info-value roll-number">${application.rollNumber}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${application.name}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Date of Birth:</span>
                  <span class="info-value">${new Date(application.dateOfBirth).toLocaleDateString('en-GB')}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Father Name:</span>
                  <span class="info-value">${application.fatherName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Class:</span>
                  <span class="info-value">${application.classPassed}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">School:</span>
                  <span class="info-value">${application.school}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Subject:</span>
                  <span class="info-value">${application.subject} Competition</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Center Name:</span>
                  <span class="info-value">S K Modern Intermediate College Semari Janghai Jaunpur</span>
                </div>
              </div>

              <!-- Photo Section -->
              <div class="photo-section">
                <div class="photo-box">
                  <div class="photo-placeholder">
                    ${application.image ? 
                      `<img src="${application.image}" alt="Photo" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px; display: block;" onload="this.style.display='block'" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
                       <div style="display: none; font-size: 10px; color: #999;">PHOTOGRAPH</div>` : 
                      'PHOTOGRAPH'
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Instructions Section -->
            <div class="instructions">
              <h3>अभ्यर्थी हेतु आवश्यकता निर्देश</h3>
              <ol>
                <li>कृपया परीक्षा की तिथि से पर्यात समय पूर्व परीक्षा केंद्र का सही पता मालूम अवश्य कर लें ।</li>
                <li>अभ्यर्थी रिपोर्टिंग समय से 25 मिनट पहले परीक्षा केंद्र पर अवश्य पहुचें ।</li>
                <li>अभ्यर्थी परीक्षा हॉल में अपने साथ एडमिट कार्ड, आधार कार्ड, बॉल पेन अवय लेकर आएं ।</li>
                <li>परीक्षा हाल में किसी भी प्रकार की नकल सामग्री ( मोबाइल, स्मार्ट watch,calculator, डिजिटल पेन आदि) लाना सख्त मना हैं।</li>
                <li>परीक्षा केंद्र के अंदर किसी भी प्रकार की सामग्री ( मोबाइल, बैग, घड़ी आदि मूल्यवान वस्तु) रखने की व्यवस्था नहीं है, अतः अभ्यर्थी अपने अभिभावक को साथ ले आए।</li>
                <li>किसी भी अभ्यर्थी द्वारा अनुचित व्यावहार किए जाने पर उनकी परीक्षा रद्द कर दी जाएगी, जिसका जिम्मेदार अभ्यर्थी स्वयम होगा।</li>
              </ol>
            </div>

            <!-- Exam Details -->
            <div class="exam-details">
              <h3>Examination Details</h3>
              <div class="exam-grid">
                <div class="exam-item">
                  <span class="exam-label">Examination Date:</span>
                  <span class="exam-value">12 Oct 2025 Sunday</span>
                </div>
                <div class="exam-item">
                  <span class="exam-label">Reporting Time:</span>
                  <span class="exam-value">08:00 AM</span>
                </div>
                <div class="exam-item">
                  <span class="exam-label">Gate Closing Time:</span>
                  <span class="exam-value">09:15 AM</span>
                </div>
                <div class="exam-item">
                  <span class="exam-label">Examination Time:</span>
                  <span class="exam-value">10:00 AM</span>
                </div>
              </div>
            </div>

            <!-- Result Information -->
            <div class="result-info" style="background: #e8f5e8; padding: 20px; margin: 0 30px 30px; border-radius: 10px; border-left: 5px solid #4caf50; text-align: center;">
              <h3 style="color: #2e7d32; margin-bottom: 10px; font-size: 16px;">परीक्षा परिणाम की तिथि</h3>
              <p style="color: #333; font-weight: 600; margin: 0;">
                18 Oct 2025 को Niict computer Classes के यूट्यूब चैनल के माध्यम से घोषित किया जाएगा।
              </p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToCSV = () => {
    const headers = [
      'Roll Number',
      'Subject', 
      'Full Name',
      'Photo URL',
      'Phone',
      'Aadhaar Number',
      'Date of Birth',
      'Class',
      'School',
      'Father\'s Name',
      'Mother\'s Name',
      'Parent Phone',
      'Address',
      'Application Date',
      'Payment Status'
    ];
    
    const csvContent = [
      headers.join(','),
      ...applications.map(app => [
        app.rollNumber || '',
        app.subject || '',
        app.name || '',
        app.image || 'No Photo',
        app.phone || '',
        app.aadhaar || 'Not provided',
        app.dateOfBirth ? new Date(app.dateOfBirth).toLocaleDateString('en-GB') : 'Not provided',
        app.classPassed || app.class || 'Not provided',
        app.school || '',
        app.fatherName || 'Not provided',
        app.motherName || 'Not provided',
        app.parentPhone || 'Not provided',
        `"${app.address || ''}"`,
        app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB') : 'Not available',
        app.paymentStatus === 'verified' ? 'Verified' : 'Pending'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competition_applications_detailed_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const ensureExportLibs = async () => {
    if (libsLoaded && html2canvasRef.current && jsPDFRef.current) return true;

    const tryLoadScript = (src) => new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.crossOrigin = 'anonymous';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });

    const ensureHtml2Canvas = async () => {
      if (window.html2canvas) return true;
      try {
        await tryLoadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
      } catch (_) {
        await tryLoadScript('https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js');
      }
      await new Promise(r => setTimeout(r, 50));
      return !!window.html2canvas;
    };

    const ensureJsPDF = async () => {
      if ((window.jspdf && window.jspdf.jsPDF) || window.jsPDF) return true;
      try {
        await tryLoadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
      } catch (_) {
        await tryLoadScript('https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js');
      }
      await new Promise(r => setTimeout(r, 50));
      return !!((window.jspdf && window.jspdf.jsPDF) || window.jsPDF);
    };

    const [h2cOk, jsPdfOk] = await Promise.all([ensureHtml2Canvas(), ensureJsPDF()]);

    if (h2cOk && window.html2canvas) html2canvasRef.current = window.html2canvas;
    const possibleJsPDF = jsPdfOk ? ((window.jspdf && window.jspdf.jsPDF) || window.jsPDF || null) : null;
    if (possibleJsPDF) jsPDFRef.current = possibleJsPDF;

    if (!html2canvasRef.current || !jsPDFRef.current) {
      alert('Export libraries failed to load. Please check internet access to jsPDF/html2canvas CDNs.');
      return false;
    }

    setLibsLoaded(true);
    return true;
  };

  const buildAttendancePage = (slice, pageNumber) => {
    const container = document.createElement('div');
    container.style.width = '794px'; 
    container.style.padding = '16px';
    container.style.background = '#ffffff';
    container.style.color = '#111827';
    container.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

    const title = document.createElement('div');
    title.style.textAlign = 'center';
    title.style.marginBottom = '8px';
    title.style.fontWeight = '700';
    title.style.fontSize = '18px';
    title.innerText = 'Competition Attendance Sheet';
    container.appendChild(title);

    const sub = document.createElement('div');
    sub.style.textAlign = 'center';
    sub.style.marginBottom = '12px';
    sub.style.fontSize = '12px';
    sub.innerText = `Page ${pageNumber}`;
    container.appendChild(sub);

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '12px';

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const headers = ['S.No', 'Roll No', 'Name', "Father's Name", 'Signature'];
    headers.forEach(text => {
      const th = document.createElement('th');
      th.innerText = text;
      th.style.border = '1px solid #000000';
      th.style.padding = '6px 8px';
      th.style.background = '#f3f4f6';
      th.style.textAlign = 'left';
      th.style.fontWeight = '700';
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    slice.forEach((app, idx) => {
      const tr = document.createElement('tr');
      const cells = [
        String(idx + 1),
        app.rollNumber || '',
        app.name || '',
        app.fatherName || '',
        ''
      ];
      cells.forEach((val, ci) => {
        const td = document.createElement('td');
        td.style.border = '1px solid #000000';
        td.style.padding = '8px';
        if (ci === 4) {
          td.style.height = '40px';
        }
        td.innerText = val;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);

    return container;
  };

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
    return chunks;
  };

  const getAttendancePagesAsCanvases = async (data) => {
    let staging = document.getElementById(attendanceContainerId);
    if (!staging) {
      staging = document.createElement('div');
      staging.id = attendanceContainerId;
      staging.style.position = 'fixed';
      staging.style.left = '-10000px';
      staging.style.top = '0';
      staging.style.zIndex = '-1';
      document.body.appendChild(staging);
    }
    staging.innerHTML = '';

    const pages = chunkArray(data, 15);
    const canvases = [];
    for (let p = 0; p < pages.length; p++) {
      const pageNode = buildAttendancePage(pages[p], p + 1);
      staging.appendChild(pageNode);
      const canvas = await html2canvasRef.current(pageNode, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      canvases.push(canvas);
      staging.innerHTML = '';
    }
    return canvases;
  };

  const exportAttendancePDF = async () => {
    try {
      const ok = await ensureExportLibs();
      if (!ok) throw new Error('Libraries not loaded');
      const canvases = await getAttendancePagesAsCanvases(filteredApplications);
      const PDFCtor = jsPDFRef.current;
      if (!PDFCtor) throw new Error('jsPDF not available');
      const pdf = new PDFCtor('p', 'pt', 'a4');
      canvases.forEach((canvas, idx) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const yOffset = Math.max(0, (pageHeight - imgHeight) / 2);
        pdf.addImage(imgData, 'JPEG', 0, yOffset, imgWidth, imgHeight, undefined, 'FAST');
        if (idx < canvases.length - 1) pdf.addPage();
      });
      pdf.save(`attendance_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (e) {
      console.error(e);
      alert(`Failed to export PDF: ${e && e.message ? e.message : 'Unknown error'}`);
    }
  };

  const exportAttendanceJPG = async () => {
    try {
      const ok = await ensureExportLibs();
      if (!ok) return;
      const canvases = await getAttendancePagesAsCanvases(filteredApplications);
      canvases.forEach((canvas, idx) => {
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/jpeg', 0.95);
        a.download = `attendance_page_${idx + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    } catch (e) {
      console.error(e);
      alert(`Failed to export JPG: ${e && e.message ? e.message : 'Unknown error'}`);
    }
  };

  const filteredApplications = applications.filter(app => {
    // Payment filter
    if (paymentFilter !== 'all') {
      if (paymentFilter === 'paid' && app.paymentStatus !== 'paid' && app.paymentStatus !== 'verified') return false;
      if (paymentFilter === 'pending' && app.paymentStatus !== 'pending') return false;
      if (paymentFilter === 'failed' && app.paymentStatus !== 'failed') return false;
    }
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    switch (searchType) {
      case 'name': return app.name.toLowerCase().includes(term);
      case 'phone': return app.phone && app.phone.includes(searchTerm);
      case 'aadhaar': return app.aadhaar && app.aadhaar.includes(searchTerm);
      case 'roll': return app.rollNumber.includes(searchTerm);
      case 'school': return app.school.toLowerCase().includes(term);
      case 'subject': return app.subject.toLowerCase().includes(term);
      default:
        return app.name.toLowerCase().includes(term) ||
               app.rollNumber.includes(searchTerm) ||
               app.school.toLowerCase().includes(term) ||
               app.subject.toLowerCase().includes(term) ||
               (app.phone && app.phone.includes(searchTerm)) ||
               (app.aadhaar && app.aadhaar.includes(searchTerm));
    }
  });

  const totalApplications = applications.length;
  const gkApplications = applications.filter(app => app.subject === 'GK').length;
  const computerApplications = applications.filter(app => app.subject === 'Computer').length;
  const bothApplications = applications.filter(app => app.subject === 'Both').length;
  const paidApplications = applications.filter(app => app.paymentStatus === 'paid' || app.paymentStatus === 'verified').length;

  if (showDetails && selectedApplication) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1120', pt: 12, pb: 8 }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box display="flex" alignItems="center" mb={6} gap={2}>
              <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #fbbf24, #f59e42)', boxShadow: '0 0 20px rgba(251,191,36,0.4)', display: 'flex' }}>
                <FaTrophy size={32} color="#fff" />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={800} color="#fff" sx={{ letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
                  Application <span style={{ color: '#fbbf24' }}>Details</span>
                </Typography>
              </Box>
            </Box>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ background: 'rgba(15,23,42,0.6)', p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Typography variant="h6" fontWeight={600} color="#fff" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '1px', mb: 3 }}>
                      Candidate Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Roll Number</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fbbf24">{selectedApplication.rollNumber}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Subject</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedApplication.subject}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Session / Exam Year</Typography>
                        <Chip
                          label={selectedApplication.session || 'N/A'}
                          size="small"
                          sx={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)', fontWeight: 700, mt: 0.5 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="#94a3b8">Full Name</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedApplication.name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Phone</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedApplication.phone}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Aadhaar Number</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedApplication.aadhaar || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Date of Birth</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedApplication.dateOfBirth ? new Date(selectedApplication.dateOfBirth).toLocaleDateString('en-GB') : 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Class</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedApplication.classPassed || selectedApplication.class || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="#94a3b8">School</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedApplication.school}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Father's Name</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedApplication.fatherName || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Mother's Name</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedApplication.motherName || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Parent Phone</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedApplication.parentPhone || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="#94a3b8">Address</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedApplication.address}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Payment Status</Typography>
                        <Typography variant="h6" fontWeight={600} color={selectedApplication.paymentStatus === 'paid' || selectedApplication.paymentStatus === 'verified' ? '#34d399' : selectedApplication.paymentStatus === 'failed' ? '#f87171' : '#fbbf24'}>
                          {selectedApplication.paymentStatus === 'paid' ? '✓ PAID' : selectedApplication.paymentStatus === 'verified' ? '✓ Verified' : selectedApplication.paymentStatus === 'failed' ? '✗ Failed' : 'Pending'}
                        </Typography>
                      </Grid>
                      {(selectedApplication.paymentStatus === 'paid' || selectedApplication.paymentStatus === 'verified') && (
                        <>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="#94a3b8">Transaction ID</Typography>
                            <Typography variant="body1" fontWeight={600} color="#fff" sx={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>{selectedApplication.paymentTransactionId || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="#94a3b8">Amount Paid</Typography>
                            <Typography variant="h6" fontWeight={600} color="#34d399">Rs. {selectedApplication.paymentAmount || 150}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="#94a3b8">Payment Date</Typography>
                            <Typography variant="body1" fontWeight={600} color="#fff">{selectedApplication.paidAt ? new Date(selectedApplication.paidAt).toLocaleString('en-IN') : 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="#94a3b8">Order ID</Typography>
                            <Typography variant="body1" fontWeight={600} color="#fff" sx={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{selectedApplication.paymentOrderId || 'N/A'}</Typography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ background: 'rgba(15,23,42,0.6)', p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={600} color="#fff" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                      QR Code
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, p: 2, background: '#fff', borderRadius: 2 }}>
                      <QRCode value={selectedApplication.qrCode} size={150} level="H" includeMargin={true} />
                    </Box>
                    <Typography variant="body2" color="#94a3b8" gutterBottom>
                      Scan this QR code for verification
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button variant="contained" size="large" onClick={() => printAdmitCard(selectedApplication)} startIcon={<FaPrint />} sx={{ background: 'linear-gradient(135deg, #fbbf24, #f59e42)', color: '#fff', '&:hover': { boxShadow: '0 0 20px rgba(251,191,36,0.4)' } }}>
                      Print Admit Card
                    </Button>
                    {selectedApplication.paymentStatus !== 'verified' ? (
                      <Button variant="contained" size="large" disabled={updating} onClick={() => updatePaymentStatus(selectedApplication._id, 'verified')} sx={{ background: 'linear-gradient(135deg, #34d399, #10b981)', color: '#fff' }}>
                        Mark as Verified
                      </Button>
                    ) : (
                      <Button variant="outlined" color="warning" size="large" disabled={updating} onClick={() => updatePaymentStatus(selectedApplication._id, 'pending')} sx={{ borderColor: '#fbbf24', color: '#fbbf24', '&:hover': { background: 'rgba(251,191,36,0.1)' } }}>
                        Revert to Pending
                      </Button>
                    )}
                    <Button variant="outlined" size="large" onClick={() => setShowDetails(false)} sx={{ borderColor: '#64748b', color: '#cbd5e1', '&:hover': { background: 'rgba(100,116,139,0.1)', borderColor: '#cbd5e1' } }}>
                      Back to List
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1120', pt: 12, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          
          <Box display="flex" alignItems="center" mb={4} gap={2} flexWrap="wrap">
            <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #fbbf24, #f59e42)', boxShadow: '0 0 20px rgba(251,191,36,0.4)', display: 'flex' }}>
              <FaTrophy size={32} color="#fff" />
            </Box>
            <Box flex={1}>
              <Typography variant="h3" fontWeight={800} color="#fff" sx={{ letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
                Competition <span style={{ color: '#fbbf24' }}>Management</span>
              </Typography>
            </Box>
          </Box>

          {/* Session Selector */}
          <Box sx={{ mb: 5, p: 1, background: 'rgba(15,23,42,0.7)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b', px: 1.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
              Session:
            </Typography>
            {availableSessions.map(session => {
              const isActive = session === activeSession;
              const isCurrent = session === CURRENT_SESSION;
              return (
                <Button
                  key={session}
                  onClick={() => setActiveSession(session)}
                  size="small"
                  sx={{
                    borderRadius: '10px',
                    px: 2.5, py: 0.8,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textTransform: 'none',
                    transition: 'all 0.2s',
                    background: isActive
                      ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                      : 'rgba(255,255,255,0.04)',
                    color: isActive ? '#0B1120' : '#94a3b8',
                    border: `1px solid ${isActive ? '#fbbf24' : 'rgba(255,255,255,0.08)'}`,
                    boxShadow: isActive ? '0 4px 14px rgba(251,191,36,0.35)' : 'none',
                    '&:hover': {
                      background: isActive ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'rgba(255,255,255,0.08)',
                      color: isActive ? '#0B1120' : '#fff',
                    },
                  }}
                >
                  {session}
                  {isCurrent && (
                    <Box component="span" sx={{ ml: 1, fontSize: '0.65rem', background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(251,191,36,0.2)', color: isActive ? '#0B1120' : '#fbbf24', px: 0.8, py: 0.2, borderRadius: '6px', fontWeight: 800 }}>
                      CURRENT
                    </Box>
                  )}
                </Button>
              );
            })}
            <Box sx={{ ml: 'auto' }}>
              <Button size="small" onClick={() => loadApplications(activeSession)}
                sx={{ borderRadius: '10px', px: 2, color: '#64748b', fontSize: '0.8rem', textTransform: 'none', '&:hover': { color: '#fff' } }}>
                ↻ Refresh
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3} mb={6}>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(59,130,246,0.05))', border: '1px solid rgba(56,189,248,0.4)', backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 0 30px rgba(56,189,248,0.15)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', mb: 1 }}>Total Applications</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif' }}>{totalApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.05))', border: '1px solid rgba(52,211,153,0.4)', backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 0 30px rgba(52,211,153,0.15)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', mb: 1 }}>GK Applications</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif' }}>{gkApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.05))', border: '1px solid rgba(251,191,36,0.4)', backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 0 30px rgba(251,191,36,0.15)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', mb: 1 }}>Computer Applications</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif' }}>{computerApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(139,92,246,0.05))', border: '1px solid rgba(167,139,250,0.4)', backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 0 30px rgba(167,139,250,0.15)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', mb: 1 }}>Both Subjects</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif' }}>{bothApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.05))', border: '1px solid rgba(52,211,153,0.4)', backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 0 30px rgba(52,211,153,0.15)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', mb: 1 }}>💳 Payments Received</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#34d399', fontFamily: '"Saira Condensed", sans-serif' }}>{paidApplications}</Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>Rs. {paidApplications * 150} collected</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: 4, background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
            <Typography variant="h6" mb={3} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaSearch size={20} color="#fbbf24" /> Search Applications
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel sx={{ color: '#94a3b8', '&.Mui-focused': { color: '#fbbf24' } }}>Search By</InputLabel>
                <Select value={searchType} label="Search By" onChange={(e) => { setSearchType(e.target.value); setSearchTerm(''); }}
                  sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24' }, '.MuiSvgIcon-root': { color: '#94a3b8' } }}>
                  <MenuItem value="all">🔍 All Fields</MenuItem>
                  <MenuItem value="name">👤 Name</MenuItem>
                  <MenuItem value="phone">📱 Phone</MenuItem>
                  <MenuItem value="aadhaar">🆔 Aadhaar</MenuItem>
                  <MenuItem value="roll">🎫 Roll Number</MenuItem>
                  <MenuItem value="school">🏫 School</MenuItem>
                  <MenuItem value="subject">📚 Subject</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel sx={{ color: '#94a3b8', '&.Mui-focused': { color: '#34d399' } }}>Payment</InputLabel>
                <Select value={paymentFilter} label="Payment" onChange={(e) => setPaymentFilter(e.target.value)}
                  sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#34d399' }, '.MuiSvgIcon-root': { color: '#94a3b8' } }}>
                  <MenuItem value="all">💳 All Payments</MenuItem>
                  <MenuItem value="paid">✅ Paid</MenuItem>
                  <MenuItem value="pending">⏳ Pending</MenuItem>
                  <MenuItem value="failed">❌ Failed</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1, minWidth: 320, input: { color: '#fff' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused fieldset': { borderColor: '#fbbf24' } } }}
                InputProps={{ startAdornment: ( <InputAdornment position="start"><FaSearch color="#64748b" /></InputAdornment> ) }}
              />
              
              {searchTerm && (
                <Button variant="outlined" onClick={() => setSearchTerm('')} sx={{ color: '#cbd5e1', borderColor: '#64748b', '&:hover': { borderColor: '#fff' } }}>
                  Clear
                </Button>
              )}
              
              <Button variant="contained" onClick={exportToCSV} startIcon={<FaDownload />} sx={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#fff' }}>CSV</Button>
              <Button variant="contained" onClick={exportAttendancePDF} startIcon={<FaDownload />} sx={{ background: 'linear-gradient(135deg, #f87171, #ef4444)', color: '#fff' }}>PDF</Button>
              <Button variant="contained" onClick={exportAttendanceJPG} startIcon={<FaDownload />} sx={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', color: '#fff' }}>JPG</Button>
            </Box>
          </Paper>

          <Paper sx={{ borderRadius: 4, overflow: 'hidden', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ background: 'rgba(15,23,42,0.6)' }}>
                  <TableRow>
                    {['Roll Number', 'Name', "Father's Name", 'Payment', 'Photo', 'Signature', 'Actions'].map((header) => (
                      <TableCell key={header} sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application._id || application.rollNumber} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02) !important' } }}>
                      <TableCell sx={{ color: '#fbbf24', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{application.rollNumber}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography sx={{ color: '#fff', fontWeight: 500 }}>{application.name}</Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>{application.email}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{application.fatherName || 'Not provided'}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Chip
                          label={application.paymentStatus === 'paid' || application.paymentStatus === 'verified' ? 'PAID' : application.paymentStatus === 'failed' ? 'FAILED' : 'PENDING'}
                          size="small"
                          sx={{
                            background: application.paymentStatus === 'paid' || application.paymentStatus === 'verified'
                              ? 'rgba(52,211,153,0.15)' : application.paymentStatus === 'failed'
                              ? 'rgba(248,113,113,0.15)' : 'rgba(251,191,36,0.15)',
                            color: application.paymentStatus === 'paid' || application.paymentStatus === 'verified'
                              ? '#34d399' : application.paymentStatus === 'failed'
                              ? '#f87171' : '#fbbf24',
                            fontWeight: 700, fontSize: '0.7rem', border: '1px solid',
                            borderColor: application.paymentStatus === 'paid' || application.paymentStatus === 'verified'
                              ? 'rgba(52,211,153,0.4)' : application.paymentStatus === 'failed'
                              ? 'rgba(248,113,113,0.4)' : 'rgba(251,191,36,0.4)',
                          }}
                        />
                        {application.paymentTransactionId && (
                          <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.65rem', mt: 0.3 }}>{application.paymentTransactionId.slice(0, 12)}…</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {application.image ? (
                          <Box component="img" src={application.image} alt="photo" sx={{ width: 50, height: 50, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                        ) : (
                          <Box sx={{ width: 50, height: 50, borderRadius: 2, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#64748b' }}>No Photo</Box>
                        )}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box sx={{ width: 120, height: 40, border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 1 }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box display="flex" gap={1}>
                          <Button variant="outlined" size="small" onClick={() => handleViewDetails(application)} sx={{ color: '#38bdf8', borderColor: '#38bdf850', minWidth: 0, p: 1 }}><FaEye /></Button>
                          <Button variant="outlined" size="small" onClick={() => printAdmitCard(application)} sx={{ color: '#fbbf24', borderColor: '#fbbf2450', minWidth: 0, p: 1 }}><FaPrint /></Button>
                          <Button variant="outlined" size="small" onClick={() => handleDelete(application._id)} sx={{ color: '#f87171', borderColor: '#f8717150', minWidth: 0, p: 1 }}><FaTrash /></Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {filteredApplications.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="#64748b">
                {searchTerm ? 'No applications found matching your search.' : 'No competition applications yet.'}
              </Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default CompetitionManagement;
