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
        const defaultBackend = import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000';
        const backendUrl = import.meta.env.VITE_BACKEND_URL || defaultBackend;
        const uploadStrategy = import.meta.env.VITE_UPLOAD_STRATEGY || 'mongo';
        const folder = 'niict/competition';
        const publicId = `student_${Date.now()}`;

        if (uploadStrategy === 'cloudinary') {
          // Signed Cloudinary upload first in production
          try {
            const sigRes = await fetch(`${backendUrl}/api/cloudinary-signature`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ folder, public_id: publicId })
            });
            if (sigRes.ok) {
              const { cloud_name, api_key, timestamp, signature } = await sigRes.json();
              const signedForm = new FormData();
              signedForm.append('file', file);
              signedForm.append('api_key', api_key);
              signedForm.append('timestamp', String(timestamp));
              signedForm.append('signature', signature);
              signedForm.append('folder', folder);
              signedForm.append('public_id', publicId);

              const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
              const uploadRes = await fetch(uploadUrl, { method: 'POST', body: signedForm });
              if (uploadRes.ok) {
                const result = await uploadRes.json();
                if (result.secure_url) {
                  setFormData(prev => ({ ...prev, image: result.secure_url }));
                  setImagePreview(result.secure_url);
                  return;
                }
              } else {
                // Fallthrough to mongo
              }
            }
          } catch (_) {}
        }

        // MongoDB upload (default or fallback)
        try {
          const mongoForm = new FormData();
          mongoForm.append('image', file);
          const mongoRes = await fetch(`${backendUrl}/api/upload-image-mongo`, {
            method: 'POST',
            body: mongoForm
          });
          if (!mongoRes.ok) {
            const msg = await mongoRes.text();
            setError(`Upload failed: ${mongoRes.status} - ${msg}`);
            return;
          }
          const mongoResult = await mongoRes.json();
          if (mongoResult.secure_url) {
            setFormData(prev => ({ ...prev, image: mongoResult.secure_url }));
            setImagePreview(mongoResult.secure_url);
            return;
          }
        } catch (_) {}

        setError('Failed to upload image - no URL returned');
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
    if (!formData.name || !formData.phone || !formData.school || !formData.address || !formData.fatherName || !formData.motherName || !formData.dateOfBirth || !formData.classPassed) {
      setError('Please fill all required fields');
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

    // Aadhaar validation: 12 digits (only if provided)
    if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar)) {
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
      const defaultBackend = import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000';
      const backendUrl = import.meta.env.VITE_BACKEND_URL || defaultBackend;
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
    
    const qrInlineSvg = qrCodeSvg; // embed directly to avoid image load timing issues
    
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
            .qr-code-img {
              width: 80px;
              height: 80px;
              margin: 10px auto;
              display: block;
            }
            @media print { 
              body { margin: 0; padding: 5px; font-size: 11px; } 
              .admit-card { 
                border: 2px solid #000; 
                padding: 10px; 
                max-width: 100%;
                page-break-inside: avoid;
              }
              .institute-name { font-size: 16px; }
              .admit-title { font-size: 14px; margin: 10px 0; }
              .candidate-section, .instructions-section, .exam-details { 
                padding: 8px; margin-bottom: 8px; 
              }
              .info-item { margin-bottom: 6px; }
              .info-label { font-size: 10px; }
              .info-value { font-size: 11px; }
              .instructions-list li { margin-bottom: 3px; font-size: 9px; line-height: 1.2; }
              .section-title { font-size: 11px; margin-bottom: 6px; }
              .candidate-photo { width: 70px; height: 90px; }
              .photo-section { padding: 3px; }
              .exam-grid { gap: 8px; }
              .result-info { padding: 8px; margin: 8px 0; }
              .result-info h3 { font-size: 10px; margin-bottom: 4px; }
              .result-info p { font-size: 9px; }
            }
          </style>
        </head>
        <body>
          <div class="admit-card">
            <!-- Header Section -->
            <div class="header" style="background: linear-gradient(90deg, #1976d2, #0d47a1); color: white; padding: 16px; border-radius: 8px;">
              <div class="institute-name" style="color: white;">NIICT Computer Institute of IT Management</div>
              <div class="certification" style="color: #e3f2fd;">AN ISO 9001:2015 CERTIFIED ORGANIZATION</div>
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
                  
                </div>
              </div>
            </div>

            <!-- Instructions Section -->
            <div class="instructions-section">
              <div class="section-title">अभ्यर्थी हेतु आवश्यकता निर्देश</div>
              <ol class="instructions-list">
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
              <div class="section-title">EXAMINATION DETAILS</div>
              <div class="exam-grid">
                <div class="info-item">
                  <span class="info-label">Examination Date:</span>
                  <div class="info-value">12 Oct 2025 Sunday</div>
                </div>
                <div class="info-item">
                  <span class="info-label">Reporting Time:</span>
                  <div class="info-value">08:00 AM</div>
                </div>
                <div class="info-item">
                  <span class="info-label">Gate Closing Time:</span>
                  <div class="info-value">09:15 AM</div>
                </div>
                <div class="info-item">
                  <span class="info-label">Examination Time:</span>
                  <div class="info-value">10:00 AM</div>
                </div>
              </div>
            </div>

            <!-- Result Information -->
            <div class="result-info" style="background: #e8f5e8; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 5px solid #4caf50; text-align: center;">
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
    printWindow.onload = () => {
      setTimeout(() => {
        try { printWindow.focus(); } catch (_) {}
        printWindow.print();
      }, 200);
    };
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
            <Box sx={{ textAlign: 'center', mb: 4, pb: 2 }}>
              <Box sx={{
                display: 'inline-block',
                px: 3,
                py: 2,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #1976d2, #0d47a1)',
                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.2)'
              }}>
                <Typography variant="h5" fontWeight={800} color="#ffffff" gutterBottom sx={{ letterSpacing: 0.5 }}>
                  NIICT Computer Institute of IT Management
                </Typography>
                <Typography variant="body2" fontWeight={600} color="#e3f2fd">
                  AN ISO 9001:2015 CERTIFIED ORGANIZATION
                </Typography>
              </Box>
              <Box sx={{ mt: 2, borderBottom: '2px solid #1976d2' }} />
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
                उम्मीदवारों को परीक्षा के निर्धारित समय से आधा घंटा पहले रिपोर्ट करना अनिवार्य है।
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                परीक्षा प्रारंभ होने से 15 मिनट पहले ही परीक्षा कक्ष में प्रवेश की अनुमति है, और प्रारंभ होने के 30 मिनट बाद प्रवेश की अनुमति नहीं होगी।
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                उम्मीदवारों को मूल फोटो पहचान पत्र (मतदाता पहचान पत्र, पासपोर्ट, पैन, ड्राइविंग लाइसेंस, आधार, फोटो सहित छात्र पहचान पत्र आदि) साथ लाना आवश्यक है।
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                उम्मीदवार केवल अपना प्रवेश पत्र, मूल फोटो पहचान पत्र और एक पेन साथ लेकर आएं।
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                मोबाइल फोन या किसी भी प्रकार के इलेक्ट्रॉनिक उपकरण पूर्णतः प्रतिबंधित हैं और जब्त कर लिए जाएंगे। पॉकेटबुक, हैंडबैग, पुस्तकें, नोट्स, लिखित या मुद्रित सामग्री, सीडी या डेटा आदि लाना भी प्रतिबंधित है।
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
    <Box sx={{ 
      minHeight: '100vh', 
      pt: { xs: 12, md: 16 }, 
      pb: 12, 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Elements */}
      <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', zIndex: 0 }} />
      
      {/* Animated glowing particles */}
      <Box sx={{ position: 'absolute', top: '20%', left: '15%', width: 8, height: 8, borderRadius: '50%', background: '#fbbf24', boxShadow: '0 0 20px 4px rgba(251,191,36,0.6)', animation: 'pulse 3s infinite' }} />
      <Box sx={{ position: 'absolute', top: '60%', right: '20%', width: 12, height: 12, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 20px 4px rgba(56,189,248,0.6)', animation: 'pulse 4s infinite' }} />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        >
          <Paper elevation={0} sx={{ 
            p: { xs: 4, md: 8 }, 
            borderRadius: '32px', 
            background: 'rgba(255, 255, 255, 0.03)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
            color: 'white'
          }}>
            <Box textAlign="center" mb={6}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 90, 
                  height: 90, 
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                  boxShadow: '0 15px 30px -5px rgba(217, 119, 6, 0.4), inset 0 2px 4px rgba(255,255,255,0.4)',
                  mb: 4,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <FaTrophy size={44} color="#fff" />
                </Box>
              </motion.div>
              <Typography variant="h2" fontWeight={900} gutterBottom sx={{
                background: 'linear-gradient(to right, #ffffff, #a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-1px',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 2
              }}>
                GK & Computer Competition
              </Typography>
              <Typography variant="h6" color="rgba(255,255,255,0.7)" fontWeight={400} sx={{ maxWidth: '600px', mx: 'auto', mb: 5, lineHeight: 1.6 }}>
                Join our state-level competition, test your knowledge, and win exciting prizes & scholarships!
              </Typography>

              <Box sx={{ 
                background: 'rgba(255,255,255,0.05)',
                p: { xs: 3, md: 4 }, 
                borderRadius: '24px', 
                border: '1px solid rgba(255,255,255,0.1)',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(to bottom, #38bdf8, #818cf8)' }} />
                <Typography variant="h6" fontWeight={700} color="#e0e7ff" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <FaCalendarAlt color="#818cf8" />
                  Exam Details
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                      <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>
                        <FaClock size={24} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="rgba(255,255,255,0.5)" fontWeight={600} textTransform="uppercase" letterSpacing="1px" fontSize="0.75rem">Date & Time</Typography>
                        <Typography variant="body1" color="white" fontWeight={700} fontSize="1.1rem">20 Oct 2026, 8:00 AM</Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.6)">Reporting: 7:00 AM</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                      <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }}>
                        <FaMapMarkerAlt size={24} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="rgba(255,255,255,0.5)" fontWeight={600} textTransform="uppercase" letterSpacing="1px" fontSize="0.75rem">Exam Center</Typography>
                        <Typography variant="body1" color="white" fontWeight={700} fontSize="1.1rem">SK Modern Inter College</Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.6)">Semari, Jaunpur</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 4, borderRadius: '12px', '& .MuiAlert-icon': { alignItems: 'center' } }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Typography variant="h5" fontWeight={700} color="#ffffff" gutterBottom sx={{ mb: 4, mt: 2 }}>
                Applicant Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#818cf8' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#818cf8' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' } }}
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#818cf8' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' } }}
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#818cf8' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Aadhaar Number"
                    name="aadhaar"
                    value={formData.aadhaar}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/[^0-9]/g, '');
                      setFormData(prev => ({ ...prev, aadhaar: onlyDigits.slice(0, 12) }));
                    }}
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 12 }}
                    helperText="12-digit Aadhaar number (optional)"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#818cf8' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' } }}
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#818cf8' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' } }}
                  />
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="School/College Name *"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    required
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#818cf8' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' } }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth sx={{ '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' } }}>
                    <InputLabel sx={{ background: 'transparent', px: 1, '&.Mui-focused': { color: '#818cf8' } }}>Class Passed *</InputLabel>
                    <Select
                      name="classPassed"
                      value={formData.classPassed}
                      onChange={handleInputChange}
                      required
                      sx={{
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#818cf8' },
                        '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.7)' }
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
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Parent/Guardian Phone"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    helperText="Optional - if available"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#818cf8' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' } }}
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' }, '&.Mui-focused fieldset': { borderColor: '#818cf8' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& .MuiInputLabel-root.Mui-focused': { color: '#818cf8' } }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ 
                    p: 4, 
                    border: '2px dashed rgba(255,255,255,0.2)', 
                    borderRadius: '20px', 
                    background: 'rgba(255,255,255,0.02)',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#818cf8',
                      background: 'rgba(255,255,255,0.05)'
                    }
                  }}>
                    <Typography variant="subtitle1" fontWeight={600} color="white" gutterBottom>
                      Student Image (Optional)
                    </Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.6)" mb={3}>
                      Upload a clear passport size photograph (Max 5MB)
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
                          borderRadius: '12px',
                          px: 4,
                          py: 1.5,
                          borderWidth: '2px',
                          borderColor: 'rgba(255,255,255,0.3)',
                          color: 'white',
                          '&:hover': { borderWidth: '2px', borderColor: 'white', background: 'rgba(255,255,255,0.1)' }
                        }}
                      >
                        {uploadingImage ? 'Uploading...' : 'Choose Image'}
                      </Button>
                    </label>
                    {imagePreview && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Box sx={{ mt: 3, position: 'relative', display: 'inline-block' }}>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              width: '120px',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '12px',
                              border: '4px solid white',
                              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                            }}
                          />
                        </Box>
                      </motion.div>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Box textAlign="center" mt={5}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    borderRadius: '50px', 
                    py: 2, 
                    px: 6, 
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    letterSpacing: '0.5px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                    boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.4)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)',
                      boxShadow: '0 15px 25px -5px rgba(79, 70, 229, 0.5)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      <FaUserGraduate style={{ marginRight: '10px' }} size={20} />
                      Complete Registration
                    </>
                  )}
                </Button>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CompetitionForm;
