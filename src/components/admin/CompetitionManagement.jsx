import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, Card, CardContent, TextField, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { FaTrophy, FaSearch, FaPrint, FaEye, FaTrash, FaDownload } from 'react-icons/fa';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const CompetitionManagement = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
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
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
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
            body { font-family: Arial, sans-serif; margin: 20px; }
            .admit-card { border: 2px solid #000; padding: 20px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .qr-code { text-align: center; margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .label { font-weight: bold; }
            .exam-details { background: #f0f0f0; padding: 15px; margin: 20px 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="admit-card">
            <div class="header">
              <h1>NIICT COMPETITION ADMIT CARD</h1>
              <h2>GK & Computer Knowledge Competition</h2>
            </div>
            <div class="info-row">
              <span class="label">Roll Number:</span>
              <span>${application.rollNumber}</span>
            </div>
            <div class="info-row">
              <span class="label">Name:</span>
              <span>${application.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Class:</span>
              <span>${application.class}</span>
            </div>
            <div class="info-row">
              <span class="label">School:</span>
              <span>${application.school}</span>
            </div>
            <div class="info-row">
              <span class="label">Subject:</span>
              <span>${application.subject}</span>
            </div>
            <div class="exam-details">
              <h3>Exam Details:</h3>
              <div class="info-row">
                <span class="label">Date:</span>
                <span>${application.examDate}</span>
              </div>
              <div class="info-row">
                <span class="label">Time:</span>
                <span>${application.examTime}</span>
              </div>
              <div class="info-row">
                <span class="label">Reporting Time:</span>
                <span>${application.reportingTime}</span>
              </div>
              <div class="info-row">
                <span class="label">Center:</span>
                <span>${application.examCenter}</span>
              </div>
            </div>
            <p><strong>Instructions:</strong></p>
            <ul>
              <li>Please arrive at the exam center 1 hour before the exam time</li>
              <li>Bring this admit card and a valid ID proof</li>
              <li>No electronic devices are allowed in the exam hall</li>
              <li>Follow all COVID-19 protocols</li>
            </ul>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToCSV = () => {
    const headers = ['Roll Number', 'Name', 'Email', 'Phone', 'Age', 'School', 'Class', 'Subject', 'Parent Name', 'Parent Phone', 'Address', 'Application Date'];
    const csvContent = [
      headers.join(','),
      ...applications.map(app => [
        app.rollNumber,
        app.name,
        app.email,
        app.phone,
        app.age,
        app.school,
        app.class,
        app.subject,
        app.parentName,
        app.parentPhone,
        `"${app.address}"`,
        app.applicationDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competition_applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredApplications = applications.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.rollNumber.includes(searchTerm) ||
    app.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                      <Typography variant="body2" color="#64748b">Email</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Phone</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Age</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.age} years
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Class</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.class}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="#64748b">School</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.school}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Parent Name</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.parentName}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Parent Phone</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {selectedApplication.parentPhone}
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
                        {selectedApplication.applicationDate}
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

        {/* Search and Export */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by name, roll number, school, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={exportToCSV}
            startIcon={<FaDownload />}
            sx={{ borderRadius: 2 }}
          >
            Export CSV
          </Button>
        </Box>

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
                    <TableCell>{application.class}</TableCell>
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
