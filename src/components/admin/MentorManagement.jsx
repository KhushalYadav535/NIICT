import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';

const MentorManagement = () => {
  const [mentors, setMentors] = useState([]);
  const [formData, setFormData] = useState({ name: '', role: '', nextAvailable: '' });
  const [file, setFile] = useState(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '';
      if (file) {
        const fileData = new FormData();
        fileData.append('media', file);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload-media`, {
          method: 'POST',
          body: fileData
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.fileUrl;
      }

      const payload = { ...formData, image: imageUrl };
      const response = await fetch(`${API_BASE_URL}/api/mentors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setFormData({ name: '', role: '', nextAvailable: '' });
        setFile(null);
        fetchMentors();
      }
    } catch (error) {
      console.error('Error adding mentor:', error);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <Box display="flex" alignItems="center" mb={4}>
        <PeopleIcon sx={{ fontSize: 40, color: '#4a90e2', mr: 2 }} />
        <Typography variant="h4" fontWeight={700}>Mentor Management</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" mb={3} fontWeight={600}>Add New Mentor</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Role/Expertise" name="role" value={formData.role} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Next Available (e.g. Today, 4:00 PM)" name="nextAvailable" value={formData.nextAvailable} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5 }}>
                {file ? file.name : "Upload Profile Image"}
                <input type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ borderRadius: 2, height: '100%' }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Add Mentor'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#f0f9ff' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Availability</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mentors.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {item.image && <img src={item.image} alt="Mentor" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.nextAvailable}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(item._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default MentorManagement;
