import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, Box, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ForumIcon from '@mui/icons-material/Forum';
import ReplyIcon from '@mui/icons-material/Reply';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const DoubtManagement = () => {
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Reply Modal State
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [activeDoubt, setActiveDoubt] = useState(null);
  const [facultyName, setFacultyName] = useState('Er. Amit Sharma (Senior Faculty)');
  const [facultyReply, setFacultyReply] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/doubts`);
      const data = await response.json();
      setDoubts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const openReply = (doubt) => {
    setActiveDoubt(doubt);
    setFacultyReply(doubt.facultyReply || '');
    setReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!facultyReply.trim()) {
      alert('Please type a reply');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/doubts/${activeDoubt._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reply: facultyReply,
          facultyName
        })
      });

      if (response.ok) {
        setReplyModalOpen(false);
        setActiveDoubt(null);
        setFacultyReply('');
        fetchDoubts();
      } else {
        alert('Failed to send reply');
      }
    } catch (error) {
      console.error('Error replying to doubt:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student query?')) {
      try {
        await fetch(`${API_BASE_URL}/api/doubts/${id}`, { method: 'DELETE' });
        fetchDoubts();
      } catch (error) {
        console.error('Error deleting doubt:', error);
      }
    }
  };

  const filteredDoubts = selectedCategory === 'All'
    ? doubts
    : doubts.filter(d => d.category === selectedCategory);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <IconButton 
            onClick={() => navigate('/admin/dashboard')} 
            sx={{ color: '#475569', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', '&:hover': { color: '#0F172A', bgcolor: '#F1F5F9' } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <ForumIcon sx={{ color: '#2563EB', fontSize: 32 }} /> Student Doubt Forum Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              Review questions asked by students across ADCA, DCA, CCC, and post official faculty solutions
            </Typography>
          </Box>
        </Box>

        {/* Category Filters */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          {['All', 'ADCA', 'DCA', 'CCC', 'Tally'].map((cat) => (
            <Chip
              key={cat}
              label={cat}
              clickable
              onClick={() => setSelectedCategory(cat)}
              sx={{
                backgroundColor: selectedCategory === cat ? '#2563EB' : '#FFFFFF',
                color: selectedCategory === cat ? '#fff' : '#475569',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#2563EB' : '#E2E8F0',
                fontWeight: 700
              }}
            />
          ))}
        </Box>

        {/* Doubts Table */}
        <Paper sx={{ p: 3, backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>
              Queries ({filteredDoubts.length})
            </Typography>
            <Button onClick={fetchDoubts} sx={{ color: '#2563EB', fontWeight: 600, textTransform: 'none', '&:hover': { backgroundColor: '#EFF6FF' } }}>
              Refresh
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#2563EB' }} />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ background: '#F8FAFC' }}>
                  <TableRow sx={{ '& th': { borderColor: '#E2E8F0', color: '#475569', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' } }}>
                    <TableCell>Student</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Question Title & Details</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Faculty Solution</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDoubts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ color: '#64748B', py: 4 }}>
                        No questions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDoubts.map((item) => (
                      <TableRow 
                        key={item._id} 
                        sx={{ 
                          '&:hover': { backgroundColor: '#F8FAFC !important' },
                          '& td': { borderColor: '#F1F5F9', color: '#334155' } 
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {item.user?.name || 'Student'}
                        </TableCell>
                        <TableCell>
                          <Chip label={item.category} size="small" sx={{ backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontWeight: 600 }} />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#0F172A' }}>
                            {item.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5 }}>
                            {item.desc}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {item.hasFacultyReply || item.status === 'Resolved' ? (
                            <Chip 
                              icon={<CheckCircleIcon sx={{ fontSize: '16px !important', color: '#059669 !important' }} />} 
                              label="Resolved" 
                              size="small" 
                              sx={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', fontWeight: 600 }} 
                            />
                          ) : (
                            <Chip 
                              label="Needs Answer" 
                              size="small" 
                              sx={{ backgroundColor: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A', fontWeight: 600 }} 
                            />
                          )}
                        </TableCell>
                        <TableCell sx={{ maxWidth: 250 }}>
                          {item.hasFacultyReply ? (
                            <Typography variant="caption" sx={{ color: '#059669', fontStyle: 'italic', fontWeight: 500 }}>
                              "{item.facultyReply}"
                            </Typography>
                          ) : (
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                              Pending faculty response
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ReplyIcon />}
                            onClick={() => openReply(item)}
                            sx={{ 
                              color: '#2563EB', 
                              borderColor: '#BFDBFE', 
                              backgroundColor: '#EFF6FF',
                              mr: 1,
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: 1.5,
                              '&:hover': { backgroundColor: '#DBEAFE', borderColor: '#2563EB' }
                            }}
                          >
                            {item.hasFacultyReply ? 'Edit Reply' : 'Answer'}
                          </Button>
                          <IconButton onClick={() => handleDelete(item._id)} sx={{ color: '#DC2626', backgroundColor: '#FEF2F2', '&:hover': { backgroundColor: '#FEE2E2' } }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Reply Modal */}
        <Dialog
          open={replyModalOpen}
          onClose={() => setReplyModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              borderRadius: 3,
              boxShadow: '0 20px 40px -4px rgba(15, 23, 42, 0.15)'
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: '1px solid #E2E8F0', fontWeight: 'bold', color: '#0F172A' }}>
            Faculty Response to Student Doubt
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {activeDoubt && (
              <Box sx={{ mb: 2.5, p: 2, backgroundColor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="subtitle2" sx={{ color: '#2563EB', fontWeight: 700 }}>
                  Student: {activeDoubt.user?.name || 'Student'} ({activeDoubt.category})
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#0F172A', mt: 0.5 }}>
                  {activeDoubt.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                  {activeDoubt.desc}
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              label="Faculty / Mentor Name"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                '& .MuiInputLabel-root': { color: '#64748B' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Official Faculty Solution"
              placeholder="Provide a clear step-by-step answer or instructions..."
              value={facultyReply}
              onChange={(e) => setFacultyReply(e.target.value)}
              sx={{
                '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                '& .MuiInputLabel-root': { color: '#64748B' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: '1px solid #E2E8F0' }}>
            <Button onClick={() => setReplyModalOpen(false)} sx={{ color: '#64748B', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSendReply}
              sx={{
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#fff',
                fontWeight: 700,
                px: 3,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)' }
              }}
            >
              Post Solution
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default DoubtManagement;
