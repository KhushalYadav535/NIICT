import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, CircularProgress, Link } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';

const PaperManagement = () => {
  const [papers, setPapers] = useState([]);
  const [formData, setFormData] = useState({ title: '', type: 'PDF' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/papers`);
      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.error('Error fetching papers:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
    setLoading(true);
    try {
      const fileData = new FormData();
      fileData.append('media', file);
      const uploadRes = await fetch(`${API_BASE_URL}/api/upload-media`, {
        method: 'POST',
        body: fileData
      });
      const uploadData = await uploadRes.json();
      const fileUrl = uploadData.fileUrl;

      const payload = { ...formData, fileUrl };
      const response = await fetch(`${API_BASE_URL}/api/papers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setFormData({ title: '', type: 'PDF' });
        setFile(null);
        fetchPapers();
      }
    } catch (error) {
      console.error('Error adding paper:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this paper?')) {
      try {
        await fetch(`${API_BASE_URL}/api/papers/${id}`, { method: 'DELETE' });
        fetchPapers();
      } catch (error) {
        console.error('Error deleting paper:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <Box display="flex" alignItems="center" mb={4}>
        <DescriptionIcon sx={{ fontSize: 40, color: '#4a90e2', mr: 2 }} />
        <Typography variant="h4" fontWeight={700}>Previous Papers Management</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" mb={3} fontWeight={600}>Upload New Paper</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Paper Title (e.g. CCC 2023)" name="title" value={formData.title} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField fullWidth label="Format Type" name="type" value={formData.type} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5 }}>
                {file ? file.name : "Select Document (PDF)"}
                <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large" sx={{ borderRadius: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Upload Paper'}
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
                <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Format</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Document</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {papers.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Link href={item.fileUrl} target="_blank" rel="noopener">View File</Link>
                  </TableCell>
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

export default PaperManagement;
