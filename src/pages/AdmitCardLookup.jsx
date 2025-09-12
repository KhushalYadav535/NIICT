import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Box, Typography, Alert } from '@mui/material';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const url = new URL(`${API_BASE_URL}/api/competition-applications/aadhaar/${encodeURIComponent(aadhaar)}`);
      if (dob) url.searchParams.set('dob', dob);
      const res = await fetch(url.toString());
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admit Card Lookup</Typography>
        <Box component="form" onSubmit={handleSearch} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 2 }}>
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
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {app && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Competition Admit Card</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 2 }}>
              <Box>
                <Typography><b>Roll Number:</b> {app.rollNumber}</Typography>
                <Typography><b>Name:</b> {app.name}</Typography>
                <Typography><b>Mother's Name:</b> {app.motherName}</Typography>
                <Typography><b>Class:</b> {app.class}</Typography>
                <Typography><b>Class Passed:</b> {app.classPassed}</Typography>
                <Typography><b>Date of Birth:</b> {app.dateOfBirth}</Typography>
                <Typography><b>School:</b> {app.school}</Typography>
                <Typography><b>Payment Status:</b> {app.paymentStatus === 'verified' ? 'Payment verified' : 'Payment not verified'}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography><b>Exam Date:</b> {app.examDate}</Typography>
                  <Typography><b>Exam Time:</b> {app.examTime}</Typography>
                  <Typography><b>Reporting:</b> {app.reportingTime}</Typography>
                  <Typography><b>Center:</b> {app.examCenter}</Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <QRCode value={app.qrCode} size={150} level="H" includeMargin />
                <Typography variant="body2" sx={{ mt: 1 }}>Scan for verification</Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={handlePrint}>Print / Save as PDF</Button>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AdmitCardLookup;


