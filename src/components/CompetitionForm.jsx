import React, { useState } from 'react';
import { Container, Typography, Paper, TextField, Button, Box, Grid, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { FaTrophy, FaUserGraduate, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const CompetitionForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    school: '',
    class: '',
    parentName: '',
    parentPhone: '',
    address: '',
    subject: 'GK',
    motherName: '',
    aadhaar: '',
    dateOfBirth: '',
    classPassed: ''
  });

  const [loading, setLoading] = useState(false);
  const [showAdmitCard, setShowAdmitCard] = useState(false);
  const [admitCardData, setAdmitCardData] = useState(null);
  const [error, setError] = useState('');

  // Generate unique 4-digit roll number
  const generateRollNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return String(timestamp % 10000).padStart(4, '0');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!formData.name || !formData.phone || !formData.age || !formData.school || !formData.class || !formData.parentName || !formData.parentPhone || !formData.address || !formData.motherName || !formData.aadhaar || !formData.dateOfBirth || !formData.classPassed) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    // Age must be 20 or below
    const ageNumber = Number(formData.age);
    if (Number.isNaN(ageNumber) || ageNumber > 20) {
      setError('Only candidates aged 20 or below can register');
      setLoading(false);
      return;
    }

    // Aadhaar validation: 12 digits
    if (!/^\d{12}$/.test(formData.aadhaar)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      setLoading(false);
      return;
    }

    // Class Passed must be in allowed range (8th to Graduation)
    const allowedClasses = ['8th','9th','10th','11th','12th','Diploma','Undergraduate','Graduation','Graduate','Bachelors'];
    if (!allowedClasses.map(v => v.toLowerCase()).includes(String(formData.classPassed).toLowerCase())) {
      setError('Class Passed must be between 8th and Graduation');
      setLoading(false);
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${API_BASE_URL}/api/competition-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const saved = await response.json();
      if (!response.ok) {
        throw new Error(saved.message || 'Failed to submit');
      }

      const admitData = {
        ...saved,
        qrCode: `COMPETITION_${saved.rollNumber}_${saved.name.replace(/\s+/g, '_')}`,
      };

      setAdmitCardData(admitData);
      setShowAdmitCard(true);
      setFormData({
        name: '',
        phone: '',
        age: '',
        school: '',
        class: '',
        parentName: '',
        parentPhone: '',
        address: '',
        subject: 'GK',
        motherName: '',
        aadhaar: '',
        dateOfBirth: '',
        classPassed: ''
      });
    } catch (error) {
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const printAdmitCard = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Competition Admit Card</title>
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
              <span>${admitCardData.rollNumber}</span>
            </div>
            <div class="info-row">
              <span class="label">Name:</span>
              <span>${admitCardData.name}</span>
            </div>
            <div class="info-row">
              <span class="label">Class:</span>
              <span>${admitCardData.class}</span>
            </div>
            <div class="info-row">
              <span class="label">School:</span>
              <span>${admitCardData.school}</span>
            </div>
            <div class="info-row">
              <span class="label">Subject:</span>
              <span>${admitCardData.subject}</span>
            </div>
            <div class="exam-details">
              <h3>Exam Details:</h3>
              <div class="info-row">
                <span class="label">Date:</span>
                <span>${admitCardData.examDate}</span>
              </div>
              <div class="info-row">
                <span class="label">Time:</span>
                <span>${admitCardData.examTime}</span>
              </div>
              <div class="info-row">
                <span class="label">Reporting Time:</span>
                <span>${admitCardData.reportingTime}</span>
              </div>
              <div class="info-row">
                <span class="label">Center:</span>
                <span>${admitCardData.examCenter}</span>
              </div>
            </div>
            <div class="qr-code">
              <div id="qr-code-container"></div>
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

  if (showAdmitCard && admitCardData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            <Box textAlign="center" mb={4}>
              <FaTrophy size={40} color="#fbbf24" style={{ marginBottom: '10px' }} />
              <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom>
                Competition Admit Card
              </Typography>
              <Typography variant="h6" color="#64748b">
                GK & Computer Knowledge Competition (Eligible: Class 8th to Graduation)
              </Typography>
            </Box>

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
                        {admitCardData.rollNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Subject</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {admitCardData.subject}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="#64748b">Full Name</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {admitCardData.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Class</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {admitCardData.class}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="#64748b">Age</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {admitCardData.age} years
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="#64748b">School</Typography>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {admitCardData.school}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ background: '#f1f5f9', p: 3, borderRadius: 3, mb: 3 }}>
                    <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom>
                      <FaCalendarAlt style={{ marginRight: '8px', color: '#3b82f6' }} />
                      Exam Details
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748b">Exam Date</Typography>
                        <Typography variant="h6" fontWeight={600} color="#1e293b">
                          {admitCardData.examDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748b">Exam Time</Typography>
                        <Typography variant="h6" fontWeight={600} color="#1e293b">
                          <FaClock style={{ marginRight: '4px', color: '#3b82f6' }} />
                          {admitCardData.examTime}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#64748b">Reporting Time</Typography>
                        <Typography variant="h6" fontWeight={600} color="#1e293b">
                          <FaClock style={{ marginRight: '4px', color: '#ef4444' }} />
                          {admitCardData.reportingTime}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="#64748b">Exam Center</Typography>
                        <Typography variant="h6" fontWeight={600} color="#1e293b">
                          <FaMapMarkerAlt style={{ marginRight: '4px', color: '#10b981' }} />
                          {admitCardData.examCenter}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ background: '#fef3c7', p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight={600} color="#92400e" gutterBottom>
                      Important Instructions
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#92400e' }}>
                      <li>Please arrive at the exam center 1 hour before the exam time</li>
                      <li>Bring this admit card and a valid ID proof</li>
                      <li>No electronic devices are allowed in the exam hall</li>
                      <li>Follow all COVID-19 protocols</li>
                      <li>Winners will be announced within 7 days of the exam</li>
                    </ul>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Box sx={{ background: 'white', p: 3, borderRadius: 3, boxShadow: 2, textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom>
                    QR Code
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <QRCode 
                      value={admitCardData.qrCode}
                      size={150}
                      level="H"
                      includeMargin={true}
                    />
                  </Box>
                  <Typography variant="body2" color="#64748b">
                    Scan this QR code for verification
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={printAdmitCard}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Print Admit Card
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => setShowAdmitCard(false)}
                    sx={{ borderRadius: 2, py: 1.5 }}
                  >
                    Register Another Student
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
          <Box textAlign="center" mb={4}>
            <FaTrophy size={40} color="#fbbf24" style={{ marginBottom: '10px' }} />
            <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom>
              GK & Computer Competition Registration
            </Typography>
            <Typography variant="h6" color="#64748b" gutterBottom>
              Join our exciting competition and test your knowledge!
            </Typography>
            <Box sx={{ background: '#dbeafe', p: 3, borderRadius: 3, mt: 3 }}>
              <Typography variant="h6" fontWeight={600} color="#1e40af" gutterBottom>
                <FaCalendarAlt style={{ marginRight: '8px' }} />
                Exam Details
              </Typography>
              <Grid container spacing={2} textAlign="left">
                <Grid item xs={6}>
                  <Typography variant="body2" color="#64748b">Date: 20 October 2024</Typography>
                  <Typography variant="body2" color="#64748b">Time: 8:00 AM</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="#64748b">Reporting: 7:00 AM</Typography>
                  <Typography variant="body2" color="#64748b">Center: SK Modern Intermediate College, Semri, Jaunpur</Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mother's Name *"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              {/* Email field removed as requested */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Aadhaar Number *"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/[^0-9]/g, '');
                    setFormData(prev => ({ ...prev, aadhaar: onlyDigits.slice(0, 12) }));
                  }}
                  required
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 12 }}
                  helperText="Enter 12-digit Aadhaar number"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Age *"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 1, max: 20 }}
                  helperText="Only candidates aged 20 or below can register"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Date of Birth *"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="School Name *"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Class *"
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Class Passed *</InputLabel>
                  <Select
                    name="classPassed"
                    value={formData.classPassed}
                    onChange={handleInputChange}
                    label="Class Passed *"
                    required
                  >
                    <MenuItem value="8th">8th</MenuItem>
                    <MenuItem value="9th">9th</MenuItem>
                    <MenuItem value="10th">10th</MenuItem>
                    <MenuItem value="11th">11th</MenuItem>
                    <MenuItem value="12th">12th</MenuItem>
                    <MenuItem value="Diploma">Diploma</MenuItem>
                    <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                    <MenuItem value="Graduation">Graduation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parent/Guardian Name *"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Parent/Guardian Phone *"
                  name="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Complete Address *"
                  name="address"
                  multiline
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              {/* Subject field removed as requested; subject remains defaulted in state */}
            </Grid>

            <Box textAlign="center" mt={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ 
                  borderRadius: 3, 
                  py: 1.5, 
                  px: 4, 
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <FaUserGraduate style={{ marginRight: '8px' }} />
                    Register for Competition
                  </>
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default CompetitionForm;
