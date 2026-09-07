import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, Card, CardContent, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { FaTrophy, FaSearch, FaPrint, FaEye, FaTrash, FaDownload, FaFileAlt, FaReceipt } from 'react-icons/fa';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { openAdmitCardPrintWindow, openApplicationFormPrintWindow } from '../../utils/admitCardGenerator';
import GovernmentAdmitCardModal from './GovernmentAdmitCardModal';

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
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewApplication, setPreviewApplication] = useState(null);
  const [previewDocType, setPreviewDocType] = useState('admit_card');
  const [libsLoaded, setLibsLoaded] = useState(false);
  const attendanceContainerId = 'attendance-export-container';
  const html2canvasRef = useRef(null);
  const jsPDFRef = useRef(null);

  const handleOpenAdmitCardPreview = (app, docType = 'admit_card') => {
    setPreviewApplication(app);
    setPreviewDocType(docType);
    setPreviewModalOpen(true);
  };

  const printAdmitCard = (application) => {
    openAdmitCardPrintWindow(application);
  };

  const printApplicationForm = (application) => {
    openApplicationFormPrintWindow(application);
  };

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
      case 'name': return app.name && app.name.toLowerCase().includes(term);
      case 'phone': return app.phone && app.phone.includes(searchTerm);
      case 'aadhaar': return app.aadhaar && app.aadhaar.includes(searchTerm);
      case 'roll': return app.rollNumber && app.rollNumber.toLowerCase().includes(term);
      case 'school': return app.school && app.school.toLowerCase().includes(term);
      case 'subject': return app.subject && app.subject.toLowerCase().includes(term);
      default:
        return (app.name && app.name.toLowerCase().includes(term)) ||
               (app.rollNumber && app.rollNumber.toLowerCase().includes(term)) ||
               (app.school && app.school.toLowerCase().includes(term)) ||
               (app.subject && app.subject.toLowerCase().includes(term)) ||
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
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box display="flex" alignItems="center" mb={4} gap={2}>
              <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 8px 20px -4px rgba(37,99,235,0.3)', display: 'flex' }}>
                <FaTrophy size={32} color="#fff" />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
                  Application <span style={{ color: '#2563EB' }}>Details</span>
                </Typography>
              </Box>
            </Box>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ background: '#F8FAFC', p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                    <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', mb: 3 }}>
                      Candidate Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748B">Roll Number</Typography>
                        <Typography variant="h6" fontWeight={700} color="#2563EB">{selectedApplication.rollNumber}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748B">Subject</Typography>
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.subject}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748B">Session / Exam Year</Typography>
                        <Chip
                          label={selectedApplication.session || 'N/A'}
                          size="small"
                          sx={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontWeight: 700, mt: 0.5 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="#64748B">Full Name</Typography>
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.name}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748B">Phone</Typography>
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.phone}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748B">Aadhaar Number</Typography>
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.aadhaar || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748B">Date of Birth</Typography>
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.dateOfBirth ? new Date(selectedApplication.dateOfBirth).toLocaleDateString('en-GB') : 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748B">Class</Typography>
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.classPassed || selectedApplication.class || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="#64748B">School</Typography>
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.school}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748B">Father's Name</Typography>
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.fatherName || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748B">Mother's Name</Typography>
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.motherName || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748B">Parent Phone</Typography>
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.parentPhone || 'Not provided'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="#64748B">Address</Typography>
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.address}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748B">Payment Status</Typography>
                        <Typography variant="h6" fontWeight={700} color={selectedApplication.paymentStatus === 'paid' || selectedApplication.paymentStatus === 'verified' ? '#059669' : selectedApplication.paymentStatus === 'failed' ? '#DC2626' : '#D97706'}>
                          {selectedApplication.paymentStatus === 'paid' ? '✓ PAID' : selectedApplication.paymentStatus === 'verified' ? '✓ Verified' : selectedApplication.paymentStatus === 'failed' ? '✗ Failed' : 'Pending'}
                        </Typography>
                      </Grid>
                      {(selectedApplication.paymentStatus === 'paid' || selectedApplication.paymentStatus === 'verified') && (
                        <>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="#64748B">Transaction ID</Typography>
                            <Typography variant="body1" fontWeight={600} color="#0F172A" sx={{ fontSize: '0.9rem', wordBreak: 'break-all' }}>{selectedApplication.paymentTransactionId || 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="#64748B">Amount Paid</Typography>
                            <Typography variant="h6" fontWeight={700} color="#059669">Rs. {selectedApplication.paymentAmount || 150}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="#64748B">Payment Date</Typography>
                            <Typography variant="body1" fontWeight={600} color="#0F172A">{selectedApplication.paidAt ? new Date(selectedApplication.paidAt).toLocaleString('en-IN') : 'N/A'}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="#64748B">Order ID</Typography>
                            <Typography variant="body1" fontWeight={600} color="#0F172A" sx={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{selectedApplication.paymentOrderId || 'N/A'}</Typography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ background: '#F8FAFC', p: 3, borderRadius: 3, border: '1px solid #E2E8F0', textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      QR Code
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, p: 2, background: '#fff', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                      <QRCode value={selectedApplication.qrCode} size={150} level="H" includeMargin={true} />
                    </Box>
                    <Typography variant="body2" color="#64748B" gutterBottom>
                      Scan this QR code for verification
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* E-Admit Card Group */}
                    <Box sx={{ p: 1.5, background: '#EFF6FF', borderRadius: 2, border: '1px solid #BFDBFE' }}>
                      <Typography variant="caption" sx={{ color: '#1E40AF', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                        1. Examination E-Admit Card (Hall Ticket)
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Button 
                          variant="contained" 
                          fullWidth
                          size="medium" 
                          onClick={() => printAdmitCard(selectedApplication)} 
                          startIcon={<FaPrint />} 
                          sx={{ 
                            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', 
                            color: '#fff', fontWeight: 700, textTransform: 'none', borderRadius: 1.5,
                            boxShadow: '0 4px 12px rgba(37,99,235,0.25)'
                          }}
                        >
                          Print E-Admit Card
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="medium" 
                          onClick={() => handleOpenAdmitCardPreview(selectedApplication, 'admit_card')} 
                          startIcon={<FaEye />} 
                          sx={{ 
                            borderColor: '#2563EB', color: '#2563EB', fontWeight: 700, textTransform: 'none', borderRadius: 1.5,
                            backgroundColor: '#FFFFFF', '&:hover': { backgroundColor: '#DBEAFE' }
                          }}
                        >
                          Preview
                        </Button>
                      </Box>
                    </Box>

                    {/* Application Form & Fee Receipt Group */}
                    <Box sx={{ p: 1.5, background: '#ECFDF5', borderRadius: 2, border: '1px solid #A7F3D0' }}>
                      <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 1 }}>
                        2. Application Form &amp; Fee Receipt
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Button 
                          variant="contained" 
                          fullWidth
                          size="medium" 
                          onClick={() => printApplicationForm(selectedApplication)} 
                          startIcon={<FaPrint />} 
                          sx={{ 
                            background: 'linear-gradient(135deg, #059669, #047857)', 
                            color: '#fff', fontWeight: 700, textTransform: 'none', borderRadius: 1.5,
                            boxShadow: '0 4px 12px rgba(5,150,105,0.25)'
                          }}
                        >
                          Print Application Form
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="medium" 
                          onClick={() => handleOpenAdmitCardPreview(selectedApplication, 'application_form')} 
                          startIcon={<FaEye />} 
                          sx={{ 
                            borderColor: '#059669', color: '#059669', fontWeight: 700, textTransform: 'none', borderRadius: 1.5,
                            backgroundColor: '#FFFFFF', '&:hover': { backgroundColor: '#D1FAE5' }
                          }}
                        >
                          Preview
                        </Button>
                      </Box>
                    </Box>

                    {/* Verification and Navigation */}
                    {selectedApplication.paymentStatus !== 'verified' ? (
                      <Button variant="contained" size="large" disabled={updating} onClick={() => updatePaymentStatus(selectedApplication._id, 'verified')} sx={{ background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', fontWeight: 700, textTransform: 'none', borderRadius: 2 }}>
                        Mark as Verified
                      </Button>
                    ) : (
                      <Button variant="outlined" color="warning" size="large" disabled={updating} onClick={() => updatePaymentStatus(selectedApplication._id, 'pending')} sx={{ borderColor: '#FDE68A', color: '#D97706', backgroundColor: '#FFFBEB', fontWeight: 600, textTransform: 'none', borderRadius: 2, '&:hover': { background: '#FEF3C7' } }}>
                        Revert to Pending
                      </Button>
                    )}
                    <Button variant="outlined" size="large" onClick={() => setShowDetails(false)} sx={{ borderColor: '#CBD5E1', color: '#64748B', fontWeight: 600, textTransform: 'none', borderRadius: 2, '&:hover': { background: '#F1F5F9', borderColor: '#94A3B8' } }}>
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          
          <Box display="flex" alignItems="center" mb={4} gap={2} flexWrap="wrap">
            <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 8px 20px -4px rgba(37,99,235,0.3)', display: 'flex' }}>
              <FaTrophy size={32} color="#fff" />
            </Box>
            <Box flex={1}>
              <Typography variant="h3" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
                Competition <span style={{ color: '#2563EB' }}>Management</span>
              </Typography>
            </Box>
          </Box>

          {/* Session Selector */}
          <Box sx={{ mb: 4, p: 1.5, background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15,23,42,0.04)', display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748B', px: 1.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
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
                      ? 'linear-gradient(90deg, #2563EB, #1D4ED8)'
                      : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#475569',
                    border: `1px solid ${isActive ? '#2563EB' : '#E2E8F0'}`,
                    boxShadow: isActive ? '0 4px 14px rgba(37,99,235,0.25)' : 'none',
                    '&:hover': {
                      background: isActive ? 'linear-gradient(90deg, #1D4ED8, #1E40AF)' : '#F8FAFC',
                      color: isActive ? '#FFFFFF' : '#0F172A',
                    },
                  }}
                >
                  {session}
                  {isCurrent && (
                    <Box component="span" sx={{ ml: 1, fontSize: '0.65rem', background: isActive ? 'rgba(255,255,255,0.2)' : '#EFF6FF', color: isActive ? '#FFFFFF' : '#2563EB', px: 0.8, py: 0.2, borderRadius: '6px', fontWeight: 800 }}>
                      CURRENT
                    </Box>
                  )}
                </Button>
              );
            })}
            <Box sx={{ ml: 'auto' }}>
              <Button size="small" onClick={() => loadApplications(activeSession)}
                sx={{ borderRadius: '10px', px: 2, color: '#2563EB', fontWeight: 600, fontSize: '0.8rem', textTransform: 'none', '&:hover': { backgroundColor: '#EFF6FF' } }}>
                ↻ Refresh
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2.5} mb={4}>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', border: '1px solid #BFDBFE', borderRadius: 3, boxShadow: '0 4px 16px -2px rgba(15,23,42,0.04)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5, fontWeight: 700, fontSize: '0.7rem' }}>Total Applications</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#1E3A8A', fontFamily: '"Saira Condensed", sans-serif' }}>{totalApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '1px solid #A7F3D0', borderRadius: 3, boxShadow: '0 4px 16px -2px rgba(15,23,42,0.04)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#065F46', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5, fontWeight: 700, fontSize: '0.7rem' }}>GK Applications</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#064E3B', fontFamily: '"Saira Condensed", sans-serif' }}>{gkApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '1px solid #FDE68A', borderRadius: 3, boxShadow: '0 4px 16px -2px rgba(15,23,42,0.04)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#92400E', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5, fontWeight: 700, fontSize: '0.7rem' }}>Computer Applications</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#78350F', fontFamily: '"Saira Condensed", sans-serif' }}>{computerApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ background: 'linear-gradient(135deg, #FAF5FF, #F3E8FF)', border: '1px solid #E9D5FF', borderRadius: 3, boxShadow: '0 4px 16px -2px rgba(15,23,42,0.04)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#6B21A8', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5, fontWeight: 700, fontSize: '0.7rem' }}>Both Subjects</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#581C87', fontFamily: '"Saira Condensed", sans-serif' }}>{bothApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '1px solid #A7F3D0', borderRadius: 3, boxShadow: '0 4px 16px -2px rgba(15,23,42,0.04)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#065F46', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5, fontWeight: 700, fontSize: '0.7rem' }}>💳 Payments Received</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#059669', fontFamily: '"Saira Condensed", sans-serif' }}>{paidApplications}</Typography>
                  <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>Rs. {paidApplications * 150} collected</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper elevation={0} sx={{ p: 3.5, mb: 4, borderRadius: 3, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
            <Typography variant="h6" mb={2.5} sx={{ color: '#0F172A', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaSearch size={18} color="#2563EB" /> Search Applications
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel sx={{ color: '#64748B', '&.Mui-focused': { color: '#2563EB' } }}>Search By</InputLabel>
                <Select value={searchType} label="Search By" onChange={(e) => { setSearchType(e.target.value); setSearchTerm(''); }}
                  sx={{ color: '#0F172A', backgroundColor: '#FFFFFF', '.MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' } }}>
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
                <InputLabel sx={{ color: '#64748B', '&.Mui-focused': { color: '#059669' } }}>Payment</InputLabel>
                <Select value={paymentFilter} label="Payment" onChange={(e) => setPaymentFilter(e.target.value)}
                  sx={{ color: '#0F172A', backgroundColor: '#FFFFFF', '.MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#059669' } }}>
                  <MenuItem value="all">💳 All Payments</MenuItem>
                  <MenuItem value="paid">✅ Paid</MenuItem>
                  <MenuItem value="pending">⏳ Pending</MenuItem>
                  <MenuItem value="failed">❌ Failed</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                placeholder="Search by name, roll, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flexGrow: 1, minWidth: 280, input: { color: '#0F172A', backgroundColor: '#FFFFFF' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#CBD5E1' }, '&:hover fieldset': { borderColor: '#94A3B8' }, '&.Mui-focused fieldset': { borderColor: '#2563EB' } } }}
                InputProps={{ startAdornment: ( <InputAdornment position="start"><FaSearch color="#94A3B8" /></InputAdornment> ) }}
              />
              
              {searchTerm && (
                <Button variant="outlined" onClick={() => setSearchTerm('')} sx={{ color: '#64748B', borderColor: '#CBD5E1', textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: '#94A3B8', background: '#F8FAFC' } }}>
                  Clear
                </Button>
              )}
              
              <Button variant="contained" onClick={exportToCSV} startIcon={<FaDownload />} sx={{ background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: 2 }}>CSV</Button>
              <Button variant="contained" onClick={exportAttendancePDF} startIcon={<FaDownload />} sx={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)', color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: 2 }}>PDF</Button>
              <Button variant="contained" onClick={exportAttendanceJPG} startIcon={<FaDownload />} sx={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: 2 }}>JPG</Button>
            </Box>
          </Paper>

          <Paper sx={{ borderRadius: 3, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  <TableRow>
                    {['Roll Number', 'Name', "Father's Name", 'Payment', 'Photo', 'Signature', 'Actions'].map((header) => (
                      <TableCell key={header} sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application._id || application.rollNumber} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC !important' } }}>
                      <TableCell sx={{ color: '#2563EB', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>{application.rollNumber}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Typography sx={{ color: '#0F172A', fontWeight: 600 }}>{application.name}</Typography>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>{application.email}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#475569', borderBottom: '1px solid #F1F5F9' }}>{application.fatherName || 'Not provided'}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Chip
                          label={application.paymentStatus === 'paid' || application.paymentStatus === 'verified' ? 'PAID' : application.paymentStatus === 'failed' ? 'FAILED' : 'PENDING'}
                          size="small"
                          sx={{
                            background: application.paymentStatus === 'paid' || application.paymentStatus === 'verified'
                              ? '#ECFDF5' : application.paymentStatus === 'failed'
                              ? '#FEF2F2' : '#FFFBEB',
                            color: application.paymentStatus === 'paid' || application.paymentStatus === 'verified'
                              ? '#059669' : application.paymentStatus === 'failed'
                              ? '#DC2626' : '#D97706',
                            fontWeight: 700, fontSize: '0.7rem', border: '1px solid',
                            borderColor: application.paymentStatus === 'paid' || application.paymentStatus === 'verified'
                              ? '#A7F3D0' : application.paymentStatus === 'failed'
                              ? '#FECACA' : '#FDE68A',
                          }}
                        />
                        {application.paymentTransactionId && (
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.65rem', mt: 0.3 }}>{application.paymentTransactionId.slice(0, 12)}…</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        {application.image ? (
                          <Box component="img" src={application.image} alt="photo" sx={{ width: 44, height: 44, borderRadius: 2, objectFit: 'cover', border: '1px solid #E2E8F0' }} />
                        ) : (
                          <Box sx={{ width: 44, height: 44, borderRadius: 2, background: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#94A3B8' }}>No Photo</Box>
                        )}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Box sx={{ width: 100, height: 36, border: '1px dashed #CBD5E1', borderRadius: 1, backgroundColor: '#F8FAFC' }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Candidate Application Details">
                            <Button variant="outlined" size="small" onClick={() => handleViewDetails(application)} sx={{ color: '#2563EB', borderColor: '#BFDBFE', backgroundColor: '#EFF6FF', minWidth: 0, p: 1, '&:hover': { backgroundColor: '#DBEAFE' } }}><FaEye /></Button>
                          </Tooltip>
                          <Tooltip title="Print E-Admit Card (Exam Hall Ticket)">
                            <Button variant="outlined" size="small" onClick={() => printAdmitCard(application)} sx={{ color: '#2563EB', borderColor: '#BFDBFE', backgroundColor: '#EFF6FF', minWidth: 0, p: 1, '&:hover': { backgroundColor: '#DBEAFE' } }}><FaPrint /></Button>
                          </Tooltip>
                          <Tooltip title="Print Application Form & Fee Confirmation Receipt">
                            <Button variant="outlined" size="small" onClick={() => printApplicationForm(application)} sx={{ color: '#059669', borderColor: '#A7F3D0', backgroundColor: '#ECFDF5', minWidth: 0, p: 1, '&:hover': { backgroundColor: '#D1FAE5' } }}><FaReceipt /></Button>
                          </Tooltip>
                          <Tooltip title="Live Document Preview (Toggle Admit Card / Application Form)">
                            <Button variant="outlined" size="small" onClick={() => handleOpenAdmitCardPreview(application, 'admit_card')} sx={{ color: '#0F172A', borderColor: '#CBD5E1', backgroundColor: '#F8FAFC', minWidth: 0, p: 1, '&:hover': { backgroundColor: '#E2E8F0', borderColor: '#94A3B8' } }}><FaFileAlt /></Button>
                          </Tooltip>
                          <Tooltip title="Delete Application">
                            <Button variant="outlined" size="small" onClick={() => handleDelete(application._id)} sx={{ color: '#DC2626', borderColor: '#FECACA', backgroundColor: '#FEF2F2', minWidth: 0, p: 1, '&:hover': { backgroundColor: '#FEE2E2' } }}><FaTrash /></Button>
                          </Tooltip>
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

      {/* Government E-Admit Card & Application Form Live Preview Modal */}
      <GovernmentAdmitCardModal 
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        application={previewApplication}
        initialDocType={previewDocType}
      />
    </Box>
  );
};

export default CompetitionManagement;
