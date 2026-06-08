import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

const FlashcardManagement = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [formData, setFormData] = useState({ front: '', back: '', category: 'General' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/flashcards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormData({ front: '', back: '', category: 'General' });
        fetchFlashcards();
      }
    } catch (error) {
      console.error('Error adding flashcard:', error);
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
    input: { color: '#fff' },
    label: { color: '#94a3b8' },
    '& label.Mui-focused': { color: '#2dd4bf' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&.Mui-focused fieldset': { borderColor: '#2dd4bf', boxShadow: '0 0 10px rgba(45,212,191,0.2)' },
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1120', pt: 12, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(45,212,191,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={6} gap={2}>
          <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #2dd4bf, #14b8a6)', boxShadow: '0 0 20px rgba(45,212,191,0.4)', display: 'flex' }}>
            <ViewCarouselIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800} color="#fff" sx={{ letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
              Flashcard <span style={{ color: '#2dd4bf' }}>Management</span>
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: 4, background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h6" mb={4} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>Add New Flashcard</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <TextField sx={inputSx} fullWidth label="Front (Question)" name="front" value={formData.front} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField sx={inputSx} fullWidth label="Back (Answer)" name="back" value={formData.back} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField sx={inputSx} fullWidth label="Category" name="category" value={formData.category} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} mt={2}>
                <Button type="submit" variant="contained" size="large" fullWidth sx={{ background: 'linear-gradient(135deg, #2dd4bf, #14b8a6)', color: '#fff', py: 1.5, fontSize: '1.1rem', letterSpacing: '1px', '&:hover': { boxShadow: '0 0 20px rgba(45,212,191,0.4)' } }}>
                  Add Flashcard
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography variant="h6" mb={3} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Flashcards</Typography>
        <Paper sx={{ borderRadius: 4, overflow: 'hidden', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'rgba(15,23,42,0.6)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Front</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Back</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Category</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flashcards.map((item) => (
                  <TableRow key={item._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02) !important' } }}>
                    <TableCell sx={{ color: '#f8fafc', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{item.front}</TableCell>
                    <TableCell sx={{ color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{item.back}</TableCell>
                    <TableCell sx={{ color: '#2dd4bf', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{item.category}</TableCell>
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

export default FlashcardManagement;
