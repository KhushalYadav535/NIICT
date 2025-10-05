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
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('No application found with the provided details. Please check your Aadhaar number, mobile number, name, and date of birth.');
        }
        throw new Error(data.message || 'Lookup failed');
      }
      setApp(data);
    } catch (err) {
      setError(err.message || 'Lookup failed');
    } finally {
      setLoading(false);
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

  const handlePrint = () => {
    if (app) {
      printAdmitCard(app);
    }
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
                    <Typography><b>Exam Center:</b> S K Modern Intermediate College Semari Janghai Jaunpur</Typography>
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
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      sx={{ borderRadius: 2 }} 
                      onClick={handlePrint}
                      startIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>}
                    >
                      Print Admit Card
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary"
                      sx={{ borderRadius: 2 }} 
                      onClick={() => window.print()}
                      startIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>}
                    >
                      Save as PDF
                    </Button>
                  </Box>
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


