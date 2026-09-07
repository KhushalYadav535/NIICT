import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, CircularProgress, Link } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';

const PaperManagement = () => {
  const [papers, setPapers] = useState([]);
  const [formData, setFormData] = useState({ title: '', type: 'PDF' });
  const [file, setFile] = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState('');
  const [editId, setEditId] = useState(null);
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

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title || '',
      type: item.type || 'PDF'
    });
    setExistingFileUrl(item.fileUrl || '');
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setExistingFileUrl('');
    setFormData({ title: '', type: 'PDF' });
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !existingFileUrl) {
      alert('Please select a file to upload');
      return;
    }
    setLoading(true);
    try {
      let fileUrl = existingFileUrl;
      if (file) {
        const fileData = new FormData();
        fileData.append('media', file);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload-media`, {
          method: 'POST',
          body: fileData
        });
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.secure_url || uploadData.fileUrl || uploadData.url;
      }

      const payload = { ...formData, fileUrl };
      const url = editId ? `${API_BASE_URL}/api/papers/${editId}` : `${API_BASE_URL}/api/papers`;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        handleCancel();
        fetchPapers();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to save paper');
      }
    } catch (error) {
      console.error('Error saving paper:', error);
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
    input: { color: '#0F172A' },
    label: { color: '#64748B' },
    '& label.Mui-focused': { color: '#7C3AED', fontWeight: 600 },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      '& fieldset': { borderColor: '#CBD5E1' },
      '&:hover fieldset': { borderColor: '#94A3B8' },
      '&.Mui-focused fieldset': { borderColor: '#7C3AED', borderWidth: '2px', boxShadow: '0 0 0 4px rgba(124,58,237,0.1)' },
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={4} gap={2}>
          <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', boxShadow: '0 10px 20px -5px rgba(124,58,237,0.4)', display: 'flex' }}>
            <DescriptionIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '0.5px' }}>
              Exam Papers <span style={{ color: '#7C3AED' }}>Management</span>
            </Typography>
            <Typography variant="body2" color="#64748B">
              Upload past question papers, practice sample tests, and solutions.
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 5, borderRadius: 3, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <Typography variant="h6" mb={3} sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>
            {editId ? '✏️ Edit Paper Information' : 'Upload New Paper'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField sx={inputSx} fullWidth label="Paper Title (e.g. CCC 2024 Exam Paper)" name="title" value={formData.title} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField sx={inputSx} fullWidth label="Format Type" name="type" value={formData.type} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button variant="outlined" component="label" fullWidth sx={{ py: 1.4, borderColor: '#CBD5E1', color: '#475569', backgroundColor: '#F8FAFC', textTransform: 'none', fontWeight: 600, borderRadius: 2, '&:hover': { borderColor: '#7C3AED', backgroundColor: '#F5F3FF' } }}>
                  {file ? file.name : (existingFileUrl ? "Change Document (Current file attached ✓)" : "Select Document (PDF)")}
                  <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
                </Button>
              </Grid>
              <Grid item xs={12} mt={1}>
                <Box display="flex" gap={2}>
                  <Button type="submit" variant="contained" size="large" fullWidth sx={{ background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: '#fff', py: 1.3, textTransform: 'none', fontWeight: 700, fontSize: '1rem', borderRadius: 2, boxShadow: '0 4px 12px rgba(124,58,237,0.25)', '&:hover': { background: 'linear-gradient(135deg, #6D28D9, #5B21B6)' } }} disabled={loading}>
                    {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (editId ? 'Update Paper' : 'Upload Paper')}
                  </Button>
                  {editId && (
                    <Button variant="outlined" onClick={handleCancel} size="large" sx={{ borderColor: '#CBD5E1', color: '#64748B', px: 4, textTransform: 'none', fontWeight: 600, borderRadius: 2, '&:hover': { borderColor: '#EF4444', color: '#DC2626', backgroundColor: '#FEF2F2' } }}>
                      Cancel
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography variant="h6" mb={2.5} sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>Available Question Papers ({papers.length})</Typography>
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Title</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Format</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Document</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {papers.map((item) => (
                  <TableRow key={item._id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC !important' } }}>
                    <TableCell sx={{ color: '#0F172A', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>{item.title}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Box component="span" sx={{ display: 'inline-block', px: 1.5, py: 0.3, borderRadius: 2, background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE', fontWeight: 700, fontSize: '0.8rem' }}>
                        {item.type}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Link href={item.fileUrl} target="_blank" rel="noopener" sx={{ color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5, textDecoration: 'none', px: 1.5, py: 0.5, borderRadius: 1.5, background: '#EFF6FF', border: '1px solid #BFDBFE', fontSize: '0.85rem', '&:hover': { background: '#DBEAFE' } }}>
                        View Document &rarr;
                      </Link>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap' }}>
                      <IconButton onClick={() => handleEdit(item)} sx={{ color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 1.5, mr: 1, '&:hover': { background: '#EDE9FE' } }} title="Edit Paper" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item._id)} sx={{ color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 1.5, '&:hover': { background: '#FEE2E2' } }} title="Delete Paper" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {papers.length === 0 && (
          <Box textAlign="center" py={6} sx={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', mt: 3 }}>
            <Typography variant="h6" color="#64748B" fontWeight={500}>No papers uploaded yet.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PaperManagement;
