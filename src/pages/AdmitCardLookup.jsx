import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Box, Typography, Alert } from '@mui/material';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

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
  const [aadhaar, setAadhaar] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [app, setApp] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setApp(null);
    
    // Validate Aadhaar format
    if (!/^\d{12}$/.test(aadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      setLoading(false);
      return;
    }
    
    try {
      // Use the proxy setup from vite.config.js
      const url = `/api/competition-applications/aadhaar/${encodeURIComponent(aadhaar)}${dob ? `?dob=${encodeURIComponent(dob)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lookup failed');
      setApp({ ...data, qrCode: `COMPETITION_${data.rollNumber}_${data.name.replace(/\s+/g, '_')}` });
    } catch (err) {
      setError(err.message || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{printStyles}</style>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
        <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }} className="no-print">Admit Card Lookup</Typography>
          <Box component="form" onSubmit={handleSearch} className="search-form" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 2, mb: 3 }}>
            <TextField 
              label="Aadhaar Number" 
              required 
              value={aadhaar} 
              onChange={(e) => setAadhaar(e.target.value)}
              placeholder="Enter 12-digit Aadhaar number"
              inputProps={{ maxLength: 12 }}
            />
            <TextField 
              label="Date of Birth (YYYY-MM-DD)" 
              type="date" 
              InputLabelProps={{ shrink: true }} 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
            />
            <Button type="submit" variant="contained" disabled={loading}>Search</Button>
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }} className="no-print">{error}</Alert>}

          {app && (
            <Box className="admit-card-print" sx={{ mt: 4, p: 3, border: '2px solid #000', borderRadius: 2, backgroundColor: '#fff' }}>
              <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                NIICT COMPETITION ADMIT CARD
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Candidate Information</Typography>
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    <Typography><b>Roll Number:</b> {app.rollNumber}</Typography>
                    <Typography><b>Name:</b> {app.name}</Typography>
                    <Typography><b>Father's Name:</b> {app.fatherName}</Typography>
                    <Typography><b>Mother's Name:</b> {app.motherName}</Typography>
                    <Typography><b>Class Passed:</b> {app.classPassed}</Typography>
                    <Typography><b>Date of Birth:</b> {app.dateOfBirth}</Typography>
                    <Typography><b>School:</b> {app.school}</Typography>
                    <Typography><b>Subject:</b> {app.subject}</Typography>
                    <Typography><b>Payment Status:</b> {app.paymentStatus === 'verified' ? 'Payment verified' : 'Payment not verified'}</Typography>
                  </Box>
                  <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Exam Details</Typography>
                    <Typography><b>Exam Date:</b> {app.examDate}</Typography>
                    <Typography><b>Exam Time:</b> {app.examTime}</Typography>
                    <Typography><b>Reporting Time:</b> {app.reportingTime}</Typography>
                    <Typography><b>Exam Center:</b> {app.examCenter}</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={app.image} 
                      alt="Candidate Photo" 
                      style={{ 
                        width: '120px', 
                        height: '150px', 
                        border: '2px solid #000',
                        objectFit: 'cover'
                      }} 
                    />
                  </Box>
                  <QRCode value={app.qrCode} size={120} level="H" includeMargin />
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>Scan for verification</Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2, display: { xs: 'none', print: 'none' } }} 
                    onClick={handlePrint}
                  >
                    Print / Save as PDF
                  </Button>
                </Box>
              </Box>
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#e8f4f8', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Instructions: Please bring this admit card and a valid ID proof to the exam center. 
                  Report 30 minutes before the exam time.
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default AdmitCardLookup;


