import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';

const MentorManagement = () => {
  const [mentors, setMentors] = useState([]);
  const [formData, setFormData] = useState({ name: '', role: '', nextAvailable: '' });
  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mentors`);
      const data = await response.json();
      setMentors(data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      name: item.name || '',
      role: item.role || '',
      nextAvailable: item.nextAvailable || ''
    });
    setExistingImage(item.image || '');
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setExistingImage('');
    setFormData({ name: '', role: '', nextAvailable: '' });
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = existingImage;
      if (file) {
        const fileData = new FormData();
        fileData.append('media', file);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload-media`, {
          method: 'POST',
          body: fileData
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.secure_url || uploadData.fileUrl || uploadData.url;
      }

      const payload = { ...formData, image: imageUrl };
      const url = editId ? `${API_BASE_URL}/api/mentors/${editId}` : `${API_BASE_URL}/api/mentors`;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        handleCancel();
        fetchMentors();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to save mentor');
      }
    } catch (error) {
      console.error('Error saving mentor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      try {
        await fetch(`${API_BASE_URL}/api/mentors/${id}`, { method: 'DELETE' });
        fetchMentors();
      } catch (error) {
        console.error('Error deleting mentor:', error);
      }
    }
  };

  const inputSx = {
    input: { color: '#0F172A' },
    label: { color: '#64748B' },
    '& label.Mui-focused': { color: '#0284C7', fontWeight: 600 },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      '& fieldset': { borderColor: '#CBD5E1' },
      '&:hover fieldset': { borderColor: '#94A3B8' },
      '&.Mui-focused fieldset': { borderColor: '#0284C7', borderWidth: '2px', boxShadow: '0 0 0 4px rgba(2,132,199,0.1)' },
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(2,132,199,0.05) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={4} gap={2}>
          <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #0284C7, #0369A1)', boxShadow: '0 10px 20px -5px rgba(2,132,199,0.4)', display: 'flex' }}>
            <PeopleIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '0.5px' }}>
              Mentor <span style={{ color: '#0284C7' }}>Management</span>
            </Typography>
            <Typography variant="body2" color="#64748B">
              Manage faculty mentors, subject matter experts, and 1-on-1 availability.
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 5, borderRadius: 3, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <Typography variant="h6" mb={3} sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>
            {editId ? '✏️ Edit Mentor Profile' : 'Add New Mentor'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={4}>
                <TextField sx={inputSx} fullWidth label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField sx={inputSx} fullWidth label="Role/Expertise" name="role" value={formData.role} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField sx={inputSx} fullWidth label="Next Available (e.g. Today, 4:00 PM)" name="nextAvailable" value={formData.nextAvailable} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="outlined" component="label" fullWidth sx={{ py: 1.4, borderColor: '#CBD5E1', color: '#475569', backgroundColor: '#F8FAFC', textTransform: 'none', fontWeight: 600, borderRadius: 2, '&:hover': { borderColor: '#0284C7', backgroundColor: '#F0F9FF' } }}>
                  {file ? file.name : (existingImage ? "Change Profile Image (Current attached ✓)" : "Upload Profile Image")}
                  <input type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" gap={2} sx={{ height: '100%' }}>
                  <Button type="submit" variant="contained" fullWidth size="large" sx={{ borderRadius: 2, height: '100%', py: 1.3, textTransform: 'none', fontWeight: 700, background: 'linear-gradient(135deg, #0284C7, #0369A1)', color: '#fff', boxShadow: '0 4px 12px rgba(2,132,199,0.25)', '&:hover': { background: 'linear-gradient(135deg, #0369A1, #075985)' } }} disabled={loading}>
                    {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (editId ? 'Update Mentor' : 'Add Mentor')}
                  </Button>
                  {editId && (
                    <Button variant="outlined" onClick={handleCancel} size="large" sx={{ borderColor: '#CBD5E1', color: '#64748B', px: 3, textTransform: 'none', fontWeight: 600, borderRadius: 2, '&:hover': { borderColor: '#EF4444', color: '#DC2626', backgroundColor: '#FEF2F2' } }}>
                      Cancel
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography variant="h6" mb={2.5} sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>Faculty & Mentors ({mentors.length})</Typography>
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Photo</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Name</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Role</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Availability</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mentors.map((item) => (
                  <TableRow key={item._id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC !important' } }}>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      {item.image ? (
                        <Box component="img" src={item.image} alt="Mentor" sx={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0' }} />
                      ) : (
                        <Box sx={{ width: 42, height: 42, borderRadius: '50%', background: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '11px', fontWeight: 600 }}>N/A</Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#0F172A', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>{item.name}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Box component="span" sx={{ display: 'inline-block', px: 1.5, py: 0.3, borderRadius: 2, background: '#F0F9FF', color: '#0284C7', border: '1px solid #BAE6FD', fontWeight: 600, fontSize: '0.8rem' }}>
                        {item.role}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontWeight: 500, borderBottom: '1px solid #F1F5F9' }}>{item.nextAvailable}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap' }}>
                      <IconButton onClick={() => handleEdit(item)} sx={{ color: '#0284C7', background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 1.5, mr: 1, '&:hover': { background: '#E0F2FE' } }} title="Edit Mentor" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item._id)} sx={{ color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 1.5, '&:hover': { background: '#FEE2E2' } }} title="Delete Mentor" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {mentors.length === 0 && (
          <Box textAlign="center" py={6} sx={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', mt: 3 }}>
            <Typography variant="h6" color="#64748B" fontWeight={500}>No faculty mentors registered yet.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MentorManagement;
