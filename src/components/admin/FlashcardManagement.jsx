import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

const FlashcardManagement = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [formData, setFormData] = useState({ front: '', back: '', category: 'General' });
  const [editId, setEditId] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/flashcards`);
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      front: item.front || '',
      back: item.back || '',
      category: item.category || 'General'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({ front: '', back: '', category: 'General' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `${API_BASE_URL}/api/flashcards/${editId}` : `${API_BASE_URL}/api/flashcards`;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        handleCancel();
        fetchFlashcards();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to save flashcard');
      }
    } catch (error) {
      console.error('Error saving flashcard:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        await fetch(`${API_BASE_URL}/api/flashcards/${id}`, { method: 'DELETE' });
        fetchFlashcards();
      } catch (error) {
        console.error('Error deleting flashcard:', error);
      }
    }
  };

  const inputSx = {
    input: { color: '#0F172A' },
    label: { color: '#64748B' },
    '& label.Mui-focused': { color: '#0D9488', fontWeight: 600 },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      '& fieldset': { borderColor: '#CBD5E1' },
      '&:hover fieldset': { borderColor: '#94A3B8' },
      '&.Mui-focused fieldset': { borderColor: '#0D9488', borderWidth: '2px', boxShadow: '0 0 0 4px rgba(13,148,136,0.1)' },
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(13,148,136,0.05) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={4} gap={2}>
          <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #0D9488, #0F766E)', boxShadow: '0 10px 20px -5px rgba(13,148,136,0.4)', display: 'flex' }}>
            <ViewCarouselIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '0.5px' }}>
              Flashcard <span style={{ color: '#0D9488' }}>Management</span>
            </Typography>
            <Typography variant="body2" color="#64748B">
              Create quick-revision flashcards, quiz bites, and topic memory aids.
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 5, borderRadius: 3, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <Typography variant="h6" mb={3} sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>
            {editId ? '✏️ Edit Flashcard' : 'Add New Flashcard'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={5}>
                <TextField sx={inputSx} fullWidth label="Front (Question / Concept)" name="front" value={formData.front} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField sx={inputSx} fullWidth label="Back (Answer / Explanation)" name="back" value={formData.back} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField sx={inputSx} fullWidth label="Category" name="category" value={formData.category} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} mt={1}>
                <Box display="flex" gap={2}>
                  <Button type="submit" variant="contained" size="large" fullWidth sx={{ background: 'linear-gradient(135deg, #0D9488, #0F766E)', color: '#fff', py: 1.3, textTransform: 'none', fontWeight: 700, fontSize: '1rem', borderRadius: 2, boxShadow: '0 4px 12px rgba(13,148,136,0.25)', '&:hover': { background: 'linear-gradient(135deg, #0F766E, #115E59)' } }}>
                    {editId ? 'Update Flashcard' : 'Add Flashcard'}
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

        <Typography variant="h6" mb={2.5} sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>Available Flashcards ({flashcards.length})</Typography>
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Front</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Back</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Category</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flashcards.map((item) => (
                  <TableRow key={item._id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC !important' } }}>
                    <TableCell sx={{ color: '#0F172A', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>{item.front}</TableCell>
                    <TableCell sx={{ color: '#475569', borderBottom: '1px solid #F1F5F9' }}>{item.back}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Box component="span" sx={{ display: 'inline-block', px: 1.5, py: 0.3, borderRadius: 2, background: '#F0FDFA', color: '#0D9488', border: '1px solid #CCFBF1', fontWeight: 600, fontSize: '0.8rem' }}>
                        {item.category || 'General'}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap' }}>
                      <IconButton onClick={() => handleEdit(item)} sx={{ color: '#0D9488', background: '#F0FDFA', border: '1px solid #CCFBF1', borderRadius: 1.5, mr: 1, '&:hover': { background: '#CCFBF1' } }} title="Edit Flashcard" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item._id)} sx={{ color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 1.5, '&:hover': { background: '#FEE2E2' } }} title="Delete Flashcard" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {flashcards.length === 0 && (
          <Box textAlign="center" py={6} sx={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', mt: 3 }}>
            <Typography variant="h6" color="#64748B" fontWeight={500}>No flashcards created yet.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FlashcardManagement;
