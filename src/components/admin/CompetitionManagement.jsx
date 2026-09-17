import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, Card, CardContent, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress, Divider, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  FaTrophy, FaSearch, FaPrint, FaEye, FaTrash, FaDownload, FaFileAlt, 
  FaReceipt, FaUserPlus, FaCheckCircle, FaTimes, FaCamera, FaCloudUploadAlt,
  FaVideo, FaUser, FaPhoneAlt, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt, 
  FaIdCard, FaBook, FaLaptopCode, FaCheck, FaInfoCircle, FaRegLightbulb, FaPaste
} from 'react-icons/fa';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { openAdmitCardPrintWindow, openApplicationFormPrintWindow, formatAdmitCardDob } from '../../utils/admitCardGenerator';
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
  const [imageLightBox, setImageLightBox] = useState(null);

  // Offline registration state
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [offlineSuccessModalOpen, setOfflineSuccessModalOpen] = useState(false);
  const [createdOfflineCandidate, setCreatedOfflineCandidate] = useState(null);
  const [submittingOffline, setSubmittingOffline] = useState(false);
  const [offlineError, setOfflineError] = useState('');
  const [offlineImagePreview, setOfflineImagePreview] = useState(null);
  const [uploadingOfflineImage, setUploadingOfflineImage] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const offlineFileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [offlineFormData, setOfflineFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    phone: '',
    parentPhone: '',
    school: '',
    address: '',
    subject: 'GK',
    aadhaar: '',
    dateOfBirth: '',
    classPassed: '',
    image: null,
    session: CURRENT_SESSION
  });
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
        app.dateOfBirth ? formatAdmitCardDob(app.dateOfBirth) : 'Not provided',
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
      if (paymentFilter === 'online_paid' && (app.registrationType === 'offline' || (app.paymentStatus !== 'paid' && app.paymentStatus !== 'verified'))) return false;
      if (paymentFilter === 'offline_paid' && app.registrationType !== 'offline' && app.paymentMode !== 'offline_cash') return false;
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
  // Online collection only (Offline registrations DO NOT add to wallet / online collection!)
  const onlinePaidApplications = applications.filter(app => app.registrationType !== 'offline' && (app.paymentStatus === 'paid' || app.paymentStatus === 'verified')).length;
  const offlineApplications = applications.filter(app => app.registrationType === 'offline' || app.paymentMode === 'offline_cash').length;

  const resetOfflineForm = () => {
    setOfflineFormData({
      name: '',
      fatherName: '',
      motherName: '',
      phone: '',
      parentPhone: '',
      school: '',
      address: '',
      subject: 'GK',
      aadhaar: '',
      dateOfBirth: '',
      classPassed: '',
      image: null,
      session: activeSession || CURRENT_SESSION
    });
    setOfflineImagePreview(null);
    setOfflineError('');
    if (offlineFileInputRef.current) offlineFileInputRef.current.value = '';
  };

  const uploadImageBlob = async (blob, customFilename = null) => {
    if (!blob) return;
    if (blob.size > 5 * 1024 * 1024) {
      setOfflineError('Image size must be less than 5MB');
      return;
    }
    setUploadingOfflineImage(true);
    setOfflineError('');
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const mf = new FormData();
      const filename = customFilename || (blob.name ? blob.name : `candidate_${Date.now()}.jpg`);
      mf.append('image', blob, filename);
      const mr = await fetch(`${API_BASE_URL}/api/upload-image-mongo`, { method: 'POST', body: mf });
      if (mr.ok) {
        const mj = await mr.json();
        if (mj.secure_url) {
          setOfflineFormData(p => ({ ...p, image: mj.secure_url }));
          setOfflineImagePreview(mj.secure_url);
          return;
        }
      }
      setOfflineError('Photo upload failed. You can proceed without photo.');
    } catch (err) {
      console.error('Image upload error:', err);
      setOfflineError('Photo upload failed. You can proceed without photo.');
    } finally {
      setUploadingOfflineImage(false);
    }
  };

  const handleOfflineImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    uploadImageBlob(file);
  };

  const handleRemoveOfflineImage = () => {
    setOfflineFormData(p => ({ ...p, image: null }));
    setOfflineImagePreview(null);
    if (offlineFileInputRef.current) {
      offlineFileInputRef.current.value = '';
    }
  };

  // Webcam camera handlers
  const startWebcam = async () => {
    try {
      setOfflineError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      streamRef.current = stream;
      setWebcamOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 150);
    } catch (err) {
      console.error('Webcam error:', err);
      setOfflineError('Unable to access camera. Please check camera permissions or browse photo file.');
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setWebcamOpen(false);
  };

  const captureWebcamPhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      stopWebcam();
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        uploadImageBlob(blob, `camera_capture_${Date.now()}.jpg`);
      }, 'image/jpeg', 0.92);
    } catch (err) {
      console.error('Capture error:', err);
      setOfflineError('Failed to capture photo from camera.');
    }
  };

  // Clipboard paste listener (Ctrl+V anywhere in offline modal)
  useEffect(() => {
    const handlePaste = (e) => {
      if (!offlineModalOpen) return;
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type && items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            uploadImageBlob(file, `clipboard_${Date.now()}.jpg`);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [offlineModalOpen]);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const d = new Date(dob);
    if (isNaN(d.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age;
  };

  const handleOfflineSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setOfflineError('');

    if (!offlineFormData.name || !offlineFormData.fatherName || !offlineFormData.motherName ||
        !offlineFormData.phone || !offlineFormData.school || !offlineFormData.address ||
        !offlineFormData.dateOfBirth || !offlineFormData.classPassed) {
      setOfflineError('Please fill all required fields marked with *');
      return;
    }

    if (offlineFormData.phone.length < 10) {
      setOfflineError('Please enter a valid 10-digit mobile number');
      return;
    }

    setSubmittingOffline(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/competition-applications/offline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...offlineFormData,
          session: offlineFormData.session || activeSession || CURRENT_SESSION
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to register offline candidate');
      }

      setApplications(prev => [data, ...prev]);
      setCreatedOfflineCandidate(data);
      setOfflineModalOpen(false);
      setOfflineSuccessModalOpen(true);
      resetOfflineForm();
    } catch (err) {
      console.error('Offline registration error:', err);
      setOfflineError(err.message || 'Registration failed');
    } finally {
      setSubmittingOffline(false);
    }
  };

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
                        <Typography variant="h6" fontWeight={600} color="#0F172A">{selectedApplication.dateOfBirth ? formatAdmitCardDob(selectedApplication.dateOfBirth) : 'Not provided'}</Typography>
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
                  {/* Candidate Photo Card */}
                  <Box sx={{ background: '#F8FAFC', p: 3, borderRadius: 3, border: '1px solid #E2E8F0', textAlign: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Candidate Photo
                    </Typography>
                    <Box sx={{
                      width: 130,
                      height: 160,
                      mx: 'auto',
                      mb: 1.5,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: selectedApplication.image ? '3px solid #059669' : '2px dashed #94A3B8',
                      background: '#F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: selectedApplication.image ? '0 8px 24px -4px rgba(5,150,105,0.3)' : 'none',
                      cursor: selectedApplication.image ? 'pointer' : 'default'
                    }}
                    onClick={() => selectedApplication.image && setImageLightBox(selectedApplication.image)}
                    >
                      {selectedApplication.image ? (
                        <Box component="img" src={selectedApplication.image} alt={selectedApplication.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Box textAlign="center" p={1}>
                          <FaUser size={38} color="#94A3B8" />
                          <Typography variant="caption" sx={{ display: 'block', color: '#64748B', fontWeight: 700, mt: 0.5, fontSize: '0.75rem' }}>
                            No Photo Uploaded
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block', color: '#94A3B8', fontSize: '0.65rem' }}>
                            Affix at Center
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: selectedApplication.image ? '#059669' : '#64748B', fontWeight: 700, display: 'block' }}>
                      {selectedApplication.image ? '✓ Photo Verified (Click to enlarge)' : 'Passport photo can be affixed on Admit Card'}
                    </Typography>
                  </Box>

                  {/* QR Code Card */}
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
            <Button
              variant="contained"
              onClick={() => { resetOfflineForm(); setOfflineModalOpen(true); }}
              startIcon={<FaUserPlus />}
              sx={{
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.95rem',
                py: 1.2,
                px: 2.8,
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
                '&:hover': { background: 'linear-gradient(135deg, #047857, #065F46)' }
              }}
            >
              + Add Offline Candidate
            </Button>
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
                  <Typography variant="subtitle2" sx={{ color: '#065F46', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5, fontWeight: 700, fontSize: '0.7rem' }}>💳 Online Received</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#059669', fontFamily: '"Saira Condensed", sans-serif' }}>{onlinePaidApplications}</Typography>
                  <Typography variant="caption" sx={{ color: '#047857', fontWeight: 600 }}>Rs. {onlinePaidApplications * 150} collected</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', border: '1px solid #86EFAC', borderRadius: 3, boxShadow: '0 4px 16px -2px rgba(15,23,42,0.04)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#15803D', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5, fontWeight: 700, fontSize: '0.7rem' }}>📝 Offline (Direct)</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#166534', fontFamily: '"Saira Condensed", sans-serif' }}>{offlineApplications}</Typography>
                  <Typography variant="caption" sx={{ color: '#15803D', fontWeight: 600 }}>0 to wallet • Direct Cash</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '1px solid #FDE68A', borderRadius: 3, boxShadow: '0 4px 16px -2px rgba(15,23,42,0.04)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#92400E', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5, fontWeight: 700, fontSize: '0.7rem' }}>GK Applications</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#78350F', fontFamily: '"Saira Condensed", sans-serif' }}>{gkApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Card sx={{ background: 'linear-gradient(135deg, #FAF5FF, #F3E8FF)', border: '1px solid #E9D5FF', borderRadius: 3, boxShadow: '0 4px 16px -2px rgba(15,23,42,0.04)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ color: '#6B21A8', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5, fontWeight: 700, fontSize: '0.7rem' }}>Computer Applications</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#581C87', fontFamily: '"Saira Condensed", sans-serif' }}>{computerApplications}</Typography>
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
                  <MenuItem value="online_paid">🌐 Online Paid</MenuItem>
                  <MenuItem value="offline_paid">📝 Offline (Cash/Manual)</MenuItem>
                  <MenuItem value="paid">✅ All Paid</MenuItem>
                  <MenuItem value="pending">⏳ Pending (Legacy)</MenuItem>
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
                        <Typography sx={{ color: '#0F172A', fontWeight: 700 }}>{application.name}</Typography>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.78rem' }}>
                          📱 {application.phone || 'No phone'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#475569', borderBottom: '1px solid #F1F5F9' }}>{application.fatherName || 'Not provided'}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        {application.registrationType === 'offline' ? (
                          <Chip
                            label="OFFLINE (PAID)"
                            size="small"
                            sx={{
                              background: '#F0FDF4',
                              color: '#15803D',
                              border: '1px solid #86EFAC',
                              fontWeight: 800,
                              fontSize: '0.68rem',
                            }}
                          />
                        ) : (
                          <Chip
                            label={application.paymentStatus === 'paid' || application.paymentStatus === 'verified' ? 'ONLINE PAID' : application.paymentStatus === 'failed' ? 'FAILED' : 'PENDING'}
                            size="small"
                            sx={{
                              background: application.paymentStatus === 'paid' || application.paymentStatus === 'verified'
                                ? '#EFF6FF' : application.paymentStatus === 'failed'
                                ? '#FEF2F2' : '#FFFBEB',
                              color: application.paymentStatus === 'paid' || application.paymentStatus === 'verified'
                                ? '#1D4ED8' : application.paymentStatus === 'failed'
                                ? '#DC2626' : '#D97706',
                              fontWeight: 700, fontSize: '0.68rem', border: '1px solid',
                              borderColor: application.paymentStatus === 'paid' || application.paymentStatus === 'verified'
                                ? '#BFDBFE' : application.paymentStatus === 'failed'
                                ? '#FECACA' : '#FDE68A',
                            }}
                          />
                        )}
                        {application.paymentTransactionId && (
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.65rem', mt: 0.3 }}>
                            {application.paymentTransactionId.slice(0, 16)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        {application.image ? (
                          <Tooltip title="Click to view full photo">
                            <Box 
                              component="img" 
                              src={application.image} 
                              alt={application.name} 
                              onClick={() => setImageLightBox(application.image)}
                              sx={{ 
                                width: 44, 
                                height: 48, 
                                borderRadius: '8px', 
                                objectFit: 'cover', 
                                border: '2px solid #059669', 
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': { transform: 'scale(1.12)', boxShadow: '0 4px 12px rgba(5,150,105,0.35)' }
                              }} 
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="No photo uploaded (Will paste physically on Admit Card)">
                            <Box sx={{ 
                              width: 44, 
                              height: 48, 
                              borderRadius: '8px', 
                              background: '#F1F5F9', 
                              border: '1px dashed #CBD5E1', 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              justifyContent: 'center' 
                            }}>
                              <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>
                                {application.name ? application.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'NA'}
                              </Typography>
                              <Typography sx={{ fontSize: '7px', color: '#94A3B8' }}>No Photo</Typography>
                            </Box>
                          </Tooltip>
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

      {/* Offline Candidate Registration Modal (Beautiful & Enhanced Design with Photo Upload) */}
      {/* Offline Candidate Registration Modal (Full Screen with Pure English UI) */}
      <Dialog 
        fullScreen
        open={offlineModalOpen} 
        onClose={() => !submittingOffline && setOfflineModalOpen(false)} 
        PaperProps={{ 
          sx: { 
            background: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column'
          } 
        }}
      >
        {/* Full-Width Header with Emerald Gradient */}
        <DialogTitle sx={{ 
          p: 0, 
          position: 'relative', 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #064E3B 0%, #047857 50%, #059669 100%)', 
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          zIndex: 10
        }}>
          <Box sx={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <Box sx={{ px: { xs: 2, sm: 4 }, py: 2.2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ 
                width: 48, height: 48, borderRadius: '14px', 
                background: 'rgba(255,255,255,0.18)', 
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.3)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <FaUserPlus size={22} color="#A7F3D0" />
              </Box>
              <Box>
                <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                  <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '0.5px', fontFamily: '"Saira Condensed", sans-serif', color: '#FFFFFF' }}>
                    Offline Candidate Registration
                  </Typography>
                  <Chip 
                    label="AUTHORIZED OFFLINE DESK" 
                    size="small" 
                    sx={{ background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.5px' }} 
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#D1FAE5', mt: 0.2, fontSize: '0.82rem' }}>
                  Direct manual admission &bull; Sequential Roll Number generated &bull; Zero wallet addition &bull; Auto marked as Paid
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={() => !submittingOffline && setOfflineModalOpen(false)} 
              sx={{ 
                color: '#FFFFFF', 
                bgcolor: 'rgba(255,255,255,0.12)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                width: 42,
                height: 42
              }}
            >
              <FaTimes size={18} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 }, backgroundColor: '#F8FAFC', flexGrow: 1, overflowY: 'auto' }}>
          <Container maxWidth="xl" sx={{ p: 0 }}>
            {offlineError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '14px', border: '1px solid #FECACA' }}>
                {offlineError}
              </Alert>
            )}

            <Grid container spacing={3.5}>
              {/* Left Column: Passport Photo Studio & Highlights */}
              <Grid item xs={12} md={4} lg={3.5}>
                {/* Photo Studio Card */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: '22px', 
                    border: isDraggingPhoto ? '2px dashed #059669' : '1px solid #E2E8F0', 
                    background: isDraggingPhoto ? '#ECFDF5' : '#FFFFFF', 
                    textAlign: 'center', 
                    mb: 3,
                    boxShadow: '0 4px 20px -4px rgba(15,23,42,0.06)',
                    transition: 'all 0.2s ease'
                  }}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingPhoto(true); }}
                  onDragLeave={() => setIsDraggingPhoto(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingPhoto(false);
                    const file = e.dataTransfer.files && e.dataTransfer.files[0];
                    if (file) uploadImageBlob(file);
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.8}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <FaCamera color="#059669" /> Candidate Photo
                    </Typography>
                    {offlineImagePreview ? (
                      <Chip 
                        icon={<FaCheck size={10} />} 
                        label="Attached" 
                        size="small" 
                        sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem', height: 22 }} 
                      />
                    ) : (
                      <Chip 
                        icon={<FaInfoCircle size={10} />} 
                        label="Optional" 
                        size="small" 
                        sx={{ bgcolor: '#F1F5F9', color: '#64748B', fontWeight: 700, fontSize: '0.68rem', height: 22 }} 
                      />
                    )}
                  </Box>

                  {/* Passport Photo Box */}
                  <Box sx={{
                    width: 145,
                    height: 180,
                    mx: 'auto',
                    mb: 2,
                    borderRadius: '16px',
                    border: offlineImagePreview ? '3px solid #059669' : '2px dashed #CBD5E1',
                    background: '#F8FAFC',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: offlineImagePreview ? '0 10px 25px -5px rgba(5,150,105,0.3)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    {uploadingOfflineImage ? (
                      <Box textAlign="center" p={2}>
                        <CircularProgress size={32} sx={{ color: '#059669', mb: 1 }} />
                        <Typography variant="caption" sx={{ display: 'block', color: '#64748B', fontWeight: 700 }}>
                          Uploading...
                        </Typography>
                      </Box>
                    ) : offlineImagePreview ? (
                      <Box 
                        component="img" 
                        src={offlineImagePreview} 
                        alt="Candidate Preview" 
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => setImageLightBox(offlineImagePreview)}
                      />
                    ) : (
                      <Box textAlign="center" p={1.5}>
                        <FaUser size={46} color="#CBD5E1" />
                        <Typography variant="caption" sx={{ display: 'block', color: '#64748B', fontWeight: 800, mt: 0.8, fontSize: '0.78rem' }}>
                          No Photo
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', color: '#94A3B8', fontSize: '0.68rem', mt: 0.2 }}>
                          Optional • 35×45mm
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    ref={offlineFileInputRef} 
                    accept="image/*" 
                    onChange={handleOfflineImageChange} 
                    style={{ display: 'none' }} 
                  />

                  {/* Action Buttons: Upload + Webcam + Remove */}
                  <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
                    <Button
                      variant="contained"
                      size="small"
                      disabled={uploadingOfflineImage}
                      onClick={() => offlineFileInputRef.current && offlineFileInputRef.current.click()}
                      startIcon={<FaCloudUploadAlt />}
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        background: 'linear-gradient(135deg, #059669, #047857)',
                        boxShadow: '0 4px 12px rgba(5,150,105,0.2)'
                      }}
                    >
                      {offlineImagePreview ? 'Change File' : 'Browse File'}
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      disabled={uploadingOfflineImage}
                      onClick={startWebcam}
                      startIcon={<FaCamera />}
                      sx={{
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        borderColor: '#059669',
                        color: '#059669',
                        '&:hover': { borderColor: '#047857', backgroundColor: '#ECFDF5' }
                      }}
                    >
                      Camera
                    </Button>

                    {offlineImagePreview && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={handleRemoveOfflineImage}
                        startIcon={<FaTrash />}
                        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem' }}
                      >
                        Clear
                      </Button>
                    )}
                  </Box>

                  {/* English Photo Guidance Callout */}
                  <Paper elevation={0} sx={{ mt: 2.2, p: 2, borderRadius: '14px', background: '#FFFBEB', border: '1px solid #FDE68A', textAlign: 'left' }}>
                    <Box display="flex" alignItems="center" gap={0.8} mb={0.5}>
                      <FaRegLightbulb color="#D97706" size={14} />
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#92400E', fontSize: '0.75rem' }}>
                        No Photo Available?
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#78350F', display: 'block', lineHeight: 1.4, fontSize: '0.72rem' }}>
                      No problem! You can register the candidate without a photo. An official box will automatically be printed on the E-Admit Card for physical photo affixing.
                    </Typography>
                    <Divider sx={{ my: 1, borderColor: '#FDE68A' }} />
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <FaPaste color="#B45309" size={12} />
                      <Typography variant="caption" sx={{ color: '#92400E', fontWeight: 700, fontSize: '0.7rem' }}>
                        Tip: You can paste any copied image directly using Ctrl+V!
                      </Typography>
                    </Box>
                  </Paper>
                </Paper>

                {/* Admission Verification Summary Card */}
                <Paper elevation={0} sx={{ p: 2.8, borderRadius: '22px', border: '1px solid #BFDBFE', background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', boxShadow: '0 4px 20px -4px rgba(37,99,235,0.08)' }}>
                  <Typography variant="caption" sx={{ color: '#1E40AF', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 1.5, letterSpacing: '0.6px' }}>
                    Registration Summary
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1.1} sx={{ fontSize: '0.8rem', color: '#1E3A8A' }}>
                    <Box display="flex" justifyContent="space-between">
                      <span>Payment Status:</span>
                      <strong style={{ color: '#059669' }}>✓ AUTO MARKED PAID</strong>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <span>Fee Collected:</span>
                      <strong>Rs. 150 (Desk Cash)</strong>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <span>Wallet Impact:</span>
                      <strong style={{ color: '#059669' }}>Rs. 0 (Untouched)</strong>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <span>Exam Date:</span>
                      <strong>18 Oct 2026 (Sunday)</strong>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <span>Reporting Time:</span>
                      <strong>08:00 AM</strong>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <span>Centre Venue:</span>
                      <strong>SKMIC Semari Janghai</strong>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Right Column: Structured Form Sections */}
              <Grid item xs={12} md={8} lg={8.5}>
                {/* Section 1: Candidate Personal Details */}
                <Paper elevation={0} sx={{ p: 3.2, borderRadius: '22px', border: '1px solid #E2E8F0', background: '#FFFFFF', mb: 3, boxShadow: '0 4px 20px -4px rgba(15,23,42,0.06)' }}>
                  <Box display="flex" alignItems="center" gap={1.2} mb={2.5}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                      <FaUser size={16} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800} color="#0F172A" sx={{ lineHeight: 1.2 }}>
                        1. Candidate Personal Information
                      </Typography>
                      <Typography variant="caption" color="#64748B">
                        Official student credentials as per school or Aadhaar records
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2.2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Candidate Full Name *"
                        required
                        value={offlineFormData.name}
                        onChange={(e) => setOfflineFormData(p => ({ ...p, name: e.target.value.toUpperCase() }))}
                        placeholder="e.g. AMAN VERMA"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FaUser color="#2563EB" size={14} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Date of Birth *"
                        required
                        InputLabelProps={{ shrink: true }}
                        value={offlineFormData.dateOfBirth}
                        onChange={(e) => setOfflineFormData(p => ({ ...p, dateOfBirth: e.target.value }))}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FaCalendarAlt color="#2563EB" size={14} />
                            </InputAdornment>
                          )
                        }}
                        helperText={offlineFormData.dateOfBirth && calculateAge(offlineFormData.dateOfBirth) !== null ? `🎂 Calculated Age: ${calculateAge(offlineFormData.dateOfBirth)} Years (Eligible ✓)` : 'Select Candidate DOB'}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Father's Full Name *"
                        required
                        value={offlineFormData.fatherName}
                        onChange={(e) => setOfflineFormData(p => ({ ...p, fatherName: e.target.value.toUpperCase() }))}
                        placeholder="e.g. RAMESH VERMA"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FaUser color="#64748B" size={14} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Mother's Full Name *"
                        required
                        value={offlineFormData.motherName}
                        onChange={(e) => setOfflineFormData(p => ({ ...p, motherName: e.target.value.toUpperCase() }))}
                        placeholder="e.g. SUNITA DEVI"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FaUser color="#64748B" size={14} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Aadhaar Card Number (12 digits)"
                        value={offlineFormData.aadhaar}
                        onChange={(e) => setOfflineFormData(p => ({ ...p, aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                        placeholder="12-digit UID"
                        inputProps={{ maxLength: 12 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FaIdCard color="#2563EB" size={14} />
                            </InputAdornment>
                          )
                        }}
                        helperText={offlineFormData.aadhaar.length === 12 ? '✓ 12-digit Aadhaar Complete' : `${offlineFormData.aadhaar.length}/12 digits (Optional)`}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Candidate Mobile Number *"
                        required
                        value={offlineFormData.phone}
                        onChange={(e) => setOfflineFormData(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                        placeholder="10-digit Mobile Number"
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FaPhoneAlt color="#2563EB" size={14} />
                            </InputAdornment>
                          )
                        }}
                        helperText={offlineFormData.phone.length === 10 ? '✓ 10-digit Mobile Complete' : `${offlineFormData.phone.length}/10 digits (Required)`}
                      />
                    </Grid>
                  </Grid>
                </Paper>

                {/* Section 2: Academic & Examination Details */}
                <Paper elevation={0} sx={{ p: 3.2, borderRadius: '22px', border: '1px solid #E2E8F0', background: '#FFFFFF', mb: 3, boxShadow: '0 4px 20px -4px rgba(15,23,42,0.06)' }}>
                  <Box display="flex" alignItems="center" gap={1.2} mb={2.5}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                      <FaGraduationCap size={16} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800} color="#0F172A" sx={{ lineHeight: 1.2 }}>
                        2. Academic &amp; Examination Details
                      </Typography>
                      <Typography variant="caption" color="#64748B">
                        Institution name, standard, and competition subject paper
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2.2}>
                    <Grid item xs={12} sm={7}>
                      <TextField
                        fullWidth
                        label="School / College / Institution *"
                        required
                        value={offlineFormData.school}
                        onChange={(e) => setOfflineFormData(p => ({ ...p, school: e.target.value.toUpperCase() }))}
                        placeholder="School / College Name"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FaGraduationCap color="#059669" size={14} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Class / Standard *"
                        required
                        value={offlineFormData.classPassed}
                        onChange={(e) => setOfflineFormData(p => ({ ...p, classPassed: e.target.value }))}
                        placeholder="e.g. 10th / 12th / BA"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FaBook color="#059669" size={14} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    {/* Quick Class Selection Chips */}
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700 }}>
                          Quick Select Class:
                        </Typography>
                        {['Class 8th', 'Class 9th', 'Class 10th', 'Class 11th', 'Class 12th', 'Graduation / BA', 'B.Sc / Other'].map((cls) => (
                          <Chip
                            key={cls}
                            label={cls}
                            size="small"
                            clickable
                            onClick={() => setOfflineFormData(p => ({ ...p, classPassed: cls }))}
                            sx={{
                              borderRadius: '8px',
                              fontWeight: offlineFormData.classPassed === cls ? 800 : 600,
                              backgroundColor: offlineFormData.classPassed === cls ? '#059669' : '#F1F5F9',
                              color: offlineFormData.classPassed === cls ? '#FFFFFF' : '#475569',
                              '&:hover': { backgroundColor: '#059669', color: '#FFFFFF' }
                            }}
                          />
                        ))}
                      </Box>
                    </Grid>

                    {/* Interactive 3-Card Subject Selector (English Only) */}
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 1 }}>
                        Examination Subject *
                      </Typography>
                      <Grid container spacing={1.5}>
                        {[
                          { val: 'GK', label: 'GK (General Knowledge)', sub: 'General Knowledge Exam', icon: <FaBook size={18} /> },
                          { val: 'Computer', label: 'Computer Literacy', sub: 'Computer Knowledge Exam', icon: <FaLaptopCode size={18} /> },
                          { val: 'Both', label: 'Both (GK + Computer)', sub: 'Combined Comprehensive Paper', icon: <FaTrophy size={18} /> }
                        ].map((item) => {
                          const isSelected = offlineFormData.subject === item.val;
                          return (
                            <Grid item xs={12} sm={4} key={item.val}>
                              <Paper
                                elevation={0}
                                onClick={() => setOfflineFormData(p => ({ ...p, subject: item.val }))}
                                sx={{
                                  p: 2,
                                  borderRadius: '16px',
                                  border: isSelected ? '2px solid #059669' : '1px solid #E2E8F0',
                                  background: isSelected ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' : '#F8FAFC',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1.5,
                                  '&:hover': { borderColor: '#059669', transform: 'translateY(-2px)' }
                                }}
                              >
                                <Box sx={{ 
                                  width: 38, height: 38, borderRadius: '10px', 
                                  background: isSelected ? '#059669' : '#E2E8F0', 
                                  color: isSelected ? '#FFFFFF' : '#64748B',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                }}>
                                  {item.icon}
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 800, color: isSelected ? '#065F46' : '#1E293B', fontSize: '0.85rem' }}>
                                    {item.label}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: isSelected ? '#047857' : '#64748B', fontSize: '0.72rem' }}>
                                    {item.sub}
                                  </Typography>
                                </Box>
                                {isSelected && <FaCheckCircle color="#059669" size={18} />}
                              </Paper>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Session / Exam Year</InputLabel>
                        <Select
                          value={offlineFormData.session}
                          label="Session / Exam Year"
                          onChange={(e) => setOfflineFormData(p => ({ ...p, session: e.target.value }))}
                        >
                          {availableSessions.map(s => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Section 3: Address & Contact */}
                <Paper elevation={0} sx={{ p: 3.2, borderRadius: '22px', border: '1px solid #E2E8F0', background: '#FFFFFF', boxShadow: '0 4px 20px -4px rgba(15,23,42,0.06)' }}>
                  <Box display="flex" alignItems="center" gap={1.2} mb={2.5}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                      <FaMapMarkerAlt size={16} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800} color="#0F172A" sx={{ lineHeight: 1.2 }}>
                        3. Contact &amp; Examination Venue
                      </Typography>
                      <Typography variant="caption" color="#64748B">
                        Emergency guardian contact and official examination venue
                      </Typography>
                    </Box>
                  </Box>

                  <Grid container spacing={2.2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Parent / Guardian Mobile (Optional)"
                        value={offlineFormData.parentPhone}
                        onChange={(e) => setOfflineFormData(p => ({ ...p, parentPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                        placeholder="Parent's Mobile"
                        inputProps={{ maxLength: 10 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FaPhoneAlt color="#D97706" size={14} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper elevation={0} sx={{ p: 1.8, borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, display: 'block' }}>
                          Official Examination Center
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#0F172A', mt: 0.2 }}>
                          🏢 S K Modern Intermediate College Semari Janghai
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, display: 'block', mt: 0.2 }}>
                          ✓ Centre Code: SKMIC-222201 (Confirmed Venue)
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2.5}
                        label="Complete Residential Address *"
                        required
                        value={offlineFormData.address}
                        onChange={(e) => setOfflineFormData(p => ({ ...p, address: e.target.value }))}
                        placeholder="Village/Mohalla, Post Office, Tehsil, District, PIN Code"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                              <FaMapMarkerAlt color="#D97706" size={14} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, md: 5 }, py: 2.2, bgcolor: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
          <Button 
            onClick={() => setOfflineModalOpen(false)} 
            disabled={submittingOffline}
            variant="outlined" 
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3.5, py: 1.1, color: '#64748B', borderColor: '#CBD5E1' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleOfflineSubmit} 
            disabled={submittingOffline || uploadingOfflineImage}
            variant="contained" 
            startIcon={submittingOffline ? null : <FaCheckCircle />}
            sx={{ 
              borderRadius: '12px', 
              textTransform: 'none', 
              fontWeight: 800, 
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #059669, #047857)',
              py: 1.3,
              px: 5,
              boxShadow: '0 6px 20px rgba(5,150,105,0.35)',
              '&:hover': { background: 'linear-gradient(135deg, #047857, #065F46)', transform: 'translateY(-1px)' }
            }}
          >
            {submittingOffline ? <CircularProgress size={22} color="inherit" /> : 'Confirm & Register Candidate (Mark Paid)'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Offline Success Dialog with Instant Print Actions */}
      <Dialog
        open={offlineSuccessModalOpen}
        onClose={() => setOfflineSuccessModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '24px', p: 2, textAlign: 'center' } }}
      >
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
            <FaCheckCircle size={44} />
          </Box>
          <Typography variant="h5" fontWeight={800} color="#0F172A" gutterBottom>
            Offline Registration Successful!
          </Typography>
          <Typography variant="body2" color="#64748B" sx={{ mb: 3 }}>
            Candidate has been registered directly and marked as <strong>PAID</strong>.
          </Typography>

          {createdOfflineCandidate && (
            <Paper elevation={0} sx={{ p: 2.5, mb: 3, background: '#F8FAFC', borderRadius: '18px', border: '1px solid #E2E8F0', textAlign: 'left' }}>
              <Box display="flex" gap={2} alignItems="center" mb={2}>
                <Box sx={{
                  width: 60,
                  height: 72,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: createdOfflineCandidate.image ? '2px solid #059669' : '1px dashed #CBD5E1',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {createdOfflineCandidate.image ? (
                    <Box component="img" src={createdOfflineCandidate.image} alt={createdOfflineCandidate.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <FaUser size={24} color="#CBD5E1" />
                  )}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" color="#64748B" sx={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                    Allocated Roll Number
                  </Typography>
                  <Typography variant="h5" fontWeight={900} color="#2563EB" sx={{ lineHeight: 1.1 }}>
                    {createdOfflineCandidate.rollNumber}
                  </Typography>
                  <Typography variant="body2" fontWeight={800} color="#0F172A" sx={{ mt: 0.3 }}>
                    {createdOfflineCandidate.name}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={1} sx={{ fontSize: '0.82rem' }}>
                <Typography variant="body2" color="#64748B">Subject Paper</Typography>
                <Typography variant="body2" fontWeight={700} color="#0F172A">{createdOfflineCandidate.subject}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1} sx={{ fontSize: '0.82rem' }}>
                <Typography variant="body2" color="#64748B">Fee Paid</Typography>
                <Typography variant="body2" fontWeight={700} color="#059669">Rs. 150 (Desk Cash)</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" sx={{ fontSize: '0.82rem' }}>
                <Typography variant="body2" color="#64748B">Candidate Photo</Typography>
                <Typography variant="body2" fontWeight={700} color={createdOfflineCandidate.image ? '#059669' : '#D97706'}>
                  {createdOfflineCandidate.image ? '✓ Photo Attached' : '⚪ Affix on Printed Card'}
                </Typography>
              </Box>
            </Paper>
          )}

          <Box display="flex" flexDirection="column" gap={1.5}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<FaPrint />}
              onClick={() => createdOfflineCandidate && printAdmitCard(createdOfflineCandidate)}
              sx={{
                borderRadius: '12px', py: 1.4, fontWeight: 800, textTransform: 'none',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                boxShadow: '0 4px 14px rgba(37,99,235,0.3)'
              }}
            >
              Print E-Admit Card (Hall Ticket)
            </Button>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<FaReceipt />}
              onClick={() => createdOfflineCandidate && printApplicationForm(createdOfflineCandidate)}
              sx={{
                borderRadius: '12px', py: 1.4, fontWeight: 800, textTransform: 'none',
                background: 'linear-gradient(135deg, #059669, #047857)',
                boxShadow: '0 4px 14px rgba(5,150,105,0.3)'
              }}
            >
              Print Application Form &amp; Fee Receipt
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<FaUserPlus />}
              onClick={() => { setOfflineSuccessModalOpen(false); resetOfflineForm(); setOfflineModalOpen(true); }}
              sx={{ borderRadius: '12px', py: 1.2, fontWeight: 700, textTransform: 'none', borderColor: '#CBD5E1', color: '#0F172A' }}
            >
              + Register Another Offline Candidate
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setOfflineSuccessModalOpen(false)} sx={{ color: '#64748B', fontWeight: 600, textTransform: 'none' }}>
            Close Window
          </Button>
        </DialogActions>
      </Dialog>

      {/* Live Webcam Camera Capture Modal */}
      <Dialog 
        open={webcamOpen} 
        onClose={stopWebcam}
        maxWidth="xs"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '24px', 
            overflow: 'hidden', 
            background: '#0F172A', 
            color: '#FFFFFF',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          } 
        }}
      >
        <DialogTitle sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box display="flex" alignItems="center" gap={1.2}>
            <FaCamera color="#10B981" />
            <Typography variant="subtitle1" fontWeight={800}>Live Webcam Photo</Typography>
          </Box>
          <IconButton onClick={stopWebcam} sx={{ color: '#94A3B8', '&:hover': { color: '#FFFFFF' } }}>
            <FaTimes size={16} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          <Box sx={{
            width: 240,
            height: 300,
            mx: 'auto',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '3px solid #10B981',
            background: '#000000',
            position: 'relative',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
          }}>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            {/* Passport Oval/Box Guide Overlay */}
            <Box sx={{
              position: 'absolute',
              top: '12%',
              left: '12%',
              right: '12%',
              bottom: '12%',
              border: '2px dashed rgba(255,255,255,0.7)',
              borderRadius: '16px',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              pb: 1
            }}>
              <Typography variant="caption" sx={{ color: '#FFFFFF', background: 'rgba(0,0,0,0.6)', px: 1, py: 0.3, borderRadius: '6px', fontSize: '0.68rem' }}>
                Center Face Here
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mt: 2 }}>
            Align candidate's face in the center box and click Capture.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.1)', justifyContent: 'space-between' }}>
          <Button onClick={stopWebcam} sx={{ color: '#94A3B8', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={captureWebcamPhoto}
            startIcon={<FaCamera />}
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontWeight: 800,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #059669, #047857)',
              boxShadow: '0 4px 14px rgba(5,150,105,0.4)',
              '&:hover': { background: 'linear-gradient(135deg, #047857, #065F46)' }
            }}
          >
            Capture Photo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enlarged Candidate Photo Lightbox */}
      <Dialog 
        open={!!imageLightBox} 
        onClose={() => setImageLightBox(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '20px', 
            overflow: 'hidden', 
            p: 1.5, 
            background: '#0F172A', 
            textAlign: 'center',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6)'
          } 
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" px={1} pb={1}>
          <Typography variant="subtitle2" sx={{ color: '#E2E8F0', fontWeight: 700 }}>
            Candidate Photograph
          </Typography>
          <IconButton onClick={() => setImageLightBox(null)} sx={{ color: '#FFFFFF' }}>
            <FaTimes size={16} />
          </IconButton>
        </Box>
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
          {imageLightBox && (
            <Box 
              component="img" 
              src={imageLightBox} 
              alt="Enlarged Candidate Photo" 
              sx={{ 
                maxWidth: '100%', 
                maxHeight: '65vh', 
                borderRadius: '14px', 
                objectFit: 'contain',
                border: '2px solid #334155' 
              }} 
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default CompetitionManagement;
