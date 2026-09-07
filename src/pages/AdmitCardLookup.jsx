import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Box, Typography, Alert, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BadgeIcon from '@mui/icons-material/Badge';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { 
  generateAdmitCardHtml, 
  generateApplicationFormHtml, 
  openAdmitCardPrintWindow, 
  openApplicationFormPrintWindow 
} from '../utils/admitCardGenerator';

// Add print styles
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    .admit-card-print, .admit-card-print * {
      visibility: visible;
    }
    .admit-card-print {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin: 0;
      padding: 20px;
    }
    .search-form {
      display: none !important;
    }
    .no-print {
      display: none !important;
    }
  }
`;

const AdmitCardLookup = () => {
  const [searchMethod, setSearchMethod] = useState('roll');
  const [rollNumber, setRollNumber] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [namePhone, setNamePhone] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [app, setApp] = useState(null);
  const [activeDoc, setActiveDoc] = useState('admit_card'); // 'admit_card' | 'application_form'

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setApp(null);
    
    try {
      // Get backend URL
      const defaultBackend = import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000';
      const backendUrl = import.meta.env.VITE_BACKEND_URL || defaultBackend;
      
      let url = '';
      
      if (searchMethod === 'roll') {
        if (!rollNumber.trim()) {
          setError('Please enter your Roll Number (e.g. NIICT1234)');
          setLoading(false);
          return;
        }
        url = `${backendUrl}/api/competition-applications/roll/${encodeURIComponent(rollNumber.trim())}`;
      } else if (searchMethod === 'aadhaar') {
        // Validate Aadhaar format
        if (!/^\d{12}$/.test(aadhaar)) {
          setError('Please enter a valid 12-digit Aadhaar number');
          setLoading(false);
          return;
        }
        url = `${backendUrl}/api/competition-applications/aadhaar/${encodeURIComponent(aadhaar)}${dob ? `?dob=${encodeURIComponent(dob)}` : ''}`;
      } else if (searchMethod === 'mobile') {
        // Validate mobile format - allow 10 or 11 digits (with or without leading 0)
        if (!/^\d{10,11}$/.test(mobile)) {
          setError('Please enter a valid 10 or 11-digit mobile number');
          setLoading(false);
          return;
        }
        if (!dob) {
          setError('Date of birth is required for mobile search');
          setLoading(false);
          return;
        }
        url = `${backendUrl}/api/competition-applications/mobile/${encodeURIComponent(mobile)}?dob=${encodeURIComponent(dob)}`;
      } else if (searchMethod === 'name') {
        // Validate name
        if (!name.trim()) {
          setError('Please enter a valid name');
          setLoading(false);
          return;
        }
        if (!dob) {
          setError('Date of birth is required for name search');
          setLoading(false);
          return;
        }
        url = `${backendUrl}/api/competition-applications/name/${encodeURIComponent(name)}?dob=${encodeURIComponent(dob)}`;
      } else if (searchMethod === 'name-phone') {
        // Validate name and phone
        if (!namePhone.trim()) {
          setError('Please enter a valid name');
          setLoading(false);
          return;
        }
        if (!/^\d{10,11}$/.test(phone)) {
          setError('Please enter a valid 10 or 11-digit phone number');
          setLoading(false);
          return;
        }
        url = `${backendUrl}/api/competition-applications/name-phone?name=${encodeURIComponent(namePhone)}&phone=${encodeURIComponent(phone)}`;
      }
      
      const res = await fetch(url);
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response. Please check if the backend is running properly.');
      }
      
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('No application found with the provided details. Please check your Aadhaar number, mobile number, name, and date of birth.');
        }
        throw new Error(data.message || 'Lookup failed');
      }
      setApp(data);
    } catch (err) {
      console.error('Lookup error:', err);
      if (err.message.includes('fetch')) {
        setError('Unable to connect to server. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Lookup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrintAdmitCard = () => {
    if (app) openAdmitCardPrintWindow(app);
  };

  const handlePrintApplicationForm = () => {
    if (app) openApplicationFormPrintWindow(app);
  };

  return (
    <>
      <style>{printStyles}</style>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }} className="no-print">Admit Card Lookup</Typography>
          
          {/* Search Method Selector */}
          <FormControl fullWidth sx={{ mb: 2 }} className="no-print">
            <InputLabel>Search Method</InputLabel>
            <Select
              value={searchMethod}
              label="Search Method"
              onChange={(e) => {
                setSearchMethod(e.target.value);
                setError('');
                setApp(null);
              }}
            >
              <MenuItem value="roll">Roll Number (e.g. NIICT1234)</MenuItem>
              <MenuItem value="aadhaar">Aadhaar Number</MenuItem>
              <MenuItem value="mobile">Mobile Number + DOB</MenuItem>
              <MenuItem value="name">Name + DOB</MenuItem>
              <MenuItem value="name-phone">Name + Phone Number</MenuItem>
            </Select>
          </FormControl>

          <Box component="form" onSubmit={handleSearch} className="search-form" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 2, mb: 3 }}>
            {/* Dynamic input field based on search method */}
            {searchMethod === 'roll' && (
              <TextField 
                label="Roll Number" 
                required 
                value={rollNumber} 
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                placeholder="e.g. NIICT1234 or 1234"
              />
            )}
            {searchMethod === 'aadhaar' && (
              <TextField 
                label="Aadhaar Number" 
                required 
                value={aadhaar} 
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="Enter 12-digit Aadhaar number"
                inputProps={{ maxLength: 12 }}
              />
            )}
            {searchMethod === 'mobile' && (
              <TextField 
                label="Mobile Number" 
                required 
                value={mobile} 
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10 or 11-digit mobile number"
                inputProps={{ maxLength: 11 }}
              />
            )}
            {searchMethod === 'name' && (
              <TextField 
                label="Full Name" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
              />
            )}
            {searchMethod === 'name-phone' && (
              <TextField 
                label="Full Name" 
                required 
                value={namePhone} 
                onChange={(e) => setNamePhone(e.target.value)}
                placeholder="Enter full name"
              />
            )}
            
            {/* Show DOB field only for methods that require it */}
            {searchMethod !== 'name-phone' && searchMethod !== 'roll' && (
              <TextField 
                label="Date of Birth (YYYY-MM-DD)" 
                type="date" 
                InputLabelProps={{ shrink: true }} 
                value={dob} 
                onChange={(e) => setDob(e.target.value)}
                required={searchMethod !== 'aadhaar'}
              />
            )}
            
            {/* Show phone field only for name-phone method */}
            {searchMethod === 'name-phone' && (
              <TextField 
                label="Phone Number" 
                required 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter 10 or 11-digit phone number"
                inputProps={{ maxLength: 11 }}
              />
            )}
            <Button type="submit" variant="contained" disabled={loading}>Search</Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }} className="no-print">{error}</Alert>}

          {app && (
            <Box sx={{ mt: 4 }}>
              <Box 
                sx={{ 
                  p: 2.5, mb: 3, 
                  background: 'linear-gradient(135deg, #0F172A, #1E293B)', 
                  borderRadius: '16px', 
                  border: '1px solid #334155',
                  display: 'flex', 
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  justifyContent: 'space-between',
                  gap: 2,
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
                }}
              >
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box sx={{ 
                    width: 44, height: 44, borderRadius: '12px', 
                    background: activeDoc === 'admit_card' ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'linear-gradient(135deg, #059669, #047857)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)' 
                  }}>
                    {activeDoc === 'admit_card' ? <BadgeIcon sx={{ fontSize: 24 }} /> : <ReceiptLongIcon sx={{ fontSize: 24 }} />}
                  </Box>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                      <Typography variant="h6" fontWeight={800} color="#FFFFFF" sx={{ letterSpacing: '0.5px' }}>
                        {activeDoc === 'admit_card' ? 'Official E-Admit Card' : 'Application Form & Fee Receipt'}
                      </Typography>
                      <Chip 
                        label={activeDoc === 'admit_card' ? 'PROVISIONAL HALL TICKET' : 'PAID CONFIRMATION'} 
                        size="small" 
                        sx={{ 
                          backgroundColor: activeDoc === 'admit_card' ? 'rgba(37,99,235,0.2)' : 'rgba(16,185,129,0.2)', 
                          color: activeDoc === 'admit_card' ? '#60A5FA' : '#34D399', 
                          border: `1px solid ${activeDoc === 'admit_card' ? '#2563EB' : '#10B981'}`, 
                          fontWeight: 800, fontSize: '0.68rem' 
                        }} 
                      />
                    </Box>
                    <Typography variant="caption" color="#94A3B8">
                      Candidate: <strong style={{ color: '#F8FAFC' }}>{app.name}</strong> &bull; Roll No: <strong style={{ color: '#FBBF24' }}>{app.rollNumber}</strong>
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                  {/* Document Switcher Tabs */}
                  <Box sx={{ background: '#0F172A', p: 0.5, borderRadius: '12px', border: '1px solid #334155', display: 'flex', gap: 0.5 }}>
                    <Button
                      size="small"
                      onClick={() => setActiveDoc('admit_card')}
                      startIcon={<BadgeIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        px: 1.5,
                        py: 0.6,
                        borderRadius: '8px',
                        backgroundColor: activeDoc === 'admit_card' ? '#2563EB' : 'transparent',
                        color: activeDoc === 'admit_card' ? '#FFFFFF' : '#94A3B8',
                        boxShadow: activeDoc === 'admit_card' ? '0 2px 8px rgba(37,99,235,0.4)' : 'none',
                        '&:hover': { backgroundColor: activeDoc === 'admit_card' ? '#1D4ED8' : 'rgba(255,255,255,0.06)' }
                      }}
                    >
                      E-Admit Card
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setActiveDoc('application_form')}
                      startIcon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        px: 1.5,
                        py: 0.6,
                        borderRadius: '8px',
                        backgroundColor: activeDoc === 'application_form' ? '#059669' : 'transparent',
                        color: activeDoc === 'application_form' ? '#FFFFFF' : '#94A3B8',
                        boxShadow: activeDoc === 'application_form' ? '0 2px 8px rgba(16,185,129,0.4)' : 'none',
                        '&:hover': { backgroundColor: activeDoc === 'application_form' ? '#047857' : 'rgba(255,255,255,0.06)' }
                      }}
                    >
                      Application &amp; Fee Slip
                    </Button>
                  </Box>

                  <Button 
                    variant="contained" 
                    onClick={activeDoc === 'admit_card' ? handlePrintAdmitCard : handlePrintApplicationForm}
                    startIcon={<PrintIcon />}
                    sx={{ 
                      background: activeDoc === 'admit_card' ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'linear-gradient(135deg, #059669, #047857)', 
                      color: '#fff', 
                      fontWeight: 700, 
                      textTransform: 'none', 
                      borderRadius: '12px', 
                      px: 2.5, py: 0.9,
                      boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
                      '&:hover': { filter: 'brightness(1.1)' } 
                    }}
                  >
                    {activeDoc === 'admit_card' ? 'Print Admit Card' : 'Print Application Form'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={activeDoc === 'admit_card' ? handlePrintAdmitCard : handlePrintApplicationForm}
                    startIcon={<DownloadIcon />}
                    sx={{ 
                      borderColor: '#475569', 
                      color: '#E2E8F0', 
                      fontWeight: 600, 
                      textTransform: 'none', 
                      borderRadius: '12px', 
                      px: 2,
                      '&:hover': { borderColor: '#94A3B8', backgroundColor: 'rgba(255,255,255,0.05)' } 
                    }}
                  >
                    Save PDF
                  </Button>
                </Box>
              </Box>

              {/* Realistic Document Viewport */}
              <Box sx={{ 
                borderRadius: '16px', 
                overflow: 'hidden', 
                border: '1px solid #CBD5E1', 
                boxShadow: '0 15px 35px -5px rgba(0,0,0,0.15)',
                backgroundColor: '#525659',
                p: { xs: 1, md: 2 }
              }}>
                <iframe 
                  srcDoc={activeDoc === 'admit_card' ? generateAdmitCardHtml(app) : generateApplicationFormHtml(app)}
                  title="Document Preview"
                  style={{
                    width: '100%',
                    height: '850px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default AdmitCardLookup;


