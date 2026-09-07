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
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Box display="flex" alignItems="center" mb={4} gap={2}>
              <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 10px 20px -5px rgba(37,99,235,0.4)', display: 'flex' }}>
                <FaStore size={28} color="#fff" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '0.5px' }}>
                  Franchise <span style={{ color: '#2563EB' }}>Details</span>
                </Typography>
                <Typography variant="body2" color="#64748B">
                  Review applicant profile, center infrastructure, and manage accreditation status.
                </Typography>
              </Box>
            </Box>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ background: '#F8FAFC', p: 3.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                    <Typography variant="h6" fontWeight={700} color="#0F172A" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.5px', mb: 3, fontSize: '0.95rem' }}>
                      Applicant Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Institute Name</Typography>
                        <Typography variant="h6" fontWeight={700} color="#0F172A">{selectedFranchise.instituteName}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Owner Name</Typography>
                        <Typography variant="h6" fontWeight={700} color="#0F172A">{selectedFranchise.ownerName}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase', display: 'block', mb: 0.5 }}>Status</Typography>
                        <Chip label={selectedFranchise.status.charAt(0).toUpperCase() + selectedFranchise.status.slice(1)}
                          sx={{
                            fontWeight: 700,
                            backgroundColor: selectedFranchise.status === 'approved' ? '#ECFDF5' : selectedFranchise.status === 'rejected' ? '#FEF2F2' : '#FFFBEB',
                            color: selectedFranchise.status === 'approved' ? '#059669' : selectedFranchise.status === 'rejected' ? '#DC2626' : '#D97706',
                            border: `1px solid ${selectedFranchise.status === 'approved' ? '#A7F3D0' : selectedFranchise.status === 'rejected' ? '#FECACA' : '#FDE68A'}`,
                            borderRadius: 2
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Email</Typography>
                        <Typography variant="h6" fontWeight={600} color="#2563EB">{selectedFranchise.email}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Primary Contact</Typography>
                        <Typography variant="body1" fontWeight={600} color="#0F172A">{selectedFranchise.contact1}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Secondary Contact</Typography>
                        <Typography variant="body1" fontWeight={600} color="#475569">{selectedFranchise.contact2 || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>WhatsApp</Typography>
                        <Typography variant="body1" fontWeight={600} color="#059669">{selectedFranchise.whatsapp || 'N/A'}</Typography>
                      </Grid>
                      {selectedFranchise.dob && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Date of Birth</Typography>
                          <Typography variant="body1" fontWeight={600} color="#0F172A">{new Date(selectedFranchise.dob).toLocaleDateString('en-GB')}</Typography>
                        </Grid>
                      )}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>PAN Number</Typography>
                        <Typography variant="body1" fontWeight={600} color="#0F172A">{selectedFranchise.pan || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>GST Number</Typography>
                        <Typography variant="body1" fontWeight={600} color="#0F172A">{selectedFranchise.gst || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Institute Address</Typography>
                        <Typography variant="body1" fontWeight={600} color="#0F172A">{selectedFranchise.instituteAddress}</Typography>
                      </Grid>
                      {selectedFranchise.ownerAddress && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Owner Address</Typography>
                          <Typography variant="body1" fontWeight={600} color="#0F172A">{selectedFranchise.ownerAddress}</Typography>
                        </Grid>
                      )}
                      <Grid item xs={4}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>District</Typography>
                        <Typography variant="body1" fontWeight={600} color="#0F172A">{selectedFranchise.district}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>State</Typography>
                        <Typography variant="body1" fontWeight={600} color="#0F172A">{selectedFranchise.state}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Pin Code</Typography>
                        <Typography variant="body1" fontWeight={600} color="#0F172A">{selectedFranchise.pinCode}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption" color="#64748B" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Applied On</Typography>
                        <Typography variant="body1" fontWeight={600} color="#0F172A">{new Date(selectedFranchise.applicationDate || selectedFranchise.createdAt).toLocaleDateString('en-GB')}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {selectedFranchise.status === 'pending' && (
                      <>
                        <Button variant="contained" size="large" onClick={() => handleStatusUpdate(selectedFranchise._id, 'approved')} startIcon={<FaCheck />} sx={{ background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', textTransform: 'none', fontWeight: 600, py: 1.5, borderRadius: 2, boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}>
                          Approve Application
                        </Button>
                        <Button variant="contained" size="large" onClick={() => handleStatusUpdate(selectedFranchise._id, 'rejected')} startIcon={<FaTimes />} sx={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff', textTransform: 'none', fontWeight: 600, py: 1.5, borderRadius: 2, boxShadow: '0 4px 12px rgba(239,68,68,0.25)' }}>
                          Reject Application
                        </Button>
                      </>
                    )}
                    {selectedFranchise.status === 'approved' && (
                      <Button variant="outlined" size="large" onClick={() => handleStatusUpdate(selectedFranchise._id, 'pending')} sx={{ borderColor: '#FDE68A', color: '#D97706', backgroundColor: '#FFFBEB', textTransform: 'none', fontWeight: 600, py: 1.5, borderRadius: 2, '&:hover': { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' } }}>
                        Revert to Pending
                      </Button>
                    )}
                    {selectedFranchise.status === 'rejected' && (
                      <Button variant="outlined" size="large" onClick={() => handleStatusUpdate(selectedFranchise._id, 'pending')} sx={{ borderColor: '#FDE68A', color: '#D97706', backgroundColor: '#FFFBEB', textTransform: 'none', fontWeight: 600, py: 1.5, borderRadius: 2, '&:hover': { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' } }}>
                        Reopen Application
                      </Button>
                    )}
                    <Button variant="outlined" size="large" onClick={() => handleDelete(selectedFranchise._id)} startIcon={<FaTrash />} sx={{ borderColor: '#FECACA', color: '#DC2626', backgroundColor: '#FEF2F2', textTransform: 'none', fontWeight: 600, py: 1.5, borderRadius: 2, '&:hover': { backgroundColor: '#FEE2E2', borderColor: '#EF4444' } }}>
                      Delete Application
                    </Button>
                    <Button variant="outlined" size="large" onClick={() => setShowDetails(false)} sx={{ borderColor: '#CBD5E1', color: '#475569', backgroundColor: '#FFFFFF', textTransform: 'none', fontWeight: 600, py: 1.5, borderRadius: 2, '&:hover': { backgroundColor: '#F8FAFC', borderColor: '#94A3B8' } }}>
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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          <Box display="flex" alignItems="center" mb={4} gap={2}>
            <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 10px 20px -5px rgba(37,99,235,0.4)', display: 'flex' }}>
              <FaStore size={28} color="#fff" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '0.5px' }}>
                Franchise <span style={{ color: '#2563EB' }}>Management</span>
              </Typography>
              <Typography variant="body2" color="#64748B">
                Manage partner study center registrations, applications, and verification.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3} mb={4}>
            {[
              { title: 'Total Applications', value: total, icon: <StoreIcon />, color: '#0284C7', bg: '#FFFFFF' },
              { title: 'Approved Centers', value: approved, icon: <AssignmentTurnedInIcon />, color: '#059669', bg: '#FFFFFF' },
              { title: 'Pending Approval', value: pending, icon: <PendingActionsIcon />, color: '#D97706', bg: '#FFFFFF' },
              { title: 'Rejected', value: rejected, icon: <CancelIcon />, color: '#DC2626', bg: '#FFFFFF' }
            ].map((metric, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ background: metric.bg, border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)', position: 'relative', overflow: 'hidden' }}>
                  <Box sx={{ position: 'absolute', top: -10, right: -10, color: `${metric.color}15`, transform: 'scale(2.5)' }}>
                    {metric.icon}
                  </Box>
                  <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                    <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                      {metric.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: metric.color, mt: 0.5 }}>
                      {metric.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ borderRadius: 3, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ background: '#F8FAFC' }}>
                  <TableRow>
                    {['Institute', 'Owner / Email', 'Contact', 'Location', 'Status', 'Actions'].map((header) => (
                      <TableCell key={header} sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {franchises.map((franchise) => (
                    <TableRow key={franchise._id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC !important' } }}>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Typography sx={{ color: '#0F172A', fontWeight: 700 }}>{franchise.instituteName}</Typography>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>{franchise.ownerName}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Typography sx={{ color: '#2563EB', fontWeight: 600 }}>{franchise.email}</Typography>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>{franchise.contact1}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#475569', fontWeight: 500, borderBottom: '1px solid #F1F5F9' }}>
                        {franchise.contact1}
                        {franchise.whatsapp && <Typography variant="caption" sx={{ color: '#059669', display: 'block', fontWeight: 600 }}>WA: {franchise.whatsapp}</Typography>}
                      </TableCell>
                      <TableCell sx={{ color: '#475569', borderBottom: '1px solid #F1F5F9' }}>{franchise.district}, {franchise.state}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Chip 
                          label={franchise.status.charAt(0).toUpperCase() + franchise.status.slice(1)}
                          sx={{ 
                            fontWeight: 700, 
                            backgroundColor: franchise.status === 'approved' ? '#ECFDF5' : franchise.status === 'rejected' ? '#FEF2F2' : '#FFFBEB',
                            color: franchise.status === 'approved' ? '#059669' : franchise.status === 'rejected' ? '#DC2626' : '#D97706',
                            border: `1px solid ${franchise.status === 'approved' ? '#A7F3D0' : franchise.status === 'rejected' ? '#FECACA' : '#FDE68A'}`,
                            borderRadius: 2
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Box display="flex" gap={1}>
                          <Button variant="outlined" size="small" onClick={() => handleViewDetails(franchise)} startIcon={<FaEye />} sx={{ color: '#2563EB', borderColor: '#BFDBFE', backgroundColor: '#EFF6FF', textTransform: 'none', fontWeight: 600, borderRadius: 1.5, '&:hover': { borderColor: '#2563EB', background: '#DBEAFE' } }}>
                            View
                          </Button>
                          {franchise.status === 'pending' && (
                            <>
                              <Button variant="outlined" size="small" onClick={() => handleStatusUpdate(franchise._id, 'approved')} startIcon={<FaCheck />} sx={{ color: '#059669', borderColor: '#A7F3D0', backgroundColor: '#ECFDF5', textTransform: 'none', fontWeight: 600, borderRadius: 1.5, '&:hover': { borderColor: '#059669', background: '#D1FAE5' } }}>
                                Approve
                              </Button>
                              <Button variant="outlined" size="small" onClick={() => handleStatusUpdate(franchise._id, 'rejected')} startIcon={<FaTimes />} sx={{ color: '#DC2626', borderColor: '#FECACA', backgroundColor: '#FEF2F2', textTransform: 'none', fontWeight: 600, borderRadius: 1.5, '&:hover': { borderColor: '#DC2626', background: '#FEE2E2' } }}>
                                Reject
                              </Button>
                            </>
                          )}
                          <Button variant="outlined" size="small" onClick={() => handleDelete(franchise._id)} startIcon={<FaTrash />} sx={{ color: '#DC2626', borderColor: '#FECACA', backgroundColor: '#FEF2F2', textTransform: 'none', fontWeight: 600, borderRadius: 1.5, '&:hover': { borderColor: '#DC2626', background: '#FEE2E2' } }}>
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
            <Box textAlign="center" py={6} sx={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', mt: 3 }}>
              <Typography variant="h6" color="#64748B" fontWeight={500}>No franchise applications yet.</Typography>
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default FranchiseManagement;
