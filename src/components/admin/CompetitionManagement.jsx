import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, Card, CardContent, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import { FaTrophy, FaSearch, FaPrint, FaEye, FaTrash, FaDownload } from 'react-icons/fa';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const CompetitionManagement = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/competition-applications`);
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

  const exportToCSV = () => {
    const headers = [
      'Roll Number',
      'Subject', 
      'Full Name',
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

  const filteredApplications = applications.filter(app => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    
    switch (searchType) {
      case 'name':
        return app.name.toLowerCase().includes(term);
      case 'phone':
        return app.phone && app.phone.includes(searchTerm);
      case 'aadhaar':
        return app.aadhaar && app.aadhaar.includes(searchTerm);
      case 'roll':
        return app.rollNumber.includes(searchTerm);
      case 'school':
        return app.school.toLowerCase().includes(term);
      case 'subject':
        return app.subject.toLowerCase().includes(term);
      default:
        return app.name.toLowerCase().includes(term) ||
               app.rollNumber.includes(searchTerm) ||
               app.school.toLowerCase().includes(term) ||
               app.subject.toLowerCase().includes(term) ||
               (app.phone && app.phone.includes(searchTerm)) ||
               (app.aadhaar && app.aadhaar.includes(searchTerm));
    }
  });

  const totalApplications = applications.length;
  const gkApplications = applications.filter(app => app.subject === 'GK').length;
  const computerApplications = applications.filter(app => app.subject === 'Computer').length;
  const bothApplications = applications.filter(app => app.subject === 'Both').length;

  if (showDetails && selectedApplication) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box display="flex" alignItems="center" mb={4} gap={2}>
            <FaTrophy size={30} color="#fbbf24" />
            <Typography variant="h4" fontWeight={700} color="#222">
              Competition Application Details
            </Typography>
          </Box>

          <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ background: 'white', p: 3, borderRadius: 3, boxShadow: 2 }}>
                  <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom>
                    Candidate Information
                  </Typography>
                  
                  <Grid container spacing={2} mb={3}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Roll Number</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.rollNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Subject</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.subject}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="#64748b">Full Name</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Phone</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Aadhaar Number</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.aadhaar || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Date of Birth</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.dateOfBirth ? new Date(selectedApplication.dateOfBirth).toLocaleDateString('en-GB') : 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Class</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.classPassed || selectedApplication.class || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="#64748b">School</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.school}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Father's Name</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.fatherName || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Mother's Name</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.motherName || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Parent Phone</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.parentPhone || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="#64748b">Address</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.address}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Application Date</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleDateString('en-GB') : 'Not available'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Payment Status</Typography>
                      <Typography variant="h6" fontWeight={600} color={selectedApplication.paymentStatus === 'verified' ? '#16a34a' : '#b45309'}>
                        {selectedApplication.paymentStatus === 'verified' ? 'Verified' : 'Pending'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ background: 'white', p: 3, borderRadius: 3, boxShadow: 2, textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom>
                    QR Code
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <QRCode 
                      value={selectedApplication.qrCode}
                      size={150}
                      level="H"
                      includeMargin={true}
                    />
                  </Box>
                  <Typography variant="body2" color="#64748b" gutterBottom>
                    Scan this QR code for verification
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => printAdmitCard(selectedApplication)}
                    startIcon={<FaPrint />}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Print Admit Card
                  </Button>
                  {selectedApplication.paymentStatus !== 'verified' ? (
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      disabled={updating}
                      onClick={() => updatePaymentStatus(selectedApplication._id, 'verified')}
                      sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      Mark as Verified
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="warning"
                      size="large"
                      disabled={updating}
                      onClick={() => updatePaymentStatus(selectedApplication._id, 'pending')}
                      sx={{ borderRadius: 2, py: 1.5 }}
                    >
                      Revert to Pending
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => setShowDetails(false)}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Back to List
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box display="flex" alignItems="center" mb={4} gap={2}>
          <FaTrophy size={30} color="#fbbf24" />
          <Typography variant="h4" fontWeight={700} color="#222">
            Competition Management
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4a90e2 60%, #2563eb 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Applications</Typography>
                <Typography variant="h4" fontWeight={700}>{totalApplications}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #10b981 60%, #22d3ee 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>GK Applications</Typography>
                <Typography variant="h4" fontWeight={700}>{gkApplications}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #fbbf24 60%, #f59e42 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Computer Applications</Typography>
                <Typography variant="h4" fontWeight={700}>{computerApplications}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #a78bfa 60%, #6366f1 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Both Subjects</Typography>
                <Typography variant="h4" fontWeight={700}>{bothApplications}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Enhanced Search Bar */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
          <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaSearch size={20} />
            Search Applications
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mt: 2 }}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Search By</InputLabel>
              <Select
                value={searchType}
                label="Search By"
                onChange={(e) => {
                  setSearchType(e.target.value);
                  setSearchTerm('');
                }}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">🔍 All Fields</MenuItem>
                <MenuItem value="name">👤 Name</MenuItem>
                <MenuItem value="phone">📱 Phone Number</MenuItem>
                <MenuItem value="aadhaar">🆔 Aadhaar Number</MenuItem>
                <MenuItem value="roll">🎫 Roll Number</MenuItem>
                <MenuItem value="school">🏫 School</MenuItem>
                <MenuItem value="subject">📚 Subject</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              placeholder={
                searchType === 'all' ? "🔍 Search by name, roll number, school, subject, phone, or Aadhaar..." :
                searchType === 'name' ? "👤 Search by name..." :
                searchType === 'phone' ? "📱 Search by phone number..." :
                searchType === 'aadhaar' ? "🆔 Search by Aadhaar number..." :
                searchType === 'roll' ? "🎫 Search by roll number..." :
                searchType === 'school' ? "🏫 Search by school..." :
                "📚 Search by subject..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                flexGrow: 1, 
                minWidth: 320,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch color="#64748b" />
                  </InputAdornment>
                ),
              }}
            />
            
            {searchTerm && (
              <Button
                variant="outlined"
                onClick={() => setSearchTerm('')}
                sx={{ borderRadius: 2, minWidth: 100 }}
              >
                Clear
              </Button>
            )}
            
            <Button
              variant="contained"
              color="primary"
              onClick={exportToCSV}
              startIcon={<FaDownload />}
              sx={{ borderRadius: 2, minWidth: 140 }}
            >
              Export CSV
            </Button>
          </Box>
          
          {searchTerm && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 2, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <Typography variant="body2" color="#1e40af" fontWeight={500}>
                🔍 Searching for "{searchTerm}" in {searchType === 'all' ? 'all fields' : searchType} • Found {filteredApplications.length} result{filteredApplications.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Applications Table */}
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 6 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: '#f0f9ff' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Roll Number</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Class</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>School</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application._id || application.rollNumber} hover>
                    <TableCell>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {application.rollNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight={500}>
                        {application.name}
                      </Typography>
                      <Typography variant="body2" color="#64748b">
                        {application.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{application.classPassed || application.class}</TableCell>
                    <TableCell>{application.school}</TableCell>
                    <TableCell>
                      <Chip 
                        label={application.subject}
                        color={
                          application.subject === 'GK' ? 'primary' : 
                          application.subject === 'Computer' ? 'secondary' : 'success'
                        }
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={application.paymentStatus === 'verified' ? 'Verified' : 'Pending'}
                        color={application.paymentStatus === 'verified' ? 'success' : 'warning'}
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>{application.phone}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="info" 
                        size="small"
                        onClick={() => handleViewDetails(application)}
                        sx={{ mr: 1, borderRadius: 2 }}
                        startIcon={<FaEye />}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained" 
                        color="primary" 
                        size="small"
                        onClick={() => printAdmitCard(application)}
                        sx={{ mr: 1, borderRadius: 2 }}
                        startIcon={<FaPrint />}
                      >
                        Print
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(application._id)}
                        sx={{ borderRadius: 2 }}
                        startIcon={<FaTrash />}
                      >
                        Delete
                      </Button>
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
  );
};

export default CompetitionManagement;
