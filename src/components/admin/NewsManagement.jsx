import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NewspaperIcon from '@mui/icons-material/Newspaper';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: '', content: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/news`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
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
      const response = await fetch(`${API_BASE_URL}/api/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setFormData({ title: '', category: '', content: '' });
        setFile(null);
        fetchNews();
      }
    } catch (error) {
      console.error('Error adding news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        await fetch(`${API_BASE_URL}/api/news/${id}`, { method: 'DELETE' });
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  const inputSx = {
    input: { color: '#fff' },
    label: { color: '#94a3b8' },
    '& label.Mui-focused': { color: '#f472b6' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&.Mui-focused fieldset': { borderColor: '#f472b6', boxShadow: '0 0 10px rgba(244,114,182,0.2)' },
    },
    '& .MuiInputBase-inputMultiline': { color: '#fff' }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1120', pt: 12, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(244,114,182,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={6} gap={2}>
          <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #f472b6, #db2777)', boxShadow: '0 0 20px rgba(244,114,182,0.4)', display: 'flex' }}>
            <NewspaperIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800} color="#fff" sx={{ letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
              Tech News <span style={{ color: '#f472b6' }}>Management</span>
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: 4, background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h6" mb={4} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>Publish News</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextField sx={inputSx} fullWidth label="Headline" name="title" value={formData.title} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField sx={inputSx} fullWidth label="Category" name="category" value={formData.category} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField sx={inputSx} fullWidth multiline rows={4} label="Content" name="content" value={formData.content} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5, borderColor: '#64748b', color: '#cbd5e1', '&:hover': { borderColor: '#fff' } }}>
                  {file ? file.name : "Upload Cover Image"}
                  <input type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button type="submit" variant="contained" fullWidth size="large" sx={{ borderRadius: 2, height: '100%', background: 'linear-gradient(135deg, #f472b6, #db2777)', color: '#fff', '&:hover': { boxShadow: '0 0 20px rgba(244,114,182,0.4)' } }} disabled={loading}>
                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Publish News'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography variant="h6" mb={3} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>News Articles</Typography>
        <Paper sx={{ borderRadius: 4, overflow: 'hidden', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'rgba(15,23,42,0.6)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Image</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Headline</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Category</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {news.map((item) => (
                  <TableRow key={item._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02) !important' } }}>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {item.image ? (
                        <Box component="img" src={item.image} alt="News" sx={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 1, border: '1px solid rgba(255,255,255,0.1)' }} />
                      ) : (
                        <Box sx={{ width: 60, height: 40, borderRadius: 1, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '10px' }}>N/A</Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#f8fafc', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{item.title}</TableCell>
                    <TableCell sx={{ color: '#f472b6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{item.category}</TableCell>
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

export default NewsManagement;
