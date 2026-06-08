import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, MenuItem, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkIcon from '@mui/icons-material/Work';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', type: 'Full-Time', salary: '', tags: ''
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(t => t);
      const payload = { ...formData, tags: tagsArray };
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setFormData({ title: '', company: '', location: '', type: 'Full-Time', salary: '', tags: '' });
        fetchJobs();
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE' });
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const inputSx = {
    input: { color: '#fff' },
    label: { color: '#94a3b8' },
    '& label.Mui-focused': { color: '#a78bfa' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&.Mui-focused fieldset': { borderColor: '#a78bfa', boxShadow: '0 0 10px rgba(167,139,250,0.2)' },
    },
    '& .MuiSelect-icon': { color: '#94a3b8' },
    '& .MuiSelect-select': { color: '#fff' }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1120', pt: 12, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={6} gap={2}>
          <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)', boxShadow: '0 0 20px rgba(167,139,250,0.4)', display: 'flex' }}>
            <WorkIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800} color="#fff" sx={{ letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
              Job <span style={{ color: '#a78bfa' }}>Management</span>
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: 4, background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h6" mb={4} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>Post a New Job</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField sx={inputSx} fullWidth label="Job Title" name="title" value={formData.title} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField sx={inputSx} fullWidth label="Company Name" name="company" value={formData.company} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField sx={inputSx} fullWidth label="Location" name="location" value={formData.location} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField sx={inputSx} select fullWidth label="Job Type" name="type" value={formData.type} onChange={handleInputChange} required>
                  {['Full-Time', 'Part-Time', 'Internship', 'Freelance'].map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField sx={inputSx} fullWidth label="Salary (e.g. ₹20k - ₹35k)" name="salary" value={formData.salary} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField sx={inputSx} fullWidth label="Tags (comma separated e.g. React, Node.js)" name="tags" value={formData.tags} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} mt={2}>
                <Button type="submit" variant="contained" size="large" fullWidth sx={{ background: 'linear-gradient(135deg, #a78bfa, #8b5cf6)', color: '#fff', py: 1.5, fontSize: '1.1rem', letterSpacing: '1px', '&:hover': { boxShadow: '0 0 20px rgba(167,139,250,0.4)' } }}>
                  Post Job
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography variant="h6" mb={3} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Job Postings</Typography>
        <Paper sx={{ borderRadius: 4, overflow: 'hidden', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'rgba(15,23,42,0.6)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Title</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Company</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Location & Type</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Salary</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Tags</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02) !important' } }}>
                    <TableCell sx={{ color: '#f8fafc', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{job.title}</TableCell>
                    <TableCell sx={{ color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{job.company}</TableCell>
                    <TableCell sx={{ color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{job.location} | <span style={{ color: '#a78bfa' }}>{job.type}</span></TableCell>
                    <TableCell sx={{ color: '#34d399', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{job.salary}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {job.tags.map((tag, i) => <Chip key={i} label={tag} size="small" sx={{ m: 0.5, background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' }} />)}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <IconButton color="error" onClick={() => handleDelete(job._id)} sx={{ color: '#f87171', background: 'rgba(248,113,113,0.1)', '&:hover': { background: 'rgba(248,113,113,0.2)' } }}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default JobManagement;
