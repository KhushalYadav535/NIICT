import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { FaStore, FaCheck, FaTimes, FaTrash, FaEye } from 'react-icons/fa';
import StoreIcon from '@mui/icons-material/Store';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';

const FranchiseManagement = () => {
  const [franchises, setFranchises] = useState([]);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchFranchises();
  }, []);

  const fetchFranchises = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/franchise`);
      const data = await response.json();
      setFranchises(data);
    } catch (error) {
      console.error('Error fetching franchises:', error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/franchise/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchFranchises();
        if (selectedFranchise && selectedFranchise._id === id) {
          setSelectedFranchise(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this franchise application?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/franchise/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchFranchises();
          if (selectedFranchise && selectedFranchise._id === id) {
            setShowDetails(false);
            setSelectedFranchise(null);
          }
        }
      } catch (error) {
        console.error('Error deleting franchise:', error);
      }
    }
  };

  const handleViewDetails = (franchise) => {
    setSelectedFranchise(franchise);
    setShowDetails(true);
  };

  const total = franchises.length;
  const approved = franchises.filter(f => f.status === 'approved').length;
  const pending = franchises.filter(f => f.status === 'pending').length;
  const rejected = franchises.filter(f => f.status === 'rejected').length;

  if (showDetails && selectedFranchise) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1120', pt: 12, pb: 8 }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Box display="flex" alignItems="center" mb={6} gap={2}>
              <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #38bdf8, #3b82f6)', boxShadow: '0 0 20px rgba(56,189,248,0.4)', display: 'flex' }}>
                <FaStore size={32} color="#fff" />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={800} color="#fff" sx={{ letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
                  Franchise <span style={{ color: '#38bdf8' }}>Details</span>
                </Typography>
              </Box>
            </Box>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ background: 'rgba(15,23,42,0.6)', p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Typography variant="h6" fontWeight={600} color="#fff" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '1px', mb: 3 }}>
                      Applicant Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Institute Name</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.instituteName}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Owner Name</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.ownerName}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Status</Typography>
                        <Chip label={selectedFranchise.status.charAt(0).toUpperCase() + selectedFranchise.status.slice(1)}
                          sx={{
                            fontWeight: 600,
                            backgroundColor: selectedFranchise.status === 'approved' ? 'rgba(52,211,153,0.1)' : selectedFranchise.status === 'rejected' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                            color: selectedFranchise.status === 'approved' ? '#34d399' : selectedFranchise.status === 'rejected' ? '#f87171' : '#fbbf24',
                            border: `1px solid ${selectedFranchise.status === 'approved' ? '#34d399' : selectedFranchise.status === 'rejected' ? '#f87171' : '#fbbf24'}40`,
                            borderRadius: 2
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">Email</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.email}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="#94a3b8">Primary Contact</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.contact1}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="#94a3b8">Secondary Contact</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.contact2 || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="#94a3b8">WhatsApp</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.whatsapp || 'N/A'}</Typography>
                      </Grid>
                      {selectedFranchise.dob && (
                        <Grid item xs={6}>
                          <Typography variant="body2" color="#94a3b8">Date of Birth</Typography>
                          <Typography variant="h6" fontWeight={600} color="#fff">{new Date(selectedFranchise.dob).toLocaleDateString('en-GB')}</Typography>
                        </Grid>
                      )}
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">PAN Number</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.pan || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="#94a3b8">GST Number</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.gst || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="#94a3b8">Institute Address</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.instituteAddress}</Typography>
                      </Grid>
                      {selectedFranchise.ownerAddress && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="#94a3b8">Owner Address</Typography>
                          <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.ownerAddress}</Typography>
                        </Grid>
                      )}
                      <Grid item xs={4}>
                        <Typography variant="body2" color="#94a3b8">District</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.district}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="#94a3b8">State</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.state}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="#94a3b8">Pin Code</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{selectedFranchise.pinCode}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="#94a3b8">Applied On</Typography>
                        <Typography variant="h6" fontWeight={600} color="#fff">{new Date(selectedFranchise.applicationDate || selectedFranchise.createdAt).toLocaleDateString('en-GB')}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {selectedFranchise.status === 'pending' && (
                      <>
                        <Button variant="contained" size="large" onClick={() => handleStatusUpdate(selectedFranchise._id, 'approved')} startIcon={<FaCheck />} sx={{ background: 'linear-gradient(135deg, #34d399, #10b981)', color: '#fff', '&:hover': { boxShadow: '0 0 20px rgba(52,211,153,0.4)' } }}>
                          Approve Application
                        </Button>
                        <Button variant="contained" size="large" onClick={() => handleStatusUpdate(selectedFranchise._id, 'rejected')} startIcon={<FaTimes />} sx={{ background: 'linear-gradient(135deg, #f87171, #ef4444)', color: '#fff', '&:hover': { boxShadow: '0 0 20px rgba(248,113,113,0.4)' } }}>
                          Reject Application
                        </Button>
                      </>
                    )}
                    {selectedFranchise.status === 'approved' && (
                      <Button variant="outlined" color="warning" size="large" onClick={() => handleStatusUpdate(selectedFranchise._id, 'pending')} sx={{ borderColor: '#fbbf24', color: '#fbbf24', '&:hover': { background: 'rgba(251,191,36,0.1)' } }}>
                        Revert to Pending
                      </Button>
                    )}
                    {selectedFranchise.status === 'rejected' && (
                      <Button variant="outlined" color="warning" size="large" onClick={() => handleStatusUpdate(selectedFranchise._id, 'pending')} sx={{ borderColor: '#fbbf24', color: '#fbbf24', '&:hover': { background: 'rgba(251,191,36,0.1)' } }}>
                        Reopen Application
                      </Button>
                    )}
                    <Button variant="outlined" size="large" onClick={() => handleDelete(selectedFranchise._id)} startIcon={<FaTrash />} sx={{ borderColor: '#f87171', color: '#f87171', '&:hover': { background: 'rgba(248,113,113,0.1)' } }}>
                      Delete Application
                    </Button>
                    <Button variant="outlined" size="large" onClick={() => setShowDetails(false)} sx={{ borderColor: '#64748b', color: '#cbd5e1', '&:hover': { background: 'rgba(100,116,139,0.1)', borderColor: '#cbd5e1' } }}>
                      Back to List
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1120', pt: 12, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          
          <Box display="flex" alignItems="center" mb={6} gap={2}>
            <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #38bdf8, #3b82f6)', boxShadow: '0 0 20px rgba(56,189,248,0.4)', display: 'flex' }}>
              <FaStore size={32} color="#fff" />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={800} color="#fff" sx={{ letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
                Franchise <span style={{ color: '#38bdf8' }}>Management</span>
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3} mb={6}>
            {[
              { title: 'Total Applications', value: total, icon: <StoreIcon />, color: '#38bdf8', gradient: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(59,130,246,0.05))' },
              { title: 'Approved', value: approved, icon: <AssignmentTurnedInIcon />, color: '#34d399', gradient: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.05))' },
              { title: 'Pending', value: pending, icon: <PendingActionsIcon />, color: '#fbbf24', gradient: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.05))' },
              { title: 'Rejected', value: rejected, icon: <CancelIcon />, color: '#f87171', gradient: 'linear-gradient(135deg, rgba(248,113,113,0.2), rgba(239,68,68,0.05))' }
            ].map((metric, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ background: metric.gradient, border: `1px solid ${metric.color}40`, backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: `0 0 30px ${metric.color}15`, position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: -20, right: -20, color: `${metric.color}20`, transform: 'scale(3)' }}>
                    {metric.icon}
                  </Box>
                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                    <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', mb: 1 }}>
                      {metric.title}
                    </Typography>
                    <Typography variant="h2" fontWeight={800} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif' }}>
                      {metric.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ borderRadius: 4, overflow: 'hidden', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ background: 'rgba(15,23,42,0.6)' }}>
                  <TableRow>
                    {['Institute', 'Owner / Email', 'Contact', 'Location', 'Status', 'Actions'].map((header) => (
                      <TableCell key={header} sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {franchises.map((franchise) => (
                    <TableRow key={franchise._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02) !important' } }}>
                      <TableCell>
                        <Typography sx={{ color: '#fff', fontWeight: 500 }}>{franchise.instituteName}</Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>{franchise.ownerName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ color: '#fff', fontWeight: 500 }}>{franchise.email}</Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>{franchise.contact1}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        {franchise.contact1}
                        {franchise.whatsapp && <Typography variant="body2" sx={{ color: '#94a3b8' }}>WA: {franchise.whatsapp}</Typography>}
                      </TableCell>
                      <TableCell sx={{ color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{franchise.district}, {franchise.state}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Chip 
                          label={franchise.status.charAt(0).toUpperCase() + franchise.status.slice(1)}
                          sx={{ 
                            fontWeight: 600, 
                            backgroundColor: franchise.status === 'approved' ? 'rgba(52,211,153,0.1)' : franchise.status === 'rejected' ? 'rgba(248,113,113,0.1)' : 'rgba(251,191,36,0.1)',
                            color: franchise.status === 'approved' ? '#34d399' : franchise.status === 'rejected' ? '#f87171' : '#fbbf24',
                            border: `1px solid ${franchise.status === 'approved' ? '#34d399' : franchise.status === 'rejected' ? '#f87171' : '#fbbf24'}40`,
                            borderRadius: 2
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box display="flex" gap={1}>
                          <Button variant="outlined" size="small" onClick={() => handleViewDetails(franchise)} startIcon={<FaEye />} sx={{ color: '#38bdf8', borderColor: '#38bdf850', '&:hover': { borderColor: '#38bdf8', background: 'rgba(56,189,248,0.1)' } }}>
                            View
                          </Button>
                          {franchise.status === 'pending' && (
                            <>
                              <Button variant="outlined" size="small" onClick={() => handleStatusUpdate(franchise._id, 'approved')} startIcon={<FaCheck />} sx={{ color: '#34d399', borderColor: '#34d39950', '&:hover': { borderColor: '#34d399', background: 'rgba(52,211,153,0.1)' } }}>
                                Approve
                              </Button>
                              <Button variant="outlined" size="small" onClick={() => handleStatusUpdate(franchise._id, 'rejected')} startIcon={<FaTimes />} sx={{ color: '#f87171', borderColor: '#f8717150', '&:hover': { borderColor: '#f87171', background: 'rgba(248,113,113,0.1)' } }}>
                                Reject
                              </Button>
                            </>
                          )}
                          <Button variant="outlined" size="small" onClick={() => handleDelete(franchise._id)} startIcon={<FaTrash />} sx={{ color: '#f87171', borderColor: '#f8717150', '&:hover': { borderColor: '#f87171', background: 'rgba(248,113,113,0.1)' } }}>
                            Delete
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {franchises.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="#64748b">No franchise applications yet.</Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default FranchiseManagement;
