import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NewspaperIcon from '@mui/icons-material/Newspaper';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: '', content: '' });
  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [editId, setEditId] = useState(null);
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

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title || '',
      category: item.category || '',
      content: item.content || ''
    });
    setExistingImage(item.image || '');
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setExistingImage('');
    setFormData({ title: '', category: '', content: '' });
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
      const url = editId ? `${API_BASE_URL}/api/news/${editId}` : `${API_BASE_URL}/api/news`;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        handleCancel();
        fetchNews();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to save news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
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
    input: { color: '#0F172A' },
    label: { color: '#64748B' },
    '& label.Mui-focused': { color: '#DB2777', fontWeight: 600 },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      '& fieldset': { borderColor: '#CBD5E1' },
      '&:hover fieldset': { borderColor: '#94A3B8' },
      '&.Mui-focused fieldset': { borderColor: '#DB2777', borderWidth: '2px', boxShadow: '0 0 0 4px rgba(219,39,119,0.1)' },
    },
    '& .MuiInputBase-inputMultiline': { color: '#0F172A' }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(219,39,119,0.05) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={4} gap={2}>
          <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #EC4899, #DB2777)', boxShadow: '0 10px 20px -5px rgba(219,39,119,0.4)', display: 'flex' }}>
            <NewspaperIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '0.5px' }}>
              Tech News <span style={{ color: '#DB2777' }}>Management</span>
            </Typography>
            <Typography variant="body2" color="#64748B">
              Publish news, institute announcements, and tech industry updates.
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 5, borderRadius: 3, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <Typography variant="h6" mb={3} sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>
            {editId ? '✏️ Edit News Article' : 'Publish News Article'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
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
                <Button variant="outlined" component="label" fullWidth sx={{ py: 1.4, borderColor: '#CBD5E1', color: '#475569', backgroundColor: '#F8FAFC', textTransform: 'none', fontWeight: 600, borderRadius: 2, '&:hover': { borderColor: '#DB2777', backgroundColor: '#FDF2F8' } }}>
                  {file ? file.name : (existingImage ? "Change Cover Image (Current attached ✓)" : "Upload Cover Image")}
                  <input type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" gap={2} sx={{ height: '100%' }}>
                  <Button type="submit" variant="contained" fullWidth size="large" sx={{ borderRadius: 2, height: '100%', py: 1.3, textTransform: 'none', fontWeight: 700, background: 'linear-gradient(135deg, #EC4899, #DB2777)', color: '#fff', boxShadow: '0 4px 12px rgba(219,39,119,0.25)', '&:hover': { background: 'linear-gradient(135deg, #DB2777, #BE185D)' } }} disabled={loading}>
                    {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (editId ? 'Update News' : 'Publish News')}
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

        <Typography variant="h6" mb={2.5} sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>Published News Articles ({news.length})</Typography>
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Image</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Headline</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Category</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {news.map((item) => (
                  <TableRow key={item._id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC !important' } }}>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      {item.image ? (
                        <Box component="img" src={item.image} alt="News" sx={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 1.5, border: '1px solid #E2E8F0' }} />
                      ) : (
                        <Box sx={{ width: 60, height: 40, borderRadius: 1.5, background: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '11px', fontWeight: 600 }}>N/A</Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: '#0F172A', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>{item.title}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Box component="span" sx={{ display: 'inline-block', px: 1.5, py: 0.3, borderRadius: 2, background: '#FDF2F8', color: '#DB2777', border: '1px solid #FBCFE8', fontWeight: 600, fontSize: '0.8rem' }}>
                        {item.category}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap' }}>
                      <IconButton onClick={() => handleEdit(item)} sx={{ color: '#DB2777', background: '#FDF2F8', border: '1px solid #FBCFE8', borderRadius: 1.5, mr: 1, '&:hover': { background: '#FCE7F3' } }} title="Edit News" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item._id)} sx={{ color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 1.5, '&:hover': { background: '#FEE2E2' } }} title="Delete News" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {news.length === 0 && (
          <Box textAlign="center" py={6} sx={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', mt: 3 }}>
            <Typography variant="h6" color="#64748B" fontWeight={500}>No news articles published yet.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default NewsManagement;
