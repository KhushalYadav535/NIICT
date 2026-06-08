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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <Box display="flex" alignItems="center" mb={4}>
        <WorkIcon sx={{ fontSize: 40, color: '#4a90e2', mr: 2 }} />
        <Typography variant="h4" fontWeight={700}>Job Portal Management</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" mb={3} fontWeight={600}>Post a New Job</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Job Title" name="title" value={formData.title} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Company Name" name="company" value={formData.company} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Location" name="location" value={formData.location} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Job Type" name="type" value={formData.type} onChange={handleInputChange} required>
                {['Full-Time', 'Part-Time', 'Internship', 'Freelance'].map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Salary (e.g. ₹20k - ₹35k)" name="salary" value={formData.salary} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Tags (comma separated e.g. React, Node.js)" name="tags" value={formData.tags} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large" sx={{ borderRadius: 2 }}>Post Job</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#f0f9ff' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Location & Type</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Salary</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tags</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.location} | {job.type}</TableCell>
                  <TableCell>{job.salary}</TableCell>
                  <TableCell>
                    {job.tags.map((tag, i) => <Chip key={i} label={tag} size="small" sx={{ m: 0.5 }} />)}
                  </TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(job._id)}><DeleteIcon /></IconButton>
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

export default JobManagement;
