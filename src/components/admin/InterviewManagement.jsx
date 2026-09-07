import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const InterviewManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({ category: 'HR', q: '', a: '' });
  const [editId, setEditId] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/interview`);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      category: item.category || 'HR',
      q: item.q || '',
      a: item.a || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({ category: 'HR', q: '', a: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editId ? `${API_BASE_URL}/api/interview/${editId}` : `${API_BASE_URL}/api/interview`;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        handleCancel();
        fetchQuestions();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to save question');
      }
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await fetch(`${API_BASE_URL}/api/interview/${id}`, { method: 'DELETE' });
        fetchQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const inputSx = {
    input: { color: '#0F172A' },
    label: { color: '#64748B' },
    '& label.Mui-focused': { color: '#E11D48', fontWeight: 600 },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      '& fieldset': { borderColor: '#CBD5E1' },
      '&:hover fieldset': { borderColor: '#94A3B8' },
      '&.Mui-focused fieldset': { borderColor: '#E11D48', borderWidth: '2px', boxShadow: '0 0 0 4px rgba(225,29,72,0.1)' },
    },
    '& .MuiInputBase-inputMultiline': { color: '#0F172A' }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(225,29,72,0.05) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={4} gap={2}>
          <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #E11D48, #BE123C)', boxShadow: '0 10px 20px -5px rgba(225,29,72,0.4)', display: 'flex' }}>
            <QuestionAnswerIcon sx={{ fontSize: 28, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '0.5px' }}>
              Interview Prep <span style={{ color: '#E11D48' }}>Management</span>
            </Typography>
            <Typography variant="body2" color="#64748B">
              Manage frequently asked interview questions, sample answers, and mock preparation notes.
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 5, borderRadius: 3, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <Typography variant="h6" mb={3} sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>
            {editId ? '✏️ Edit Interview Question' : 'Add New Interview Question'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={3}>
                <TextField sx={inputSx} fullWidth label="Category (e.g. HR, Technical)" name="category" value={formData.category} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField sx={inputSx} fullWidth label="Question" name="q" value={formData.q} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField sx={inputSx} fullWidth multiline rows={3} label="Recommended Answer / Strategy" name="a" value={formData.a} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} mt={1}>
                <Box display="flex" gap={2}>
                  <Button type="submit" variant="contained" size="large" fullWidth sx={{ background: 'linear-gradient(135deg, #E11D48, #BE123C)', color: '#fff', py: 1.3, textTransform: 'none', fontWeight: 700, fontSize: '1rem', borderRadius: 2, boxShadow: '0 4px 12px rgba(225,29,72,0.25)', '&:hover': { background: 'linear-gradient(135deg, #BE123C, #9F1239)' } }}>
                    {editId ? 'Update Question' : 'Add Question'}
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

        <Typography variant="h6" mb={2.5} sx={{ color: '#0F172A', fontWeight: 700, fontSize: '1.1rem' }}>Question Bank ({questions.length})</Typography>
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Category</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Question</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Answer</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.map((item) => (
                  <TableRow key={item._id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC !important' } }}>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap' }}>
                      <Box component="span" sx={{ display: 'inline-block', px: 1.5, py: 0.3, borderRadius: 2, background: '#FFF1F2', color: '#E11D48', border: '1px solid #FECDD3', fontWeight: 700, fontSize: '0.8rem' }}>
                        {item.category}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#0F172A', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>{item.q}</TableCell>
                    <TableCell sx={{ color: '#475569', borderBottom: '1px solid #F1F5F9' }}>{item.a}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap' }}>
                      <IconButton onClick={() => handleEdit(item)} sx={{ color: '#E11D48', background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 1.5, mr: 1, '&:hover': { background: '#FFE4E6' } }} title="Edit Question" size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item._id)} sx={{ color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 1.5, '&:hover': { background: '#FEE2E2' } }} title="Delete Question" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {questions.length === 0 && (
          <Box textAlign="center" py={6} sx={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', mt: 3 }}>
            <Typography variant="h6" color="#64748B" fontWeight={500}>No interview questions added yet.</Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default InterviewManagement;
