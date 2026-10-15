import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, Card, CardContent, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress, Divider, IconButton, Checkbox, Pagination, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  FaTrophy, FaSearch, FaPrint, FaEye, FaTrash, FaDownload, FaFileAlt, 
  FaReceipt, FaUserPlus, FaCheckCircle, FaTimes, FaCamera, FaCloudUploadAlt,
  FaVideo, FaUser, FaPhoneAlt, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt, 
  FaIdCard, FaBook, FaLaptopCode, FaCheck, FaInfoCircle, FaRegLightbulb, FaPaste
} from 'react-icons/fa';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { 
  openAdmitCardPrintWindow, 
  openApplicationFormPrintWindow, 
  formatAdmitCardDob,
  isCandidateOverAge,
  AGE_RESTRICTION_MESSAGE 
} from '../../utils/admitCardGenerator';
import { downloadBulkAdmitCardsZip } from '../../utils/bulkAdmitCardDownloader';
import { downloadAttendanceSheetPdf, openAttendanceSheetPrintWindow } from '../../utils/attendanceSheetGenerator';
import { generateBenchSeatingPlanForCandidates } from '../../utils/benchSeatingSolver';
import GovernmentAdmitCardModal from './GovernmentAdmitCardModal';
import OfflineCandidateModal from './OfflineCandidateModal';

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

  // Bulk selection and deletion state
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [deletingBulk, setDeletingBulk] = useState(false);
  const [markingBulkPaid, setMarkingBulkPaid] = useState(false);

  // Offline registration state (modal isolated into OfflineCandidateModal for lag-free performance)
  const [offlineModalOpen, setOfflineModalOpen] = useState(false);
  const [offlineSuccessModalOpen, setOfflineSuccessModalOpen] = useState(false);
  const [createdOfflineCandidate, setCreatedOfflineCandidate] = useState(null);

  // Table pagination state (ensures lightning fast rendering even with thousands of candidates)
  const [page, setPage] = useState(1);
  const rowsPerPage = 25;

  // Bulk operations progress state (Admit cards ZIP & Attendance PDF)
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [progressTitle, setProgressTitle] = useState('');
  const [progressStatus, setProgressStatus] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  // Attendance Sheet Options Modal state (Bench-Wise vs Roll-Wise)
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [attendanceCandidatesTarget, setAttendanceCandidatesTarget] = useState([]);
  const [attendanceLabel, setAttendanceLabel] = useState('All Candidates');
  const [attendanceOrderType, setAttendanceOrderType] = useState('bench'); // 'bench' (Recommended) or 'roll'

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
      setSelectedIds(prev => prev.filter(item => item !== id));
    } catch (e) {
      console.error(e);
      alert(e.message || 'Delete failed');
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    const visibleIds = filteredApplications.map(a => a._id);
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));
    if (allVisibleSelected) {
      setSelectedIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const handleSelectAllPending = () => {
    const pendingIds = applications.filter(a => a.paymentStatus === 'pending').map(a => a._id);
    setSelectedIds(pendingIds);
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setDeletingBulk(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/competition-applications/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete selected applications');
      setApplications(prev => prev.filter(a => !selectedIds.includes(a._id)));
      if (selectedApplication && selectedIds.includes(selectedApplication._id)) {
        setSelectedApplication(null);
        setShowDetails(false);
      }
      setSelectedIds([]);
      setBulkDeleteDialogOpen(false);
      alert(data.message || 'Selected applications deleted successfully');
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to delete selected applications');
    } finally {
      setDeletingBulk(false);
    }
  };

  const handleBulkMarkPaid = async () => {
    if (selectedIds.length === 0) return;
    const confirmMsg = `Are you sure you want to mark ${selectedIds.length} selected application(s) as PAID (Offline/Desk - ₹0 to wallet)?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setMarkingBulkPaid(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/competition-applications/bulk-mark-paid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, status: 'verified' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Bulk mark paid failed');

      setApplications(prev => prev.map(a => {
        if (selectedIds.includes(a._id)) {
          return {
            ...a,
            paymentStatus: 'verified',
            registrationType: 'offline',
            paymentMode: 'offline_cash',
            paymentAmount: 0,
            paidAt: new Date().toISOString()
          };
        }
        return a;
      }));

      if (selectedApplication && selectedIds.includes(selectedApplication._id)) {
        setSelectedApplication(prev => ({
          ...prev,
          paymentStatus: 'verified',
          registrationType: 'offline',
          paymentMode: 'offline_cash',
          paymentAmount: 0,
          paidAt: new Date().toISOString()
        }));
      }

      alert(data.message || 'Selected applications marked as Offline Paid successfully');
      setSelectedIds([]);
    } catch (e) {
      console.error(e);
      alert(e.message || 'Failed to update payment status');
    } finally {
      setMarkingBulkPaid(false);
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

  // 1. Bulk Download Admit Cards ZIP Handler
  const handleDownloadBulkZip = async (candidatesToDownload, label = 'All Candidates') => {
    if (!candidatesToDownload || candidatesToDownload.length === 0) {
      alert('No candidates available to download.');
      return;
    }
    try {
      setProgressTitle(`Packaging Admit Cards ZIP (${label})`);
      setProgressStatus('Initializing export...');
      setProgressPercent(0);
      setProgressModalOpen(true);

      await downloadBulkAdmitCardsZip(
        candidatesToDownload,
        { session: activeSession },
        (current, total, statusText) => {
          setProgressStatus(statusText);
          setProgressPercent(total > 0 ? Math.round((current / total) * 100) : 0);
        }
      );

      setTimeout(() => {
        setProgressModalOpen(false);
      }, 900);
    } catch (err) {
      console.error('Bulk zip error:', err);
      alert('Failed to generate ZIP: ' + (err.message || 'Unknown error'));
      setProgressModalOpen(false);
    }
  };

  // 2. Attendance Sheet PDF Download Handler (Supports Bench-wise and Roll-wise)
  const handleDownloadAttendancePdf = async (candidatesToExport, label = 'All Candidates', orderType = 'bench') => {
    if (!candidatesToExport || candidatesToExport.length === 0) {
      alert('No candidates available to generate Attendance Sheet.');
      return;
    }
    try {
      setProgressTitle(`Generating Attendance Sheet PDF (${label})`);
      setProgressStatus(orderType === 'bench' ? 'Solving anti-cheating bench seating & photos...' : 'Loading candidate details & photos...');
      setProgressPercent(0);
      setProgressModalOpen(true);

      let processedCandidates = candidatesToExport;
      if (orderType === 'bench') {
        const { benchOrderedCandidates } = generateBenchSeatingPlanForCandidates(candidatesToExport, 40);
        processedCandidates = benchOrderedCandidates.length > 0 ? benchOrderedCandidates : candidatesToExport;
      } else {
        processedCandidates = [...candidatesToExport].sort((a, b) =>
          String(a.rollNumber || '').localeCompare(String(b.rollNumber || ''), undefined, { numeric: true })
        );
      }

      await downloadAttendanceSheetPdf(
        processedCandidates,
        { session: activeSession, isBenchWise: orderType === 'bench' },
        (current, total, statusText) => {
          setProgressStatus(statusText);
          setProgressPercent(total > 0 ? Math.round((current / total) * 100) : 0);
        }
      );

      setTimeout(() => {
        setProgressModalOpen(false);
      }, 700);
    } catch (err) {
      console.error('Attendance PDF error:', err);
      alert('Failed to generate Attendance Sheet PDF: ' + (err.message || 'Unknown error'));
      setProgressModalOpen(false);
    }
  };

  // 3. Attendance Sheet Print Window Handler (Supports Bench-wise and Roll-wise)
  const handlePrintAttendanceSheet = (candidatesToPrint, orderType = 'bench') => {
    if (!candidatesToPrint || candidatesToPrint.length === 0) {
      alert('No candidates available to print Attendance Sheet.');
      return;
    }
    let processedCandidates = candidatesToPrint;
    if (orderType === 'bench') {
      const { benchOrderedCandidates } = generateBenchSeatingPlanForCandidates(candidatesToPrint, 40);
      processedCandidates = benchOrderedCandidates.length > 0 ? benchOrderedCandidates : candidatesToPrint;
    } else {
      processedCandidates = [...candidatesToPrint].sort((a, b) =>
        String(a.rollNumber || '').localeCompare(String(b.rollNumber || ''), undefined, { numeric: true })
      );
    }
    openAttendanceSheetPrintWindow(processedCandidates, { session: activeSession, isBenchWise: orderType === 'bench' });
  };

  const openAttendanceConfigModal = (candidates, label = 'All Candidates') => {
    setAttendanceCandidatesTarget(candidates);
    setAttendanceLabel(label);
    setAttendanceOrderType('bench');
    setAttendanceModalOpen(true);
  };

  const isOnlinePaid = (app) => {
    const isPaidOrVerified = app.paymentStatus === 'paid' || app.paymentStatus === 'verified';
    const isNotOffline = app.registrationType !== 'offline' && app.paymentMode !== 'offline_cash' && app.paymentMode !== 'manual_admin';
    const hasRealAmount = (app.paymentAmount ?? 150) > 0;
    return isPaidOrVerified && isNotOffline && hasRealAmount;
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
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
  }, [applications, paymentFilter, searchTerm, searchType]);

  const {
    totalApplications,
    gkApplications,
    computerApplications,
    bothApplications,
    onlinePaidApplications,
    offlineApplications,
    totalPendingCount
  } = useMemo(() => {
    let total = applications.length;
    let gk = 0, comp = 0, both = 0, online = 0, offline = 0, pending = 0;
    for (let i = 0; i < applications.length; i++) {
      const app = applications[i];
      if (app.subject === 'GK') gk++;
      else if (app.subject === 'Computer') comp++;
      else if (app.subject === 'Both') both++;
      if (isOnlinePaid(app)) online++;
      else if (app.paymentStatus === 'paid' || app.paymentStatus === 'verified') offline++;
      if (app.paymentStatus === 'pending') pending++;
    }
    return {
      totalApplications: total,
      gkApplications: gk,
      computerApplications: comp,
      bothApplications: both,
      onlinePaidApplications: online,
      offlineApplications: offline,
      totalPendingCount: pending
    };
  }, [applications]);

  // Reset page whenever search or filter changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, searchType, paymentFilter, activeSession]);

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / rowsPerPage));
  const paginatedApplications = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredApplications.slice(start, start + rowsPerPage);
  }, [filteredApplications, page, rowsPerPage]);

  const selectedApplicationsList = useMemo(() => applications.filter(a => selectedIds.includes(a._id)), [applications, selectedIds]);
  const selectedPendingCount = useMemo(() => selectedApplicationsList.filter(a => a.paymentStatus === 'pending').length, [selectedApplicationsList]);
  const selectedPaidCount = useMemo(() => selectedApplicationsList.filter(a => a.paymentStatus === 'paid' || a.paymentStatus === 'verified').length, [selectedApplicationsList]);

  const visibleIds = useMemo(() => filteredApplications.map(a => a._id), [filteredApplications]);
  const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));
  const someSelected = visibleIds.some(id => selectedIds.includes(id)) && !allSelected;

  const handleOfflineCandidateSuccess = (newCandidate) => {
    setApplications(prev => [newCandidate, ...prev]);
    setCreatedOfflineCandidate(newCandidate);
    setOfflineModalOpen(false);
    setOfflineSuccessModalOpen(true);
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
                      <Box display="flex" flexDirection="column" gap={0.8}>
                        <Button variant="contained" size="large" disabled={updating} onClick={() => updatePaymentStatus(selectedApplication._id, 'verified')} sx={{ background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', fontWeight: 700, textTransform: 'none', borderRadius: 2 }}>
                          Mark as Verified (Offline/Desk - 0 to Wallet)
                        </Button>
                        <Typography variant="caption" sx={{ color: '#059669', textAlign: 'center', fontWeight: 600 }}>
                          ✓ Marked as Paid with Rs. 0 added to online wallet
                        </Typography>
                      </Box>
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
              onClick={() => setOfflineModalOpen(true)}
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
              
              {/* 1. Bulk Admit Cards ZIP Button */}
              <Tooltip title="Download all candidates' admit cards in a ZIP file (Single Click)">
                <Button 
                  variant="contained" 
                  onClick={() => handleDownloadBulkZip(filteredApplications, 'All Candidates')} 
                  startIcon={<FaFileAlt />} 
                  sx={{ 
                    background: 'linear-gradient(135deg, #4F46E5, #3730A3)', 
                    color: '#fff', 
                    textTransform: 'none', 
                    fontWeight: 800, 
                    borderRadius: 2,
                    px: 2,
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                    '&:hover': { background: '#4338CA' }
                  }}
                >
                  📦 Download Admit Cards (ZIP)
                </Button>
              </Tooltip>

              {/* 2. Attendance Sheet (Bench-Wise or Roll-Wise) */}
              <Tooltip title="Generate Attendance Sheet with Photos, Signatures & P/A Boxes (Choose Seat/Bench-Wise or Roll-Wise)">
                <Button 
                  variant="contained" 
                  onClick={() => openAttendanceConfigModal(filteredApplications, 'All Applications')} 
                  startIcon={<FaDownload />} 
                  sx={{ 
                    background: 'linear-gradient(135deg, #DC2626, #B91C1C)', 
                    color: '#fff', 
                    textTransform: 'none', 
                    fontWeight: 800, 
                    borderRadius: 2,
                    px: 2,
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
                    '&:hover': { background: '#991B1B' }
                  }}
                >
                  📋 Attendance Sheet (Bench/Roll)
                </Button>
              </Tooltip>

              {/* 3. Direct Print Attendance Sheet */}
              <Tooltip title="Open printable attendance sheet in new tab (Bench-Wise or Roll-Wise)">
                <Button 
                  variant="contained" 
                  onClick={() => openAttendanceConfigModal(filteredApplications, 'All Applications')} 
                  startIcon={<FaPrint />} 
                  sx={{ 
                    background: 'linear-gradient(135deg, #0284C7, #0369A1)', 
                    color: '#fff', 
                    textTransform: 'none', 
                    fontWeight: 700, 
                    borderRadius: 2,
                    '&:hover': { background: '#075985' }
                  }}
                >
                  Print Attendance Sheet
                </Button>
              </Tooltip>

              <Button variant="contained" onClick={exportToCSV} startIcon={<FaDownload />} sx={{ background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: 2 }}>CSV</Button>
              
              {totalPendingCount > 0 && (
                <Button 
                  variant="outlined" 
                  onClick={handleSelectAllPending} 
                  sx={{ 
                    color: '#D97706', 
                    borderColor: '#FDE68A', 
                    backgroundColor: '#FFFBEB', 
                    textTransform: 'none', 
                    fontWeight: 700, 
                    borderRadius: 2,
                    '&:hover': { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }
                  }}
                >
                  ⚡ Select All Pending ({totalPendingCount})
                </Button>
              )}
            </Box>
          </Paper>

          {/* Bulk Selection Action Bar */}
          {selectedIds.length > 0 && (
            <Paper elevation={3} sx={{
              p: 2, mb: 3, borderRadius: 2.5,
              background: 'linear-gradient(135deg, #1E293B, #0F172A)',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 2,
              border: '1px solid #334155',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
            }}>
              <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                <Box sx={{ px: 1.5, py: 0.5, borderRadius: 1.5, background: '#2563EB', color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>
                  {selectedIds.length}
                </Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#F8FAFC' }}>
                  Candidate{selectedIds.length > 1 ? 's' : ''} Selected
                </Typography>
                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                  ({selectedPendingCount} Pending, {selectedPaidCount} Paid)
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                {/* Download Selected Admit Cards ZIP */}
                <Button
                  variant="contained"
                  onClick={() => {
                    const selectedApps = applications.filter(a => selectedIds.includes(a._id));
                    handleDownloadBulkZip(selectedApps, `${selectedApps.length} Selected Candidates`);
                  }}
                  startIcon={<FaFileAlt />}
                  sx={{
                    background: 'linear-gradient(135deg, #4F46E5, #3730A3)',
                    fontWeight: 700, textTransform: 'none', borderRadius: 2, px: 2,
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                    '&:hover': { background: '#4338CA' }
                  }}
                >
                  📦 Download ZIP ({selectedIds.length})
                </Button>

                {/* Selected Attendance Sheet (Bench/Roll) */}
                <Button
                  variant="contained"
                  onClick={() => {
                    const selectedApps = applications.filter(a => selectedIds.includes(a._id));
                    openAttendanceConfigModal(selectedApps, `${selectedApps.length} Selected Candidates`);
                  }}
                  startIcon={<FaDownload />}
                  sx={{
                    background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                    fontWeight: 700, textTransform: 'none', borderRadius: 2, px: 2,
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
                    '&:hover': { background: '#991B1B' }
                  }}
                >
                  📋 Attendance Sheet ({selectedIds.length})
                </Button>

                <Button
                  variant="contained"
                  disabled={markingBulkPaid || deletingBulk}
                  onClick={handleBulkMarkPaid}
                  startIcon={markingBulkPaid ? <CircularProgress size={16} color="inherit" /> : <FaCheckCircle />}
                  sx={{
                    background: 'linear-gradient(135deg, #059669, #047857)',
                    fontWeight: 700, textTransform: 'none', borderRadius: 2, px: 2.5,
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
                    '&:hover': { background: '#047857' }
                  }}
                >
                  {markingBulkPaid ? 'Marking Paid...' : `Mark Paid (Offline - ₹0 Wallet)`}
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  disabled={markingBulkPaid || deletingBulk}
                  startIcon={<FaTrash />}
                  onClick={() => setBulkDeleteDialogOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                    fontWeight: 700, textTransform: 'none', borderRadius: 2, px: 2.5,
                    '&:hover': { background: '#991B1B' }
                  }}
                >
                  Delete ({selectedIds.length})
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleClearSelection}
                  sx={{
                    color: '#94A3B8', borderColor: '#475569', textTransform: 'none', fontWeight: 600, borderRadius: 2,
                    '&:hover': { borderColor: '#CBD5E1', color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.05)' }
                  }}
                >
                  Clear Selection
                </Button>
              </Box>
            </Paper>
          )}

          <Paper sx={{ borderRadius: 3, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ pl: 2, py: 2 }}>
                      <Checkbox
                        color="primary"
                        indeterminate={someSelected}
                        checked={allSelected}
                        onChange={handleSelectAll}
                        inputProps={{ 'aria-label': 'select all candidates' }}
                        sx={{ color: '#94A3B8', '&.Mui-checked': { color: '#2563EB' } }}
                      />
                    </TableCell>
                    {['Roll Number', 'Name', "Father's Name", 'Payment', 'Photo', 'Signature', 'Actions'].map((header) => (
                      <TableCell key={header} sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedApplications.map((application) => (
                    <TableRow 
                      key={application._id || application.rollNumber} 
                      hover 
                      selected={selectedIds.includes(application._id)}
                      sx={{ 
                        '&:hover': { backgroundColor: '#F8FAFC !important' },
                        '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: 'rgba(37, 99, 235, 0.06) !important' }
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ pl: 2, borderBottom: '1px solid #F1F5F9' }}>
                        <Checkbox
                          color="primary"
                          checked={selectedIds.includes(application._id)}
                          onChange={() => handleToggleSelect(application._id)}
                          inputProps={{ 'aria-label': `select candidate ${application.name}` }}
                          sx={{ color: '#CBD5E1', '&.Mui-checked': { color: '#2563EB' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#2563EB', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>{application.rollNumber}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                          <Typography sx={{ color: '#0F172A', fontWeight: 700 }}>{application.name}</Typography>
                          {(application.isOverAge || isCandidateOverAge(application.dateOfBirth, application.createdAt)) && (
                            <Tooltip title="Candidate age exceeds 20 years. E-admit card is withheld.">
                              <Chip
                                label="⚠️ >20 YRS"
                                size="small"
                                sx={{
                                  backgroundColor: '#FEF2F2',
                                  color: '#DC2626',
                                  border: '1px solid #FECACA',
                                  fontWeight: 800,
                                  fontSize: '0.62rem',
                                  height: 18
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.78rem' }}>
                          📱 {application.phone || 'No phone'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#475569', borderBottom: '1px solid #F1F5F9' }}>{application.fatherName || 'Not provided'}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        {application.registrationType === 'offline' || application.paymentMode === 'offline_cash' || application.paymentMode === 'manual_admin' ? (
                          <Chip
                            label={application.paymentMode === 'manual_admin' ? "MANUAL (₹0)" : "OFFLINE (PAID)"}
                            size="small"
                            sx={{
                              background: '#F0FDF4',
                              color: '#15803D',
                              border: '1px solid #86EFAC',
                              fontWeight: 800,
                              fontSize: '0.68rem',
                            }}
                          />
                        ) : isOnlinePaid(application) ? (
                          <Chip
                            label="ONLINE PAID (₹150)"
                            size="small"
                            sx={{
                              background: '#EFF6FF',
                              color: '#1D4ED8',
                              border: '1px solid #BFDBFE',
                              fontWeight: 700,
                              fontSize: '0.68rem',
                            }}
                          />
                        ) : (
                          <Chip
                            label={application.paymentStatus === 'failed' ? 'FAILED' : 'PENDING'}
                            size="small"
                            sx={{
                              background: application.paymentStatus === 'failed' ? '#FEF2F2' : '#FFFBEB',
                              color: application.paymentStatus === 'failed' ? '#DC2626' : '#D97706',
                              border: '1px solid',
                              borderColor: application.paymentStatus === 'failed' ? '#FECACA' : '#FDE68A',
                              fontWeight: 700,
                              fontSize: '0.68rem',
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

            {/* Pagination Controls Footer */}
            {filteredApplications.length > 0 && (
              <Box sx={{ p: 2, px: 3, borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
                <Typography variant="body2" color="#64748B" fontWeight={600}>
                  Showing {Math.min((page - 1) * rowsPerPage + 1, filteredApplications.length)} - {Math.min(page * rowsPerPage, filteredApplications.length)} of {filteredApplications.length} candidates
                </Typography>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={(e, val) => setPage(val)}
                  color="primary"
                  shape="rounded"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: '8px',
                      fontWeight: 600,
                      '&.Mui-selected': {
                        backgroundColor: '#2563EB',
                        color: '#fff'
                      }
                    }
                  }}
                />
              </Box>
            )}
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

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => !deletingBulk && setBulkDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1, maxWidth: 500 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#DC2626', fontWeight: 800 }}>
          <FaTrash size={22} /> Confirm Bulk Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: '#334155', mb: 2 }}>
            Are you sure you want to permanently delete <strong>{selectedIds.length}</strong> selected application{selectedIds.length > 1 ? 's' : ''}?
          </Typography>
          <Alert severity={selectedPaidCount > 0 ? "warning" : "info"} sx={{ mb: 2, borderRadius: 2 }}>
            {selectedPaidCount > 0 ? (
              <>
                <strong>Caution:</strong> {selectedPaidCount} of the selected application{selectedPaidCount > 1 ? 's are' : ' is'} marked as <strong>PAID/VERIFIED</strong>.
                {selectedPendingCount > 0 && ` (${selectedPendingCount} are PENDING).`}
              </>
            ) : (
              <>All <strong>{selectedIds.length}</strong> selected applications are <strong>PENDING</strong> (unpaid/fake).</>
            )}
          </Alert>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            This action will permanently delete candidate records and roll numbers from the database.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            disabled={deletingBulk}
            onClick={() => setBulkDeleteDialogOpen(false)}
            sx={{ color: '#64748B', fontWeight: 600, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={deletingBulk}
            onClick={handleBulkDelete}
            sx={{
              background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
              fontWeight: 700, textTransform: 'none', borderRadius: 2, px: 3,
              '&:hover': { background: '#991B1B' }
            }}
          >
            {deletingBulk ? <CircularProgress size={20} color="inherit" /> : `Yes, Delete (${selectedIds.length})`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Isolated Offline Candidate Registration Modal (Instant, 0-Lag Form Filling) */}
      <OfflineCandidateModal
        open={offlineModalOpen}
        onClose={() => setOfflineModalOpen(false)}
        activeSession={activeSession}
        availableSessions={availableSessions}
        onSuccess={handleOfflineCandidateSuccess}
      />

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
              onClick={() => { setOfflineSuccessModalOpen(false); setOfflineModalOpen(true); }}
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

      {/* Attendance Sheet Configuration Modal (Bench-Wise vs Roll-Wise) */}
      <Dialog 
        open={attendanceModalOpen} 
        onClose={() => setAttendanceModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '20px', 
            p: 1, 
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 25px 50px -12px rgba(15,23,42,0.25)'
          } 
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#0F172A', pb: 1, fontSize: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'linear-gradient(135deg, #DC2626, #B91C1C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem' }}>
              📋
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800} color="#0F172A" lineHeight={1.2}>
                Exam Attendance Sheet
              </Typography>
              <Typography variant="caption" color="#64748B">
                {attendanceLabel} • {attendanceCandidatesTarget.length} Candidates
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setAttendanceModalOpen(false)} sx={{ color: '#94A3B8' }}>
            <FaTimes size={16} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 2 }}>
          <Typography variant="subtitle2" fontWeight={700} color="#334155" mb={1.5}>
            Select Attendance Sequence / Ordering:
          </Typography>

          <RadioGroup 
            value={attendanceOrderType} 
            onChange={(e) => setAttendanceOrderType(e.target.value)}
          >
            {/* Option 1: Bench-wise (Recommended) */}
            <Paper 
              elevation={0}
              onClick={() => setAttendanceOrderType('bench')}
              sx={{ 
                p: 2, 
                mb: 2, 
                borderRadius: 3, 
                border: '2px solid', 
                borderColor: attendanceOrderType === 'bench' ? '#2563EB' : '#E2E8F0',
                backgroundColor: attendanceOrderType === 'bench' ? '#EFF6FF' : '#F8FAFC',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#3B82F6' }
              }}
            >
              <FormControlLabel 
                value="bench" 
                control={<Radio color="primary" />} 
                label={
                  <Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle1" fontWeight={800} color={attendanceOrderType === 'bench' ? '#1E3A8A' : '#0F172A'}>
                        🪑 Seat / Bench-Wise Order (Room & Desk Sequence)
                      </Typography>
                      <Chip label="RECOMMENDED" size="small" sx={{ background: '#2563EB', color: '#fff', fontWeight: 800, fontSize: '0.62rem', height: 20 }} />
                    </Box>
                    <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
                      Arranged room-by-room in desk sequence: <strong>Bench 1 (Left), Bench 1 (Right), Bench 2 (Left)...</strong> according to the anti-cheating seating plan. Invigilators can mark signatures bench-by-bench effortlessly without searching.
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, alignItems: 'flex-start' }}
              />
            </Paper>

            {/* Option 2: Roll number-wise */}
            <Paper 
              elevation={0}
              onClick={() => setAttendanceOrderType('roll')}
              sx={{ 
                p: 2, 
                borderRadius: 3, 
                border: '2px solid', 
                borderColor: attendanceOrderType === 'roll' ? '#2563EB' : '#E2E8F0',
                backgroundColor: attendanceOrderType === 'roll' ? '#EFF6FF' : '#F8FAFC',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: '#3B82F6' }
              }}
            >
              <FormControlLabel 
                value="roll" 
                control={<Radio color="primary" />} 
                label={
                  <Box>
                    <Typography variant="subtitle1" fontWeight={800} color={attendanceOrderType === 'roll' ? '#1E3A8A' : '#0F172A'}>
                      🔢 Roll Number-Wise Order (Sequential)
                    </Typography>
                    <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
                      Arranged strictly by numerical Roll Number order (NIICT1313, NIICT1314, NIICT1316...). Standard registry format.
                    </Typography>
                  </Box>
                }
                sx={{ m: 0, alignItems: 'flex-start' }}
              />
            </Paper>
          </RadioGroup>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1, gap: 1.5 }}>
          <Button 
            variant="outlined" 
            onClick={() => setAttendanceModalOpen(false)}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 2.5, color: '#64748B', borderColor: '#CBD5E1' }}
          >
            Cancel
          </Button>

          <Button 
            variant="contained" 
            startIcon={<FaPrint />}
            onClick={() => {
              const currentTarget = attendanceCandidatesTarget;
              const currentOrder = attendanceOrderType;
              setAttendanceModalOpen(false);
              handlePrintAttendanceSheet(currentTarget, currentOrder);
            }}
            sx={{ 
              background: 'linear-gradient(135deg, #0284C7, #0369A1)', 
              color: '#fff', 
              fontWeight: 700, 
              textTransform: 'none', 
              borderRadius: 2, 
              px: 2.5,
              '&:hover': { background: '#075985' }
            }}
          >
            🖨️ Print in New Tab
          </Button>

          <Button 
            variant="contained" 
            startIcon={<FaDownload />}
            onClick={() => {
              const currentTarget = attendanceCandidatesTarget;
              const currentLabel = attendanceLabel;
              const currentOrder = attendanceOrderType;
              setAttendanceModalOpen(false);
              handleDownloadAttendancePdf(currentTarget, currentLabel, currentOrder);
            }}
            sx={{ 
              background: 'linear-gradient(135deg, #DC2626, #B91C1C)', 
              color: '#fff', 
              fontWeight: 800, 
              textTransform: 'none', 
              borderRadius: 2, 
              px: 3,
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
              '&:hover': { background: '#991B1B' }
            }}
          >
            📥 Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Operation Progress Modal */}
      <Dialog 
        open={progressModalOpen} 
        disableEscapeKeyDown
        PaperProps={{ 
          sx: { 
            borderRadius: '18px', 
            p: 2, 
            background: 'linear-gradient(135deg, #0F172A, #1E293B)', 
            color: '#FFFFFF',
            border: '1px solid #334155',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          } 
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#F8FAFC', pb: 1, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CircularProgress size={24} sx={{ color: '#60A5FA' }} />
          {progressTitle || 'Processing...'}
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 2, fontWeight: 500 }}>
            {progressStatus || 'Please wait while documents are generated...'}
          </Typography>
          
          <Box sx={{ width: '100%', background: '#334155', height: 8, borderRadius: 4, overflow: 'hidden', mb: 1 }}>
            <Box 
              sx={{ 
                width: `${Math.min(100, Math.max(0, progressPercent))}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #3B82F6, #10B981)',
                transition: 'width 0.3s ease'
              }} 
            />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="caption" sx={{ color: '#64748B' }}>Single Click Packaging</Typography>
            <Typography variant="caption" sx={{ color: '#60A5FA', fontWeight: 800 }}>{progressPercent}% Complete</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CompetitionManagement;
