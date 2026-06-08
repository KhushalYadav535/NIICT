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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <Box display="flex" alignItems="center" mb={4}>
        <NewspaperIcon sx={{ fontSize: 40, color: '#4a90e2', mr: 2 }} />
        <Typography variant="h4" fontWeight={700}>Tech News Management</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" mb={3} fontWeight={600}>Publish News</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField fullWidth label="Headline" name="title" value={formData.title} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Category" name="category" value={formData.category} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Content" name="content" value={formData.content} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth sx={{ py: 1.5 }}>
                {file ? file.name : "Upload Cover Image"}
                <input type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large" sx={{ borderRadius: 2 }} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Publish News'}
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
                <TableCell sx={{ fontWeight: 700 }}>Headline</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {news.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    {item.image && <img src={item.image} alt="News" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />}
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
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

export default NewsManagement;
