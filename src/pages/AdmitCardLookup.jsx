import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Box, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
  const [searchMethod, setSearchMethod] = useState('aadhaar');
  const [aadhaar, setAadhaar] = useState('');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [namePhone, setNamePhone] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [app, setApp] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setApp(null);
    
    try {
      let url = '';
      
      if (searchMethod === 'aadhaar') {
        // Validate Aadhaar format
        if (!/^\d{12}$/.test(aadhaar)) {
          setError('Please enter a valid 12-digit Aadhaar number');
          setLoading(false);
          return;
        }
        url = `/api/competition-applications/aadhaar/${encodeURIComponent(aadhaar)}${dob ? `?dob=${encodeURIComponent(dob)}` : ''}`;
      } else if (searchMethod === 'mobile') {
        // Validate mobile format
        if (!/^\d{10}$/.test(mobile)) {
          setError('Please enter a valid 10-digit mobile number');
          setLoading(false);
          return;
        }
        if (!dob) {
          setError('Date of birth is required for mobile search');
          setLoading(false);
          return;
        }
        url = `/api/competition-applications/mobile/${encodeURIComponent(mobile)}?dob=${encodeURIComponent(dob)}`;
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
        url = `/api/competition-applications/name/${encodeURIComponent(name)}?dob=${encodeURIComponent(dob)}`;
      } else if (searchMethod === 'name-phone') {
        // Validate name and phone
        if (!namePhone.trim()) {
          setError('Please enter a valid name');
          setLoading(false);
          return;
        }
        if (!/^\d{10}$/.test(phone)) {
          setError('Please enter a valid 10-digit phone number');
          setLoading(false);
          return;
        }
        url = `/api/competition-applications/name-phone?name=${encodeURIComponent(namePhone)}&phone=${encodeURIComponent(phone)}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lookup failed');
      setApp(data);
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
              <MenuItem value="aadhaar">Aadhaar Number</MenuItem>
              <MenuItem value="mobile">Mobile Number + DOB</MenuItem>
              <MenuItem value="name">Name + DOB</MenuItem>
              <MenuItem value="name-phone">Name + Phone Number</MenuItem>
            </Select>
          </FormControl>

          <Box component="form" onSubmit={handleSearch} className="search-form" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 2, mb: 3 }}>
            {/* Dynamic input field based on search method */}
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
                placeholder="Enter 10-digit mobile number"
                inputProps={{ maxLength: 10 }}
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
            {searchMethod !== 'name-phone' && (
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
                placeholder="Enter 10-digit phone number"
                inputProps={{ maxLength: 10 }}
              />
            )}
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
                  <Box sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1, border: '2px solid #1976d2' }}>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#0d47a1', textAlign: 'center' }}>EXAMINATION DETAILS</Typography>
                    <Typography><b>Examination Date:</b> 12 Oct 2025 Sunday</Typography>
                    <Typography><b>Reporting Time:</b> 08:00 AM</Typography>
                    <Typography><b>Gate Closing Time:</b> 09:15 AM</Typography>
                    <Typography><b>Examination Time:</b> 10:00 AM</Typography>
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
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2, display: { xs: 'none', print: 'none' } }} 
                    onClick={handlePrint}
                  >
                    Print / Save as PDF
                  </Button>
                </Box>
              </Box>
              <Box sx={{ mt: 3, p: 3, backgroundColor: '#fff3e0', borderRadius: 1, borderLeft: '5px solid #ff9800' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#e65100', textAlign: 'center', mb: 2 }}>
                  अभ्यर्थी हेतु आवश्यकता निर्देश
                </Typography>
                <Box component="ol" sx={{ pl: 3, m: 0 }}>
                  <Typography component="li" sx={{ mb: 1, lineHeight: 1.5 }}>
                    कृपया परीक्षा की तिथि से पर्यात समय पूर्व परीक्षा केंद्र का सही पता मालूम अवश्य कर लें ।
                  </Typography>
                  <Typography component="li" sx={{ mb: 1, lineHeight: 1.5 }}>
                    अभ्यर्थी रिपोर्टिंग समय से 25 मिनट पहले परीक्षा केंद्र पर अवश्य पहुचें ।
                  </Typography>
                  <Typography component="li" sx={{ mb: 1, lineHeight: 1.5 }}>
                    अभ्यर्थी परीक्षा हॉल में अपने साथ एडमिट कार्ड, आधार कार्ड, बॉल पेन अवय लेकर आएं ।
                  </Typography>
                  <Typography component="li" sx={{ mb: 1, lineHeight: 1.5 }}>
                    परीक्षा हाल में किसी भी प्रकार की नकल सामग्री ( मोबाइल, स्मार्ट watch,calculator, डिजिटल पेन आदि) लाना सख्त मना हैं।
                  </Typography>
                  <Typography component="li" sx={{ mb: 1, lineHeight: 1.5 }}>
                    परीक्षा केंद्र के अंदर किसी भी प्रकार की सामग्री ( मोबाइल, बैग, घड़ी आदि मूल्यवान वस्तु) रखने की व्यवस्था नहीं है, अतः अभ्यर्थी अपने अभिभावक को साथ ले आए।
                  </Typography>
                  <Typography component="li" sx={{ mb: 1, lineHeight: 1.5 }}>
                    किसी भी अभ्यर्थी द्वारा अनुचित व्यावहार किए जाने पर उनकी परीक्षा रद्द कर दी जाएगी, जिसका जिम्मेदार अभ्यर्थी स्वयम होगा।
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mt: 2, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1, borderLeft: '5px solid #4caf50', textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 1 }}>
                  परीक्षा परिणाम की तिथि
                </Typography>
                <Typography sx={{ fontWeight: 600, color: '#333' }}>
                  18 Oct 2025 को Niict computer Classes के यूट्यूब चैनल के माध्यम से घोषित किया जाएगा।
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


