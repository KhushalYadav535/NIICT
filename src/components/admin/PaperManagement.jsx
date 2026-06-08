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

  const inputSx = {
    input: { color: '#fff' },
    label: { color: '#94a3b8' },
    '& label.Mui-focused': { color: '#c084fc' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&.Mui-focused fieldset': { borderColor: '#c084fc', boxShadow: '0 0 10px rgba(192,132,252,0.2)' },
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1120', pt: 12, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(192,132,252,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={6} gap={2}>
          <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #c084fc, #9333ea)', boxShadow: '0 0 20px rgba(192,132,252,0.4)', display: 'flex' }}>
            <DescriptionIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800} color="#fff" sx={{ letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
              Papers <span style={{ color: '#c084fc' }}>Management</span>
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: 4, background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h6" mb={4} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>Upload New Paper</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField sx={inputSx} fullWidth label="Paper Title (e.g. CCC 2023)" name="title" value={formData.title} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField sx={inputSx} fullWidth label="Format Type" name="type" value={formData.type} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderColor: '#64748b', color: '#cbd5e1', '&:hover': { borderColor: '#fff' } }}>
                  {file ? file.name : "Select Document (PDF)"}
                  <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
                </Button>
              </Grid>
              <Grid item xs={12} mt={2}>
                <Button type="submit" variant="contained" size="large" fullWidth sx={{ background: 'linear-gradient(135deg, #c084fc, #9333ea)', color: '#fff', py: 1.5, fontSize: '1.1rem', letterSpacing: '1px', '&:hover': { boxShadow: '0 0 20px rgba(192,132,252,0.4)' } }} disabled={loading}>
                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Upload Paper'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography variant="h6" mb={3} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Papers</Typography>
        <Paper sx={{ borderRadius: 4, overflow: 'hidden', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'rgba(15,23,42,0.6)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Title</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Format</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Document</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {papers.map((item) => (
                  <TableRow key={item._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02) !important' } }}>
                    <TableCell sx={{ color: '#f8fafc', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{item.title}</TableCell>
                    <TableCell sx={{ color: '#c084fc', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{item.type}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Link href={item.fileUrl} target="_blank" rel="noopener" sx={{ color: '#38bdf8', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>View File</Link>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <IconButton color="error" onClick={() => handleDelete(item._id)} sx={{ color: '#f87171', background: 'rgba(248,113,113,0.1)', '&:hover': { background: 'rgba(248,113,113,0.2)' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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

export default PaperManagement;
