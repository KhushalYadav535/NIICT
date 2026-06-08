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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <Box display="flex" alignItems="center" mb={4}>
        <ViewCarouselIcon sx={{ fontSize: 40, color: '#4a90e2', mr: 2 }} />
        <Typography variant="h4" fontWeight={700}>Flashcard Management</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" mb={3} fontWeight={600}>Add New Flashcard</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
              <TextField fullWidth label="Front (Question)" name="front" value={formData.front} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField fullWidth label="Back (Answer)" name="back" value={formData.back} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField fullWidth label="Category" name="category" value={formData.category} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large" sx={{ borderRadius: 2 }}>Add Flashcard</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#f0f9ff' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Front</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Back</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flashcards.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.front}</TableCell>
                  <TableCell>{item.back}</TableCell>
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

export default FlashcardManagement;
