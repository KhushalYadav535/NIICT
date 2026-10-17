import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Typography, Box, Grid, Paper, Container,
  TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem,
  Chip, Alert, CircularProgress, Divider, Tooltip
} from '@mui/material';
import {
  FaEdit, FaTimes, FaCamera, FaCloudUploadAlt, FaTrash, FaCheck, FaInfoCircle,
  FaRegLightbulb, FaPaste, FaUser, FaCalendarAlt, FaIdCard, FaPhoneAlt,
  FaGraduationCap, FaBook, FaTrophy, FaLaptopCode, FaMapMarkerAlt, FaCheckCircle,
  FaSave, FaExclamationTriangle, FaClock, FaUniversity, FaMoneyBillWave
} from 'react-icons/fa';

const calculateAge = (dob) => {
  if (!dob) return null;
  let d;
  if (typeof dob === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dob)) {
    const [y, m, day] = dob.slice(0, 10).split('-').map(Number);
    d = new Date(Date.UTC(y, m - 1, day));
  } else {
    d = new Date(dob);
  }
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
};

const formatDobToInput = (dateVal) => {
  if (!dateVal) return '';
  if (typeof dateVal === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateVal)) {
    return dateVal.slice(0, 10);
  }
  const dt = new Date(dateVal);
  if (isNaN(dt.getTime())) return '';
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const EditCandidateModal = ({
  open,
  onClose,
  candidate,
  availableSessions = ['2026-2027', '2025-2026'],
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    phone: '',
    parentPhone: '',
    school: '',
    address: '',
    subject: 'Both',
    aadhaar: '',
    dateOfBirth: '',
    classPassed: '',
    image: null,
    session: '2026-2027',
    rollNumber: '',
    paymentStatus: 'paid',
    registrationType: 'offline',
    paymentMode: 'offline_cash',
    paymentAmount: 150,
    examDate: '18 October 2026',
    examTime: '10:00 AM – 11:30 AM (90 Min)',
    reportingTime: '8:00 AM',
    examCenter: 'S K Modern Intermediate College Semari Janghai Jaunpur'
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Populate form with candidate data whenever candidate or open changes
  useEffect(() => {
    if (open && candidate) {
      setFormData({
        name: candidate.name || '',
        fatherName: candidate.fatherName || '',
        motherName: candidate.motherName || '',
        phone: candidate.phone || '',
        parentPhone: candidate.parentPhone || '',
        school: candidate.school || '',
        address: candidate.address || '',
        subject: candidate.subject || 'Both',
        aadhaar: candidate.aadhaar || '',
        dateOfBirth: formatDobToInput(candidate.dateOfBirth),
        classPassed: candidate.classPassed || candidate.class || '',
        image: candidate.image || null,
        session: candidate.session || '2026-2027',
        rollNumber: candidate.rollNumber || '',
        paymentStatus: candidate.paymentStatus || 'paid',
        registrationType: candidate.registrationType || 'online',
        paymentMode: candidate.paymentMode || 'online',
        paymentAmount: candidate.paymentAmount !== undefined ? candidate.paymentAmount : 150,
        examDate: candidate.examDate || '18 October 2026',
        examTime: candidate.examTime || '10:00 AM – 11:30 AM (90 Min)',
        reportingTime: candidate.reportingTime || '8:00 AM',
        examCenter: candidate.examCenter || 'S K Modern Intermediate College Semari Janghai Jaunpur'
      });
      setImagePreview(candidate.image || null);
      setError('');
      setIsDraggingPhoto(false);
      setWebcamOpen(false);
      setShowAdvancedSettings(false);
    }
  }, [open, candidate]);

  const uploadImageBlob = useCallback(async (blob, customFilename = null) => {
    if (!blob) return;
    if (blob.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    setUploadingImage(true);
    setError('');
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const mf = new FormData();
      const filename = customFilename || (blob.name ? blob.name : `candidate_${Date.now()}.jpg`);
      mf.append('image', blob, filename);
      const mr = await fetch(`${API_BASE_URL}/api/upload-image-mongo`, { method: 'POST', body: mf });
      if (mr.ok) {
        const mj = await mr.json();
        if (mj.secure_url) {
          setFormData(p => ({ ...p, image: mj.secure_url }));
          setImagePreview(mj.secure_url);
          return;
        }
      }
      setError('Photo upload failed. Please try again.');
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Photo upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    uploadImageBlob(file);
  };

  const handleRemoveImage = () => {
    setFormData(p => ({ ...p, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Webcam camera handlers
  const startWebcam = async () => {
    try {
      setError('');
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
      setError('Unable to access camera. Please check camera permissions or browse photo file.');
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
      setError('Failed to capture photo from camera.');
    }
  };

  // Clipboard paste listener (Ctrl+V anywhere in modal)
  useEffect(() => {
    if (!open) return;
    const handlePaste = (e) => {
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
  }, [open, uploadImageBlob]);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    if (!formData.name || !formData.fatherName || !formData.motherName ||
        !formData.phone || !formData.school || !formData.address ||
        !formData.dateOfBirth || !formData.classPassed) {
      setError('Please fill all required candidate fields marked with *');
      return;
    }

    if (formData.phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!candidate || !candidate._id) {
      setError('Candidate ID missing for update.');
      return;
    }

    setSubmitting(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/competition-applications/${candidate._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update competition application');
      }

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error('Update competition application error:', err);
      setError(err.message || 'Failed to update application');
    } finally {
      setSubmitting(false);
    }
  };

  const calculatedAge = formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : null;
  const isOverAge = calculatedAge !== null && calculatedAge > 20;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => !submitting && onClose()}
      PaperProps={{
        sx: {
          background: '#F8FAFC',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {/* Full-Width Header with Amber / Deep Slate Gradient */}
      <DialogTitle sx={{
        p: 0,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 40%, #B45309 100%)',
        color: '#FFFFFF',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        zIndex: 10
      }}>
        <Box sx={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <Box sx={{ px: { xs: 2, sm: 4 }, py: 2.2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{
              width: 48, height: 48, borderRadius: '14px',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(245,158,11,0.35)'
            }}>
              <FaEdit size={22} color="#FFFFFF" />
            </Box>
            <Box>
              <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '0.5px', fontFamily: '"Saira Condensed", sans-serif', color: '#FFFFFF' }}>
                  Edit GK Exam Application Form
                </Typography>
                {formData.rollNumber && (
                  <Chip
                    label={`ROLL: ${formData.rollNumber}`}
                    size="small"
                    sx={{ background: '#F59E0B', color: '#0F172A', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.5px' }}
                  />
                )}
                <Chip
                  label="ADMIN EDIT MODE"
                  size="small"
                  sx={{ background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', fontWeight: 700, fontSize: '0.7rem' }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#E2E8F0', mt: 0.2, fontSize: '0.82rem' }}>
                Fix candidate spelling, DOB, contact, school, exam subject, center or photo mistakes
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => !submitting && onClose()}
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
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '14px', border: '1px solid #FECACA' }}>
              {error}
            </Alert>
          )}

          {isOverAge && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: '14px', border: '1px solid #FDE68A' }}>
              <strong>Age Notice:</strong> Candidate age is calculated as {calculatedAge} years (&gt;20 years cutoff).
              An advisory notice will appear on the admit card to contact the Janghai office.
            </Alert>
          )}

          <Grid container spacing={3.5}>
            {/* Left Column: Candidate Photo Studio & Summary */}
            <Grid item xs={12} md={4} lg={3.5}>
              {/* Photo Studio Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '22px',
                  border: isDraggingPhoto ? '2px dashed #D97706' : '1px solid #E2E8F0',
                  background: isDraggingPhoto ? '#FFFBEB' : '#FFFFFF',
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
                    <FaCamera color="#D97706" /> Candidate Photo
                  </Typography>
                  {imagePreview ? (
                    <Chip
                      icon={<FaCheck size={10} />}
                      label="Photo Attached"
                      size="small"
                      sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.68rem', height: 22 }}
                    />
                  ) : (
                    <Chip
                      icon={<FaInfoCircle size={10} />}
                      label="No Photo"
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
                  border: imagePreview ? '3px solid #D97706' : '2px dashed #CBD5E1',
                  background: '#F8FAFC',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: imagePreview ? '0 10px 25px -5px rgba(217,119,6,0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {uploadingImage ? (
                    <Box textAlign="center" p={2}>
                      <CircularProgress size={32} sx={{ color: '#D97706', mb: 1 }} />
                      <Typography variant="caption" sx={{ display: 'block', color: '#64748B', fontWeight: 700 }}>
                        Uploading...
                      </Typography>
                    </Box>
                  ) : imagePreview ? (
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Candidate Preview"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box textAlign="center" p={1.5}>
                      <FaUser size={46} color="#CBD5E1" />
                      <Typography variant="caption" sx={{ display: 'block', color: '#64748B', fontWeight: 800, mt: 0.8, fontSize: '0.78rem' }}>
                        No Photo
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: '#94A3B8', fontSize: '0.68rem', mt: 0.2 }}>
                        Upload or leave blank
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />

                {/* Photo Action Buttons */}
                <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
                  <Button
                    variant="contained"
                    size="small"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    startIcon={<FaCloudUploadAlt />}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      background: 'linear-gradient(135deg, #D97706, #B45309)',
                      boxShadow: '0 4px 12px rgba(217,119,6,0.25)',
                      '&:hover': { background: 'linear-gradient(135deg, #B45309, #92400E)' }
                    }}
                  >
                    {imagePreview ? 'Replace Photo' : 'Upload Photo'}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    disabled={uploadingImage}
                    onClick={startWebcam}
                    startIcon={<FaCamera />}
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      borderColor: '#D97706',
                      color: '#D97706',
                      '&:hover': { borderColor: '#B45309', backgroundColor: '#FFFBEB' }
                    }}
                  >
                    Camera
                  </Button>

                  {imagePreview && (
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={handleRemoveImage}
                      startIcon={<FaTrash />}
                      sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem' }}
                    >
                      Remove
                    </Button>
                  )}
                </Box>

                {/* Photo Tip */}
                <Paper elevation={0} sx={{ mt: 2.2, p: 2, borderRadius: '14px', background: '#FFFBEB', border: '1px solid #FDE68A', textAlign: 'left' }}>
                  <Box display="flex" alignItems="center" gap={0.8} mb={0.5}>
                    <FaRegLightbulb color="#D97706" size={14} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#92400E', fontSize: '0.75rem' }}>
                      Quick Photo Update
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#78350F', display: 'block', lineHeight: 1.4, fontSize: '0.72rem' }}>
                    You can drag &amp; drop an image here or press Ctrl+V to paste any copied candidate passport photo directly!
                  </Typography>
                </Paper>
              </Paper>

              {/* Webcam Live Capture Dialog */}
              {webcamOpen && (
                <Paper elevation={0} sx={{ p: 2, borderRadius: '18px', border: '2px solid #D97706', mb: 3, textAlign: 'center', background: '#1E293B', color: '#fff' }}>
                  <Typography variant="caption" sx={{ color: '#FDE68A', fontWeight: 800, display: 'block', mb: 1 }}>
                    LIVE WEBCAM VIEW
                  </Typography>
                  <Box sx={{ width: '100%', height: 200, borderRadius: 2, overflow: 'hidden', bgcolor: '#000', mb: 1.5 }}>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Box display="flex" gap={1} justifyContent="center">
                    <Button variant="contained" size="small" onClick={captureWebcamPhoto} sx={{ background: '#059669', color: '#fff', fontWeight: 700, borderRadius: 1.5, textTransform: 'none' }}>
                      Capture Photo
                    </Button>
                    <Button variant="outlined" size="small" onClick={stopWebcam} sx={{ borderColor: '#64748B', color: '#CBD5E1', borderRadius: 1.5, textTransform: 'none' }}>
                      Cancel
                    </Button>
                  </Box>
                </Paper>
              )}

              {/* Application Snapshot Card */}
              <Paper elevation={0} sx={{ p: 2.8, borderRadius: '22px', border: '1px solid #E2E8F0', background: '#FFFFFF', boxShadow: '0 4px 20px -4px rgba(15,23,42,0.06)' }}>
                <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 1.5, letterSpacing: '0.6px' }}>
                  Application Status
                </Typography>
                <Box display="flex" flexDirection="column" gap={1.2} sx={{ fontSize: '0.8rem', color: '#334155' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <span>Roll Number:</span>
                    <strong style={{ color: '#2563EB', fontFamily: 'monospace', fontSize: '0.9rem' }}>{formData.rollNumber || 'N/A'}</strong>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <span>Session:</span>
                    <Chip label={formData.session} size="small" sx={{ height: 20, fontSize: '0.72rem', fontWeight: 700, bgcolor: '#EFF6FF', color: '#2563EB' }} />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <span>Payment Status:</span>
                    <Chip
                      label={formData.paymentStatus.toUpperCase()}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        bgcolor: formData.paymentStatus === 'paid' || formData.paymentStatus === 'verified' ? '#DCFCE7' : '#FEF3C7',
                        color: formData.paymentStatus === 'paid' || formData.paymentStatus === 'verified' ? '#166534' : '#92400E'
                      }}
                    />
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <span>Registration:</span>
                    <strong style={{ textTransform: 'capitalize' }}>{formData.registrationType}</strong>
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
                      1. Candidate Personal Information (व्यक्तिगत विवरण)
                    </Typography>
                    <Typography variant="caption" color="#64748B">
                      Correct name spelling, parent names, date of birth, or contact phone
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2.2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Candidate Full Name *"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value.toUpperCase() }))}
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
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(p => ({ ...p, dateOfBirth: e.target.value }))}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FaCalendarAlt color="#2563EB" size={14} />
                          </InputAdornment>
                        )
                      }}
                      helperText={calculatedAge !== null ? `🎂 Calculated Age: ${calculatedAge} Years ${isOverAge ? '(Contact Janghai Office)' : '(Eligible ✓)'}` : 'Select Candidate DOB'}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Father's Full Name *"
                      required
                      value={formData.fatherName}
                      onChange={(e) => setFormData(p => ({ ...p, fatherName: e.target.value.toUpperCase() }))}
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
                      value={formData.motherName}
                      onChange={(e) => setFormData(p => ({ ...p, motherName: e.target.value.toUpperCase() }))}
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
                      label="Candidate Mobile Number *"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                      placeholder="10-digit Mobile Number"
                      inputProps={{ maxLength: 10 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FaPhoneAlt color="#2563EB" size={14} />
                          </InputAdornment>
                        )
                      }}
                      helperText={formData.phone.length === 10 ? '✓ 10-digit Mobile Complete' : `${formData.phone.length}/10 digits`}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Parent / Alternate Phone Number"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData(p => ({ ...p, parentPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                      placeholder="10-digit Guardian Number"
                      inputProps={{ maxLength: 10 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FaPhoneAlt color="#64748B" size={14} />
                          </InputAdornment>
                        )
                      }}
                      helperText="Optional guardian contact"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Aadhaar Card Number (12 digits)"
                      value={formData.aadhaar}
                      onChange={(e) => setFormData(p => ({ ...p, aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                      placeholder="12-digit UID"
                      inputProps={{ maxLength: 12 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FaIdCard color="#2563EB" size={14} />
                          </InputAdornment>
                        )
                      }}
                      helperText={formData.aadhaar ? `${formData.aadhaar.length}/12 digits` : 'Optional'}
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
                      2. Academic &amp; Address Details (शैक्षणिक एवं पता विवरण)
                    </Typography>
                    <Typography variant="caption" color="#64748B">
                      School/college name, standard, competition exam subject and village/city address
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2.2}>
                  <Grid item xs={12} sm={7}>
                    <TextField
                      fullWidth
                      label="School / College / Institution *"
                      required
                      value={formData.school}
                      onChange={(e) => setFormData(p => ({ ...p, school: e.target.value.toUpperCase() }))}
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
                      value={formData.classPassed}
                      onChange={(e) => setFormData(p => ({ ...p, classPassed: e.target.value }))}
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
                          onClick={() => setFormData(p => ({ ...p, classPassed: cls }))}
                          sx={{
                            borderRadius: '8px',
                            fontWeight: formData.classPassed === cls ? 800 : 600,
                            backgroundColor: formData.classPassed === cls ? '#059669' : '#F1F5F9',
                            color: formData.classPassed === cls ? '#FFFFFF' : '#475569',
                            '&:hover': { backgroundColor: '#059669', color: '#FFFFFF' }
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  {/* 3-Card Subject Selector */}
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 1 }}>
                      Examination Subject Paper *
                    </Typography>
                    <Grid container spacing={1.5}>
                      {[
                        { val: 'Both', label: 'Both (GK + Computer)', sub: 'Default • Combined Comprehensive Paper', icon: <FaTrophy size={18} /> },
                        { val: 'GK', label: 'GK (General Knowledge)', sub: 'General Knowledge Exam', icon: <FaBook size={18} /> },
                        { val: 'Computer', label: 'Computer Literacy', sub: 'Computer Knowledge Exam', icon: <FaLaptopCode size={18} /> }
                      ].map((item) => {
                        const isSelected = formData.subject === item.val;
                        return (
                          <Grid item xs={12} sm={4} key={item.val}>
                            <Paper
                              elevation={0}
                              onClick={() => setFormData(p => ({ ...p, subject: item.val }))}
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

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Candidate Full Residential Address *"
                      required
                      multiline
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData(p => ({ ...p, address: e.target.value.toUpperCase() }))}
                      placeholder="Village / Post, Tehsil, District, State, PIN Code"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                            <FaMapMarkerAlt color="#059669" size={14} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Section 3: Official Examination Center & Admin Controls */}
              <Paper elevation={0} sx={{ p: 3.2, borderRadius: '22px', border: '1px solid #E2E8F0', background: '#FFFFFF', boxShadow: '0 4px 20px -4px rgba(15,23,42,0.06)' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={1.2}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                      <FaUniversity size={16} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800} color="#0F172A" sx={{ lineHeight: 1.2 }}>
                        3. Exam Schedule, Center &amp; Roll Number (परीक्षा एवं प्रशासनिक विवरण)
                      </Typography>
                      <Typography variant="caption" color="#64748B">
                        Manage Roll number, session, payment status, and exam timings
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    size="small"
                    variant="text"
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    sx={{ color: '#2563EB', fontWeight: 700, textTransform: 'none', fontSize: '0.8rem' }}
                  >
                    {showAdvancedSettings ? 'Hide Details ▲' : 'Show Advanced Settings ▼'}
                  </Button>
                </Box>

                <Grid container spacing={2.2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Roll Number *"
                      required
                      value={formData.rollNumber}
                      onChange={(e) => setFormData(p => ({ ...p, rollNumber: e.target.value.toUpperCase().replace(/\s+/g, '') }))}
                      placeholder="e.g. NIICT1001"
                      helperText="Caution: Changing roll number must remain unique across candidates."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ fontWeight: 800, color: '#2563EB', fontSize: '0.85rem' }}>#</Typography>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Session / Exam Year</InputLabel>
                      <Select
                        value={formData.session}
                        label="Session / Exam Year"
                        onChange={(e) => setFormData(p => ({ ...p, session: e.target.value }))}
                      >
                        {Array.from(new Set([...availableSessions, formData.session, '2026-2027', '2025-2026'])).filter(Boolean).map(s => (
                          <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Payment Status</InputLabel>
                      <Select
                        value={formData.paymentStatus}
                        label="Payment Status"
                        onChange={(e) => setFormData(p => ({ ...p, paymentStatus: e.target.value }))}
                      >
                        <MenuItem value="paid">PAID (Full)</MenuItem>
                        <MenuItem value="verified">VERIFIED (Desk / Offline)</MenuItem>
                        <MenuItem value="pending">PENDING (Unpaid)</MenuItem>
                        <MenuItem value="failed">FAILED</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Registration Type</InputLabel>
                      <Select
                        value={formData.registrationType}
                        label="Registration Type"
                        onChange={(e) => setFormData(p => ({ ...p, registrationType: e.target.value }))}
                      >
                        <MenuItem value="online">Online Registration</MenuItem>
                        <MenuItem value="offline">Offline Desk Registration</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {showAdvancedSettings && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Exam Date"
                          value={formData.examDate}
                          onChange={(e) => setFormData(p => ({ ...p, examDate: e.target.value }))}
                          placeholder="e.g. 18 October 2026"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Exam Timing"
                          value={formData.examTime}
                          onChange={(e) => setFormData(p => ({ ...p, examTime: e.target.value }))}
                          placeholder="e.g. 10:00 AM – 11:30 AM (90 Min)"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Reporting Time"
                          value={formData.reportingTime}
                          onChange={(e) => setFormData(p => ({ ...p, reportingTime: e.target.value }))}
                          placeholder="e.g. 8:00 AM"
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Fee Paid Amount (Rs.)"
                          value={formData.paymentAmount}
                          onChange={(e) => setFormData(p => ({ ...p, paymentAmount: e.target.value }))}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FaMoneyBillWave color="#059669" size={14} />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Exam Center Address"
                          value={formData.examCenter}
                          onChange={(e) => setFormData(p => ({ ...p, examCenter: e.target.value }))}
                          placeholder="Exam venue name & address"
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </DialogContent>

      {/* Sticky Bottom Action Bar */}
      <DialogActions sx={{
        px: { xs: 2, sm: 4 },
        py: 2,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Button
          variant="outlined"
          onClick={() => !submitting && onClose()}
          disabled={submitting}
          sx={{
            borderColor: '#CBD5E1',
            color: '#64748B',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '12px',
            px: 3,
            py: 1,
            '&:hover': { background: '#F1F5F9', borderColor: '#94A3B8' }
          }}
        >
          Cancel
        </Button>

        <Box display="flex" gap={2} alignItems="center">
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || uploadingImage}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <FaSave />}
            sx={{
              background: 'linear-gradient(135deg, #D97706, #B45309)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.95rem',
              py: 1.2,
              px: 4,
              borderRadius: '12px',
              textTransform: 'none',
              boxShadow: '0 4px 16px rgba(217,119,6,0.35)',
              '&:hover': { background: 'linear-gradient(135deg, #B45309, #92400E)' }
            }}
          >
            {submitting ? 'Saving Changes...' : 'Save Changes (अपडेट करें)'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditCandidateModal;
