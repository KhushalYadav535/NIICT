import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Typography, Box, Grid, Paper, Container,
  TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem,
  Chip, Alert, CircularProgress, Divider
} from '@mui/material';
import {
  FaUserPlus, FaTimes, FaCamera, FaCloudUploadAlt, FaTrash, FaCheck, FaInfoCircle,
  FaRegLightbulb, FaPaste, FaUser, FaCalendarAlt, FaIdCard, FaPhoneAlt,
  FaGraduationCap, FaBook, FaTrophy, FaLaptopCode, FaMapMarkerAlt, FaCheckCircle
} from 'react-icons/fa';

const DEFAULT_SESSION = '2026-2027';

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

const getInitialFormData = (session) => ({
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
  session: session || DEFAULT_SESSION
});

const OfflineCandidateModal = ({
  open,
  onClose,
  activeSession,
  availableSessions = [],
  onSuccess
}) => {
  const [formData, setFormData] = useState(() => getInitialFormData(activeSession));
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [imageLightBox, setImageLightBox] = useState(null);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Reset form whenever modal opens
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(activeSession));
      setImagePreview(null);
      setError('');
      setIsDraggingPhoto(false);
      setWebcamOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [open, activeSession]);

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
      setError('Photo upload failed. You can proceed without photo.');
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Photo upload failed. You can proceed without photo.');
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

  // Clipboard paste listener (Ctrl+V anywhere in offline modal)
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
      setError('Please fill all required fields marked with *');
      return;
    }

    if (formData.phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setSubmitting(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/competition-applications/offline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          session: formData.session || activeSession || DEFAULT_SESSION
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to register offline candidate');
      }

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      console.error('Offline registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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
                    {imagePreview ? (
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
                    border: imagePreview ? '3px solid #059669' : '2px dashed #CBD5E1',
                    background: '#F8FAFC',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: imagePreview ? '0 10px 25px -5px rgba(5,150,105,0.3)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    {uploadingImage ? (
                      <Box textAlign="center" p={2}>
                        <CircularProgress size={32} sx={{ color: '#059669', mb: 1 }} />
                        <Typography variant="caption" sx={{ display: 'block', color: '#64748B', fontWeight: 700 }}>
                          Uploading...
                        </Typography>
                      </Box>
                    ) : imagePreview ? (
                      <Box 
                        component="img" 
                        src={imagePreview} 
                        alt="Candidate Preview" 
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => setImageLightBox(imagePreview)}
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
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    style={{ display: 'none' }} 
                  />

                  {/* Action Buttons: Upload + Webcam + Remove */}
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
                        background: 'linear-gradient(135deg, #059669, #047857)',
                        boxShadow: '0 4px 12px rgba(5,150,105,0.2)'
                      }}
                    >
                      {imagePreview ? 'Change File' : 'Browse File'}
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
                        borderColor: '#059669',
                        color: '#059669',
                        '&:hover': { borderColor: '#047857', backgroundColor: '#ECFDF5' }
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
                        helperText={formData.dateOfBirth && calculateAge(formData.dateOfBirth) !== null ? `🎂 Calculated Age: ${calculateAge(formData.dateOfBirth)} Years (Eligible ✓)` : 'Select Candidate DOB'}
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
                        helperText={formData.aadhaar.length === 12 ? '✓ 12-digit Aadhaar Complete' : `${formData.aadhaar.length}/12 digits (Optional)`}
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
                        helperText={formData.phone.length === 10 ? '✓ 10-digit Mobile Complete' : `${formData.phone.length}/10 digits (Required)`}
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

                    {/* Interactive 3-Card Subject Selector (English Only) */}
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 1 }}>
                        Examination Subject *
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

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Session / Exam Year</InputLabel>
                        <Select
                          value={formData.session}
                          label="Session / Exam Year"
                          onChange={(e) => setFormData(p => ({ ...p, session: e.target.value }))}
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
                        value={formData.parentPhone}
                        onChange={(e) => setFormData(p => ({ ...p, parentPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
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
                        value={formData.address}
                        onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
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
            onClick={() => onClose()} 
            disabled={submitting}
            variant="outlined" 
            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3.5, py: 1.1, color: '#64748B', borderColor: '#CBD5E1' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || uploadingImage}
            variant="contained" 
            startIcon={submitting ? null : <FaCheckCircle />}
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
            {submitting ? <CircularProgress size={22} color="inherit" /> : 'Confirm & Register Candidate (Mark Paid)'}
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
    </>
  );
};

export default React.memo(OfflineCandidateModal);
