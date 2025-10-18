import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Box, Card, CardContent, Grid, Chip, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { FaSearch, FaTrophy, FaMedal, FaStar, FaQuoteLeft } from 'react-icons/fa';

const Results = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [top3Students, setTop3Students] = useState([]);
  const [loadingTop3, setLoadingTop3] = useState(false);

  // Sample inspirational quotes
  const quotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "Education is the passport to the future, for tomorrow belongs to those who prepare for it today. - Malcolm X",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
    "The expert in anything was once a beginner. - Helen Hayes",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it."
  ];

  const [currentQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  // Fetch top 3 students on component mount
  useEffect(() => {
    fetchTop3Students();
  }, []);

  const fetchTop3Students = async () => {
    setLoadingTop3(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      
      const response = await fetch(`${API_BASE_URL}/api/results/top3`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setTop3Students(data.data);
      }
    } catch (err) {
      console.error('Error fetching top 3 students:', err);
    } finally {
      setLoadingTop3(false);
    }
  };

  const handleSearch = async () => {
    if (!rollNumber.trim()) {
      setError('Please enter a roll number');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      
      const response = await fetch(`${API_BASE_URL}/api/results/search/${rollNumber.trim()}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'No result found for this roll number. Please check and try again.');
      }
      
    } catch (err) {
      setError('Failed to fetch result. Please check your internet connection and try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy style={{ color: '#FFD700' }} />;
    if (rank === 2) return <FaMedal style={{ color: '#C0C0C0' }} />;
    if (rank === 3) return <FaMedal style={{ color: '#CD7F32' }} />;
    return <FaStar style={{ color: '#4CAF50' }} />;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#4CAF50';
  };

  const getGradeColor = (marks) => {
    if (marks >= 90) return '#4CAF50'; // Green
    if (marks >= 80) return '#2196F3'; // Blue
    if (marks >= 70) return '#FF9800'; // Orange
    if (marks >= 60) return '#FF5722'; // Red-Orange
    return '#F44336'; // Red
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section */}
        <Box textAlign="center" mb={6}>
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Box sx={{ 
              display: 'inline-block',
              p: 3,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
              mb: 3
            }}>
              <FaTrophy size={80} color="white" />
            </Box>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Typography variant="h2" fontWeight={800} sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Competition Results
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Typography variant="h5" color="#64748b" sx={{ 
              maxWidth: 700, 
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6
            }}>
              🎯 Check your competition exam results by entering your roll number
            </Typography>
          </motion.div>
        </Box>

        {/* Results Announcement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Paper 
            elevation={8} 
            sx={{ 
              p: 5, 
              mb: 5, 
              borderRadius: 6, 
              background: 'linear-gradient(135deg, #10b981 0%, #22d3ee 50%, #06b6d4 100%)',
              color: 'white',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {/* Animated background elements */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                zIndex: 0
              }}
            />
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1.1, 1, 1.1]
              }}
              transition={{ 
                rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 80,
                height: 80,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                zIndex: 0
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ y: -20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.0, type: "spring", stiffness: 200 }}
              >
                <Box sx={{ 
                  display: 'inline-block',
                  p: 2,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  mb: 3
                }}>
                  <FaTrophy size={70} style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
                </Box>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Typography variant="h3" fontWeight={800} gutterBottom sx={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  fontSize: { xs: '2rem', md: '3rem' }
                }}>
                  🎉 Results Are Now Available! 🎉
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <Box sx={{ 
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 3,
                  p: 3,
                  mb: 3,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Typography variant="h4" fontWeight={700} sx={{ mb: 1, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    📅 Published on 18th October 2024
                  </Typography>
                  <Typography variant="h5" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    🕐 12:00 PM
                  </Typography>
                </Box>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                <Typography variant="h6" sx={{ 
                  opacity: 0.95,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  maxWidth: 700,
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontWeight: 400
                }}>
                  🏆 Competition results are now live! Enter your roll number below to view your result. 
                  Congratulations to all participants for their hard work and dedication!
                </Typography>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>

        {/* Inspirational Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 3, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textAlign: 'center'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <FaQuoteLeft size={24} style={{ marginBottom: '12px', opacity: 0.8 }} />
              <Typography variant="h6" fontStyle="italic" sx={{ lineHeight: 1.6 }}>
                "{currentQuote}"
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <Paper elevation={6} sx={{ 
            p: 5, 
            mb: 5, 
            borderRadius: 6, 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <Typography variant="h4" fontWeight={700} color="#1e293b" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 4
            }}>
              <Box sx={{ 
                p: 1.5,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <FaSearch size={24} />
              </Box>
              Search Your Result
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mt: 3 }}>
              <TextField
                fullWidth
                label="Enter Roll Number"
                placeholder="e.g., 1158, GK1158, 1134"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'white',
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '1.1rem'
                  }
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                variant="contained"
                size="large"
                onClick={handleSearch}
                disabled={loading}
                sx={{ 
                  borderRadius: 3, 
                  px: 5,
                  py: 2,
                  minWidth: 160,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    background: '#ccc',
                    boxShadow: 'none'
                  }
                }}
                startIcon={<FaSearch />}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Box>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Alert 
                  severity={error.includes('18th October') ? 'info' : 'error'} 
                  sx={{ 
                    mt: 3, 
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    '& .MuiAlert-message': {
                      fontWeight: 500
                    }
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </Paper>
        </motion.div>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={6} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 6 }}>
              {/* Result Header */}
              <Box sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                p: 4, 
                textAlign: 'center' 
              }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  🎉 Congratulations! 🎉
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Competition Exam Result - {result.examDate}
                </Typography>
              </Box>

              {/* Result Content */}
              <Box sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  {/* Student Information */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FaStar color="#4CAF50" />
                          Student Information
                        </Typography>
                        
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="#64748b">Roll Number</Typography>
                            <Typography variant="h6" fontWeight={600} color="#1e293b">
                              {result.rollNumber}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="#64748b">Student Name</Typography>
                            <Typography variant="h6" fontWeight={600} color="#1e293b">
                              {result.name}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="#64748b">Father's Name</Typography>
                            <Typography variant="h6" fontWeight={600} color="#1e293b">
                              {result.fatherName}
                            </Typography>
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="#64748b">Subject</Typography>
                            <Chip 
                              label={result.subject} 
                              color="primary" 
                              variant="filled"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Performance Information */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} color="#1e293b" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getRankIcon(result.rank)}
                          Performance Details
                        </Typography>
                        
                        <Box sx={{ mt: 2 }}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="#64748b">Rank</Typography>
                            <Typography 
                              variant="h4" 
                              fontWeight={700} 
                              sx={{ color: getRankColor(result.rank) }}
                            >
                              #{result.rank}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="#64748b">Marks Obtained</Typography>
                            <Typography 
                              variant="h4" 
                              fontWeight={700} 
                              sx={{ color: getGradeColor(result.marks) }}
                            >
                              {result.marks}/100
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="#64748b">Status</Typography>
                            <Chip 
                              label={result.status} 
                              color="success" 
                              variant="filled"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="#64748b">Exam Date</Typography>
                            <Typography variant="h6" fontWeight={600} color="#1e293b">
                              {new Date(result.examDate).toLocaleDateString('en-GB')}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Achievement Message */}
                <Box sx={{ mt: 4, p: 3, background: 'linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)', borderRadius: 3, textAlign: 'center' }}>
                  <Typography variant="h6" color="#2e7d32" fontWeight={600} gutterBottom>
                    🏆 Outstanding Performance! 🏆
                  </Typography>
                  <Typography variant="body1" color="#333">
                    {result.name}, you have achieved an excellent result in the {result.subject} competition. 
                    Your dedication and hard work have paid off. Keep up the great work!
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        )}

        {/* Top 3 Students Display */}
        {top3Students.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Paper elevation={8} sx={{ 
              p: 5, 
              mb: 5, 
              borderRadius: 6, 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <Typography variant="h3" fontWeight={800} color="white" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 3,
                mb: 5,
                textAlign: 'center',
                justifyContent: 'center',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}>
                <Box sx={{ 
                  p: 2,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(255, 215, 0, 0.4)'
                }}>
                  <FaTrophy size={36} />
                </Box>
                🏆 Top 3 Performers 🏆
              </Typography>
              
              <Grid container spacing={3}>
                {top3Students.map((student, index) => (
                  <Grid item xs={12} md={4} key={student.rollNumber}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card sx={{ 
                        height: '100%', 
                        background: index === 0 
                          ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
                          : index === 1 
                          ? 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)'
                          : 'linear-gradient(135deg, #CD7F32 0%, #B8860B 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                          transition: 'all 0.3s ease'
                        }
                      }}>
                        {/* Rank Badge */}
                        <Box sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '50%',
                          width: 50,
                          height: 50,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(255, 255, 255, 0.3)'
                        }}>
                          <Typography variant="h6" fontWeight={800}>
                            #{student.rank}
                          </Typography>
                        </Box>

                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                          {/* Medal Icon */}
                          <Box sx={{ mb: 3 }}>
                            {index === 0 && <FaTrophy size={50} style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />}
                            {index === 1 && <FaMedal size={50} style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />}
                            {index === 2 && <FaMedal size={50} style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />}
                          </Box>

                          {/* Student Name */}
                          <Typography variant="h4" fontWeight={800} gutterBottom sx={{ 
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            mb: 2,
                            fontSize: { xs: '1.5rem', md: '1.8rem' }
                          }}>
                            {student.name}
                          </Typography>

                          {/* Father's Name */}
                          <Typography variant="h6" fontWeight={600} sx={{ 
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                            mb: 3,
                            opacity: 0.95,
                            fontSize: { xs: '1rem', md: '1.2rem' }
                          }}>
                            Son/Daughter of: {student.fatherName}
                          </Typography>

                          {/* Roll Number */}
                          <Box sx={{ 
                            mb: 3,
                            background: 'rgba(255, 255, 255, 0.25)',
                            borderRadius: 3,
                            p: 2,
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)'
                          }}>
                            <Typography variant="body1" sx={{ 
                              opacity: 1,
                              fontWeight: 600,
                              fontSize: '1.1rem'
                            }}>
                              Roll Number: {student.rollNumber}
                            </Typography>
                          </Box>

                          {/* Marks */}
                          <Typography variant="h3" fontWeight={900} sx={{ 
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            mb: 2,
                            fontSize: { xs: '2rem', md: '2.5rem' }
                          }}>
                            {student.marks}/100
                          </Typography>

                          {/* Subject */}
                          <Chip 
                            label={student.subject} 
                            sx={{ 
                              background: 'rgba(255, 255, 255, 0.3)',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '1rem',
                              backdropFilter: 'blur(10px)',
                              border: '2px solid rgba(255, 255, 255, 0.4)',
                              px: 2,
                              py: 1
                            }}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {/* Congratulations Message */}
              <Box sx={{ 
                mt: 5, 
                p: 4, 
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.2) 100%)', 
                borderRadius: 4, 
                textAlign: 'center',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255, 215, 0, 0.4)',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.2)'
              }}>
                <Typography variant="h5" fontWeight={700} sx={{ 
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  mb: 2,
                  color: 'white',
                  fontSize: { xs: '1.3rem', md: '1.5rem' }
                }}>
                  🎉 Congratulations to our Top Performers! 🎉
                </Typography>
                <Typography variant="h6" sx={{ 
                  opacity: 0.95,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}>
                  These students have shown exceptional dedication and achieved outstanding results in the competition.
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
        >
          <Paper elevation={4} sx={{ 
            p: 4, 
            mt: 5, 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }}>
            <Typography variant="h5" fontWeight={700} color="#1e293b" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mb: 3
            }}>
              <Box sx={{ 
                p: 1,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                color: 'white'
              }}>
                📋
              </Box>
              Important Information
            </Typography>
            <Box component="ol" sx={{ 
              pl: 3, 
              color: '#64748b',
              '& li': {
                mb: 2,
                fontSize: '1.1rem',
                lineHeight: 1.6,
                '& strong': {
                  color: '#1e293b',
                  fontWeight: 700
                }
              }
            }}>
              <li>Results were announced on <strong>18th October 2024 at 12:00 PM</strong></li>
              <li>You can search for your result using your roll number (format: 1158 or GK1158)</li>
              <li>Make sure you have your correct roll number ready</li>
              <li>If you don't remember your roll number, contact the institute</li>
              <li>Results are now live and available for viewing</li>
            </Box>
          </Paper>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Results;
