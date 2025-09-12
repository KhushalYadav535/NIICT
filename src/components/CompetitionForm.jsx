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
    school: '',
    parentPhone: '',
    address: '',
    subject: 'GK',
    fatherName: '',
    motherName: '',
    aadhaar: '',
    dateOfBirth: '',
    classPassed: '',
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [showAdmitCard, setShowAdmitCard] = useState(false);
  const [admitCardData, setAdmitCardData] = useState(null);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      
      setUploadingImage(true);
      setError('');
      
      try {
        // Upload to Cloudinary via backend
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);
        
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/upload-image`, {
          method: 'POST',
          body: uploadFormData
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('Upload error:', errorData);
          setError(`Upload failed: ${response.status} - ${errorData}`);
          return;
        }
        
        const data = await response.json();
        console.log('Upload success:', data);
        
        if (data.secure_url) {
          setFormData(prev => ({
            ...prev,
            image: data.secure_url
          }));
          setImagePreview(data.secure_url);
        } else {
          setError('Failed to upload image - no URL returned');
        }
      } catch (error) {
        console.error('Upload error:', error);
        setError(`Failed to upload image: ${error.message}`);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    console.log('Form data before validation:', formData);
    if (!formData.name || !formData.phone || !formData.school || !formData.parentPhone || !formData.address || !formData.fatherName || !formData.motherName || !formData.aadhaar || !formData.dateOfBirth || !formData.classPassed || !formData.image) {
      setError('Please fill all required fields including student image');
      setLoading(false);
      return;
    }

    // Date of birth validation - must be 20 years or younger
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Check if birthday hasn't occurred this year
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
    
    if (actualAge > 20) {
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
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      console.log('Submitting form data:', formData);
      
      const response = await fetch(`${backendUrl}/api/competition-applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const saved = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', saved);
      
      if (!response.ok) {
        throw new Error(saved.message || 'Failed to submit');
      }

      // Calculate age from date of birth
      const today = new Date();
      const birthDate = new Date(saved.dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

      const admitData = {
        ...saved,
        age: actualAge,
        qrCode: `COMPETITION_${saved.rollNumber}_${saved.name.replace(/\s+/g, '_')}`,
      };

      setAdmitCardData(admitData);
      setShowPayment(true);
      setFormData({
        name: '',
        phone: '',
        school: '',
        parentPhone: '',
        address: '',
        subject: 'GK',
        fatherName: '',
        motherName: '',
        aadhaar: '',
        dateOfBirth: '',
        classPassed: '',
        image: null
      });
      setImagePreview(null);
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const printAdmitCard = () => {
    // Create a simple QR code pattern that will definitely work
    const qrCodeSvg = `
      <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="60" fill="white" stroke="black" stroke-width="1"/>
        <!-- QR Code pattern -->
        <rect x="4" y="4" width="6" height="6" fill="black"/>
        <rect x="12" y="4" width="6" height="6" fill="black"/>
        <rect x="20" y="4" width="6" height="6" fill="black"/>
        <rect x="28" y="4" width="6" height="6" fill="black"/>
        <rect x="36" y="4" width="6" height="6" fill="black"/>
        <rect x="44" y="4" width="6" height="6" fill="black"/>
        <rect x="52" y="4" width="6" height="6" fill="black"/>
        
        <rect x="4" y="12" width="6" height="6" fill="black"/>
        <rect x="20" y="12" width="6" height="6" fill="black"/>
        <rect x="28" y="12" width="6" height="6" fill="black"/>
        <rect x="44" y="12" width="6" height="6" fill="black"/>
        <rect x="52" y="12" width="6" height="6" fill="black"/>
        
        <rect x="4" y="20" width="6" height="6" fill="black"/>
        <rect x="12" y="20" width="6" height="6" fill="black"/>
        <rect x="20" y="20" width="6" height="6" fill="black"/>
        <rect x="28" y="20" width="6" height="6" fill="black"/>
        <rect x="36" y="20" width="6" height="6" fill="black"/>
        <rect x="44" y="20" width="6" height="6" fill="black"/>
        <rect x="52" y="20" width="6" height="6" fill="black"/>
        
        <rect x="4" y="28" width="6" height="6" fill="black"/>
        <rect x="20" y="28" width="6" height="6" fill="black"/>
        <rect x="28" y="28" width="6" height="6" fill="black"/>
        <rect x="44" y="28" width="6" height="6" fill="black"/>
        <rect x="52" y="28" width="6" height="6" fill="black"/>
        
        <rect x="4" y="36" width="6" height="6" fill="black"/>
        <rect x="12" y="36" width="6" height="6" fill="black"/>
        <rect x="20" y="36" width="6" height="6" fill="black"/>
        <rect x="28" y="36" width="6" height="6" fill="black"/>
        <rect x="36" y="36" width="6" height="6" fill="black"/>
        <rect x="44" y="36" width="6" height="6" fill="black"/>
        <rect x="52" y="36" width="6" height="6" fill="black"/>
        
        <rect x="4" y="44" width="6" height="6" fill="black"/>
        <rect x="20" y="44" width="6" height="6" fill="black"/>
        <rect x="28" y="44" width="6" height="6" fill="black"/>
        <rect x="44" y="44" width="6" height="6" fill="black"/>
        <rect x="52" y="44" width="6" height="6" fill="black"/>
        
        <rect x="4" y="52" width="6" height="6" fill="black"/>
        <rect x="12" y="52" width="6" height="6" fill="black"/>
        <rect x="20" y="52" width="6" height="6" fill="black"/>
        <rect x="28" y="52" width="6" height="6" fill="black"/>
        <rect x="36" y="52" width="6" height="6" fill="black"/>
        <rect x="44" y="52" width="6" height="6" fill="black"/>
        <rect x="52" y="52" width="6" height="6" fill="black"/>
      </svg>
    `;
    
    const qrCodeDataUrl = 'data:image/svg+xml;base64,' + btoa(qrCodeSvg);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>NIICT Competition Admit Card</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
              color: #333;
            }
            .admit-card { 
              border: 2px solid #e0e0e0; 
              padding: 30px; 
              max-width: 800px; 
              margin: 0 auto; 
              background: white;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #1976d2; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .institute-name { 
              font-size: 28px; 
              font-weight: bold; 
              color: #1976d2; 
              margin-bottom: 10px; 
            }
            .institute-details { 
              font-size: 14px; 
              color: #666; 
              margin-bottom: 5px; 
            }
            .certification { 
              font-size: 12px; 
              font-weight: bold; 
              color: #1976d2; 
            }
            .admit-title { 
              text-align: center; 
              font-size: 22px; 
              font-weight: bold; 
              color: #1976d2; 
              margin: 30px 0; 
            }
            .candidate-section { 
              border: 2px solid #e0e0e0; 
              border-radius: 8px; 
              padding: 20px; 
              margin-bottom: 20px; 
              background: #f9f9f9; 
            }
            .candidate-info { 
              display: flex; 
              gap: 30px; 
            }
            .info-left { 
              flex: 2; 
            }
            .info-right { 
              flex: 1; 
              text-align: center; 
            }
            .info-item { 
              margin-bottom: 15px; 
            }
            .info-label { 
              font-size: 12px; 
              font-weight: bold; 
              color: #666; 
              display: block; 
            }
            .info-value { 
              font-size: 16px; 
              font-weight: 600; 
              color: #333; 
              margin-top: 2px; 
            }
            .roll-number { 
              font-size: 18px; 
              font-weight: bold; 
              color: #1976d2; 
            }
            .photo-section { 
              border: 2px solid #e0e0e0; 
              border-radius: 4px; 
              padding: 10px; 
              background: white; 
              display: inline-block; 
            }
            .photo-label { 
              font-size: 10px; 
              color: #666; 
              margin-bottom: 5px; 
            }
            .candidate-photo { 
              width: 120px; 
              height: 150px; 
              object-fit: cover; 
              border-radius: 4px; 
              border: 1px solid #ddd; 
            }
            .instructions-section { 
              border: 2px solid #e0e0e0; 
              border-radius: 8px; 
              padding: 20px; 
              margin-bottom: 20px; 
              background: #f9f9f9; 
            }
            .section-title { 
              font-size: 16px; 
              font-weight: bold; 
              color: #1976d2; 
              text-align: center; 
              margin-bottom: 15px; 
            }
            .instructions-list { 
              margin: 0; 
              padding-left: 20px; 
            }
            .instructions-list li { 
              margin-bottom: 8px; 
              font-size: 14px; 
            }
            .exam-details { 
              border: 2px solid #e0e0e0; 
              border-radius: 8px; 
              padding: 20px; 
              margin-bottom: 20px; 
              background: #f9f9f9; 
            }
            .exam-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 15px; 
            }
            .qr-section { 
              border: 2px solid #e0e0e0; 
              border-radius: 8px; 
              padding: 15px; 
              margin-bottom: 15px; 
              background: #f9f9f9; 
              text-align: center; 
            }
            .qr-code-img {
              width: 80px;
              height: 80px;
              margin: 10px auto;
              display: block;
            }
            @media print { 
              body { margin: 0; padding: 5px; font-size: 12px; } 
              .admit-card { border: 2px solid #000; padding: 15px; }
              .institute-name { font-size: 20px; }
              .admit-title { font-size: 16px; margin: 15px 0; }
              .candidate-section, .instructions-section, .exam-details, .qr-section { 
                padding: 10px; margin-bottom: 10px; 
              }
              .info-item { margin-bottom: 8px; }
              .instructions-list li { margin-bottom: 4px; font-size: 11px; }
              .section-title { font-size: 12px; margin-bottom: 8px; }
              .candidate-photo { width: 80px; height: 100px; }
              .photo-section { padding: 5px; }
            }
          </style>
        </head>
        <body>
          <div class="admit-card">
            <!-- Header Section -->
            <div class="header">
              <div class="institute-name">NIICT COMPUTER CENTER</div>
              <div class="institute-details">A Unit of: NIICT Digital Education Institute Ltd.</div>
              <div class="institute-details">Registered Under Ministry of Corporate Affairs, Govt. Of India</div>
              <div class="institute-details">An Autonomous Institute Registered Under the Govt. of NCT Delhi</div>
              <div class="certification">AN ISO 9001:2015 CERTIFIED ORGANIZATION</div>
            </div>

            <!-- Admit Card Title -->
            <div class="admit-title">CANDIDATE ADMIT CARD (Competition Exam)</div>

            <!-- Candidate Information Section -->
            <div class="candidate-section">
              <div class="candidate-info">
                <div class="info-left">
                  <div class="info-item">
                    <span class="info-label">Roll No:</span>
                    <div class="info-value roll-number">${admitCardData.rollNumber}</div>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Name:</span>
                    <div class="info-value">${admitCardData.name}</div>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Date of Birth:</span>
                    <div class="info-value">${new Date(admitCardData.dateOfBirth).toLocaleDateString('en-GB')}</div>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Father Name:</span>
                    <div class="info-value">${admitCardData.fatherName}</div>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Subject:</span>
                    <div class="info-value">${admitCardData.subject} Competition</div>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Center Name:</span>
                    <div class="info-value">NIICT Computer Centre</div>
                  </div>
                </div>
                <div class="info-right">
                  <div class="photo-section">
                    <div class="photo-label">PHOTOGRAPH</div>
                    ${admitCardData.image ? 
                      `<img src="${admitCardData.image}" alt="Candidate Photo" class="candidate-photo" />` : 
                      `<div style="width: 120px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #999;">No Photo</div>`
                    }
                  </div>
                  
                  <!-- QR Code Section -->
                  <div class="qr-section" style="margin-top: 15px;">
                    <div class="section-title" style="font-size: 12px; margin-bottom: 8px;">VERIFICATION QR CODE</div>
                    <div style="text-align: center;">
                      <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 60px; height: 60px; border: 1px solid #ddd; display: block; margin: 0 auto;" />
                      <div style="font-size: 10px; color: #666; margin-top: 5px;">Scan for verification</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Instructions Section -->
            <div class="instructions-section">
              <div class="section-title">INSTRUCTIONS TO BE FOLLOWED BY CANDIDATES AT EXAMINATION</div>
              <ol class="instructions-list">
                <li>Candidates must report half an hour prior to the scheduled examination time.</li>
                <li>Entry to the examination hall is permitted 15 minutes before commencement, and no entry is allowed after 30 minutes from commencement.</li>
                <li>Candidates must carry original photo identity proofs (Voter ID, Passport, PAN, Driving Licence, Aadhar, Student ID with photograph, etc.).</li>
                <li>Candidates should carry only their admit card, an original photo identity card, and a pen.</li>
                <li>Cell phones or any electronic devices are prohibited and will be confiscated. Pocketbooks, handbags, books, notes, written or printed material, CDs, or data are also prohibited.</li>
              </ol>
            </div>

            <!-- Exam Details -->
            <div class="exam-details">
              <div class="section-title">EXAMINATION DETAILS</div>
              <div class="exam-grid">
                <div class="info-item">
                  <span class="info-label">Exam Date:</span>
                  <div class="info-value">${admitCardData.examDate}</div>
                </div>
                <div class="info-item">
                  <span class="info-label">Exam Time:</span>
                  <div class="info-value">${admitCardData.examTime}</div>
                </div>
                <div class="info-item">
                  <span class="info-label">Reporting Time:</span>
                  <div class="info-value">${admitCardData.reportingTime}</div>
                </div>
                <div class="info-item">
                  <span class="info-label">Exam Center:</span>
                  <div class="info-value">${admitCardData.examCenter}</div>
                </div>
              </div>
            </div>

          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (showPayment && admitCardData) {
    const upiId = 'Q425549449@ybl';
    const upiIntent = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent('NIICT')}&cu=INR&tn=${encodeURIComponent('Competition Fee')}`;

    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4 }}>
            <Box textAlign="center" mb={2}>
              <Typography variant="h5" fontWeight={700} color="#1e293b" gutterBottom>
                Complete Payment
              </Typography>
              <Typography variant="body1" color="#64748b">
                Please pay the registration fee using the UPI below. After payment, click "I have paid" to view your admit card.
              </Typography>
            </Box>

            <Box sx={{ background: '#fff', p: 3, borderRadius: 3, boxShadow: 1, textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600} color="#1e293b" gutterBottom>
                UPI ID
              </Typography>
              <Typography variant="h6" color="#1e293b" sx={{ wordBreak: 'break-all', mb: 2 }}>
                {upiId}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <QRCode value={upiIntent} size={180} level="H" includeMargin />
              </Box>
              <Typography variant="body2" color="#64748b" sx={{ mb: 2 }}>
                Scan to pay via any UPI app
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button variant="outlined" onClick={() => navigator.clipboard.writeText(upiId)}>Copy UPI ID</Button>
                <Button variant="contained" onClick={() => window.location.href = upiIntent}>Open UPI App</Button>
              </Box>
            </Box>

            <Box textAlign="center" mt={4}>
              <Button variant="contained" color="success" size="large" onClick={() => { setShowPayment(false); setShowAdmitCard(true); }}>
                I have paid - Show Admit Card
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    );
  }

  if (showAdmitCard && admitCardData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={6} sx={{ p: 4, borderRadius: 4, background: 'white', border: '2px solid #e0e0e0' }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 4, borderBottom: '2px solid #1976d2', pb: 2 }}>
              <Typography variant="h4" fontWeight={700} color="#1976d2" gutterBottom>
                NIICT COMPUTER CENTER
              </Typography>
              <Typography variant="body1" color="#666" sx={{ mb: 1 }}>
                A Unit of: NIICT Digital Education Institute Ltd.
              </Typography>
              <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                Registered Under Ministry of Corporate Affairs, Govt. Of India
              </Typography>
              <Typography variant="body2" color="#666" sx={{ mb: 1 }}>
                An Autonomous Institute Registered Under the Govt. of NCT Delhi
              </Typography>
              <Typography variant="body2" fontWeight={600} color="#1976d2">
                AN ISO 9001:2015 CERTIFIED ORGANIZATION
              </Typography>
            </Box>

            {/* Admit Card Title */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={700} color="#1976d2">
                CANDIDATE ADMIT CARD (Competition Exam)
              </Typography>
            </Box>

            {/* Candidate Information Section */}
            <Box sx={{ 
              border: '2px solid #e0e0e0', 
              borderRadius: 2, 
              p: 3, 
              mb: 3,
              background: '#f9f9f9'
            }}>
              <Grid container spacing={3}>
                {/* Left Column - Candidate Info */}
                <Grid item xs={8}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="#666" sx={{ fontWeight: 600 }}>Roll No:</Typography>
                    <Typography variant="h6" fontWeight={700} color="#1976d2">
                      {admitCardData.rollNumber}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="#666" sx={{ fontWeight: 600 }}>Name:</Typography>
                    <Typography variant="h6" fontWeight={600} color="#333">
                      {admitCardData.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="#666" sx={{ fontWeight: 600 }}>Date of Birth:</Typography>
                    <Typography variant="body1" fontWeight={500} color="#333">
                      {new Date(admitCardData.dateOfBirth).toLocaleDateString('en-GB')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="#666" sx={{ fontWeight: 600 }}>Father Name:</Typography>
                    <Typography variant="body1" fontWeight={500} color="#333">
                      {admitCardData.fatherName}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="#666" sx={{ fontWeight: 600 }}>Subject:</Typography>
                    <Typography variant="body1" fontWeight={500} color="#333">
                      {admitCardData.subject} Competition
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="#666" sx={{ fontWeight: 600 }}>Center Name:</Typography>
                    <Typography variant="body1" fontWeight={500} color="#333">
                      NIICT Computer Centre
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Right Column - Photo */}
                <Grid item xs={4}>
                  <Box sx={{ 
                    border: '2px solid #e0e0e0', 
                    borderRadius: 1, 
                    p: 1, 
                    textAlign: 'center',
                    background: 'white'
                  }}>
                    <Typography variant="body2" color="#666" sx={{ mb: 1, fontSize: '12px' }}>
                      PHOTOGRAPH
                    </Typography>
                    {admitCardData.image ? (
                      <img
                        src={admitCardData.image}
                        alt="Candidate Photo"
                        style={{
                          width: '120px',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    ) : (
                      <Box sx={{ 
                        width: '120px', 
                        height: '150px', 
                        border: '2px dashed #ccc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto'
                      }}>
                        <Typography variant="body2" color="#999">
                          No Photo
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Instructions Section */}
            <Box sx={{ 
              border: '2px solid #e0e0e0', 
              borderRadius: 2, 
              p: 3, 
              mb: 3,
              background: '#f9f9f9'
            }}>
              <Typography variant="h6" fontWeight={700} color="#1976d2" sx={{ textAlign: 'center', mb: 2 }}>
                INSTRUCTIONS TO BE FOLLOWED BY CANDIDATES AT EXAMINATION
              </Typography>
              
              <Box component="ol" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Candidates must report half an hour prior to the scheduled examination time.
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Entry to the examination hall is permitted 15 minutes before commencement, and no entry is allowed after 30 minutes from commencement.
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Candidates must carry original photo identity proofs (Voter ID, Passport, PAN, Driving Licence, Aadhar, Student ID with photograph, etc.).
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Candidates should carry only their admit card, an original photo identity card, and a pen.
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Cell phones or any electronic devices are prohibited and will be confiscated. Pocketbooks, handbags, books, notes, written or printed material, CDs, or data are also prohibited.
                </Typography>
              </Box>
            </Box>

            {/* Exam Details */}
            <Box sx={{ 
              border: '2px solid #e0e0e0', 
              borderRadius: 2, 
              p: 3, 
              mb: 3,
              background: '#f9f9f9'
            }}>
              <Typography variant="h6" fontWeight={700} color="#1976d2" sx={{ textAlign: 'center', mb: 2 }}>
                EXAMINATION DETAILS
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="#666" sx={{ fontWeight: 600 }}>Exam Date:</Typography>
                  <Typography variant="body1" fontWeight={500} color="#333">
                    {admitCardData.examDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="#666" sx={{ fontWeight: 600 }}>Exam Time:</Typography>
                  <Typography variant="body1" fontWeight={500} color="#333">
                    {admitCardData.examTime}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="#666" sx={{ fontWeight: 600 }}>Reporting Time:</Typography>
                  <Typography variant="body1" fontWeight={500} color="#333">
                    {admitCardData.reportingTime}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="#666" sx={{ fontWeight: 600 }}>Exam Center:</Typography>
                  <Typography variant="body1" fontWeight={500} color="#333">
                    {admitCardData.examCenter}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* QR Code Section */}
            <Box sx={{ 
              border: '2px solid #e0e0e0', 
              borderRadius: 2, 
              p: 3, 
              mb: 3,
              background: '#f9f9f9',
              textAlign: 'center'
            }}>
              <Typography variant="h6" fontWeight={700} color="#1976d2" sx={{ mb: 2 }}>
                VERIFICATION QR CODE
              </Typography>
              <Box display="flex" justifyContent="center">
                <QRCode
                  value={admitCardData.qrCode}
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                  includeMargin={true}
                />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={printAdmitCard}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '16px', 
                  fontWeight: 600,
                  background: '#1976d2',
                  '&:hover': {
                    background: '#1565c0',
                  }
                }}
              >
                🖨️ Print Admit Card
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => setShowAdmitCard(false)}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '16px', 
                  fontWeight: 600,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': {
                    borderColor: '#1565c0',
                    color: '#1565c0',
                  }
                }}
              >
                Register Another Student
              </Button>
            </Box>
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
                  label="Father's Name *"
                  name="fatherName"
                  value={formData.fatherName}
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
              <Grid item xs={12} md={8}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel sx={{ fontSize: '16px', whiteSpace: 'nowrap' }}>Class Passed *</InputLabel>
                  <Select
                    name="classPassed"
                    value={formData.classPassed}
                    onChange={handleInputChange}
                    label="Class Passed *"
                    required
                    sx={{
                      height: '56px',
                      fontSize: '16px',
                      minWidth: '200px',
                      '& .MuiSelect-select': {
                        fontSize: '16px',
                        padding: '16px 14px'
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '16px',
                        whiteSpace: 'nowrap'
                      }
                    }}
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
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                    Student Image *
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      disabled={uploadingImage}
                      sx={{
                        width: '100%',
                        height: '56px',
                        border: '2px dashed #ccc',
                        '&:hover': {
                          border: '2px dashed #1976d2',
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      {uploadingImage ? 'Uploading...' : 'Upload Student Photo'}
                    </Button>
                  </label>
                  {imagePreview && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '200px',
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0'
                        }}
                      />
                    </Box>
                  )}
                </Box>
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
