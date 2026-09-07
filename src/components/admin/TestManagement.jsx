import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, Box, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions, Radio, RadioGroup, 
  FormControlLabel, Divider, CircularProgress 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import QuizIcon from '@mui/icons-material/Quiz';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const TestManagement = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [editId, setEditId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('30');
  const [questions, setQuestions] = useState([
    { q: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tests`);
      const data = await response.json();
      setTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (test) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tests/${test._id}`);
      if (res.ok) {
        const fullTest = await res.json();
        setEditId(fullTest._id);
        setTitle(fullTest.title || '');
        setSubject(fullTest.subject || '');
        setDuration(String(fullTest.duration || '30'));
        if (fullTest.questions && fullTest.questions.length > 0) {
          setQuestions(fullTest.questions.map(q => ({
            q: q.q,
            options: q.options || ['', '', '', ''],
            correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0
          })));
        } else {
          setQuestions([{ q: '', options: ['', '', '', ''], correctAnswer: 0 }]);
        }
        setOpenModal(true);
      }
    } catch (err) {
      console.error('Error fetching test for edit:', err);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setSubject('');
    setDuration('30');
    setQuestions([{ q: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { q: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) return;
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index].q = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].correctAnswer = optIndex;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !subject || !duration) {
      alert('Please fill in title, subject and duration');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].q.trim()) {
        alert(`Question ${i + 1} is empty`);
        return;
      }
      for (let j = 0; j < 4; j++) {
        if (!questions[i].options[j]?.trim()) {
          alert(`Option ${j + 1} for Question ${i + 1} is empty`);
          return;
        }
      }
    }

    try {
      const payload = {
        title,
        subject,
        duration: Number(duration),
        questions
      };

      const url = editId ? `${API_BASE_URL}/api/tests/${editId}` : `${API_BASE_URL}/api/tests`;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        resetForm();
        setOpenModal(false);
        fetchTests();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to save test');
      }
    } catch (error) {
      console.error('Error saving test:', error);
      alert('Network error while saving test');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mock test?')) {
      try {
        await fetch(`${API_BASE_URL}/api/tests/${id}`, { method: 'DELETE' });
        fetchTests();
      } catch (error) {
        console.error('Error deleting test:', error);
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => navigate('/admin/dashboard')} 
              sx={{ color: '#475569', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', '&:hover': { color: '#0F172A', bgcolor: '#F1F5F9' } }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5, fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <QuizIcon sx={{ color: '#2563EB', fontSize: 32 }} /> Test Series & Mock Test Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                Create, monitor and manage live assessments and online exams for students
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => { resetForm(); setOpenModal(true); }}
            sx={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#fff',
              fontWeight: 700,
              px: 3,
              py: 1.2,
              borderRadius: '10px',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
              '&:hover': { background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)' }
            }}
          >
            Create New Mock Test
          </Button>
        </Box>

        {/* Existing Tests Table */}
        <Paper sx={{ p: 3, backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>
              Active Assessments ({tests.length})
            </Typography>
            <Button onClick={fetchTests} sx={{ color: '#2563EB', fontWeight: 600, textTransform: 'none', '&:hover': { backgroundColor: '#EFF6FF' } }}>
              Refresh Data
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
                    <TableCell>Test Title</TableCell>
                    <TableCell>Subject / Category</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Questions</TableCell>
                    <TableCell>Enrolled</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ color: '#64748B', py: 5 }}>
                        No mock tests created yet. Click "Create New Mock Test" to add one!
                      </TableCell>
                    </TableRow>
                  ) : (
                    tests.map((test) => (
                      <TableRow 
                        key={test._id} 
                        sx={{ 
                          '&:hover': { backgroundColor: '#F8FAFC !important' },
                          '& td': { borderColor: '#F1F5F9', color: '#334155' } 
                        }}
                      >
                        <TableCell sx={{ fontWeight: 600, color: '#0F172A' }}>{test.title}</TableCell>
                        <TableCell>
                          <Chip 
                            label={test.subject} 
                            size="small" 
                            sx={{ backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #BFDBFE' }} 
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#0F172A' }}>{test.duration} mins</TableCell>
                        <TableCell sx={{ color: '#475569' }}>{test.questions ? test.questions.length : 'MCQ'} Questions</TableCell>
                        <TableCell sx={{ color: '#475569' }}>{test.enrolledStudents || 0} Students</TableCell>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                          {test.createdAt ? new Date(test.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            onClick={() => handleEdit(test)} 
                            sx={{ color: '#2563EB', backgroundColor: '#EFF6FF', mr: 1, '&:hover': { backgroundColor: '#DBEAFE' } }}
                            title="Edit Test"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(test._id)} 
                            sx={{ color: '#DC2626', backgroundColor: '#FEF2F2', '&:hover': { backgroundColor: '#FEE2E2' } }}
                            title="Delete Test"
                          >
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

        {/* Modal Dialog: Create / Edit Test */}
        <Dialog 
          open={openModal} 
          onClose={() => { resetForm(); setOpenModal(false); }}
          maxWidth="md"
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
            {editId ? '✏️ Edit Assessment / Mock Test' : '➕ Create New Assessment / Mock Test'}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Test Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CCC Mock Test Series 2026"
                  sx={{
                    '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Subject / Topic"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. LibreOffice & Fundamentals"
                  sx={{
                    '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (Mins)"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  sx={{
                    '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, borderColor: '#E2E8F0' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#2563EB', fontWeight: 700 }}>
                Questions & Options ({questions.length})
              </Typography>
              <Button
                size="small"
                startIcon={<AddCircleIcon />}
                onClick={handleAddQuestion}
                sx={{ color: '#2563EB', fontWeight: 600, textTransform: 'none', '&:hover': { backgroundColor: '#EFF6FF' } }}
              >
                Add Another Question
              </Button>
            </Box>

            {questions.map((qItem, qIdx) => (
              <Paper 
                key={qIdx} 
                sx={{ 
                  p: 2.5, 
                  mb: 2.5, 
                  backgroundColor: '#F8FAFC', 
                  borderRadius: 2.5, 
                  border: '1px solid #E2E8F0' 
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ color: '#0F172A', fontWeight: 'bold' }}>
                    Question {qIdx + 1}
                  </Typography>
                  {questions.length > 1 && (
                    <IconButton size="small" onClick={() => handleRemoveQuestion(qIdx)} sx={{ color: '#DC2626', '&:hover': { backgroundColor: '#FEF2F2' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={`Question ${qIdx + 1} Prompt`}
                  value={qItem.q}
                  onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
                  }}
                />

                <Typography variant="body2" sx={{ color: '#475569', mb: 1, fontWeight: 600 }}>
                  Options & Correct Answer (Select the radio of the correct option):
                </Typography>

                <RadioGroup 
                  value={qItem.correctAnswer} 
                  onChange={(e) => handleCorrectAnswerChange(qIdx, Number(e.target.value))}
                >
                  <Grid container spacing={1.5}>
                    {qItem.options.map((opt, optIdx) => (
                      <Grid item xs={12} sm={6} key={optIdx}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Radio 
                            value={optIdx} 
                            sx={{ color: '#94A3B8', '&.Mui-checked': { color: '#059669' } }} 
                          />
                          <TextField
                            fullWidth
                            size="small"
                            placeholder={`Option ${optIdx + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                            sx={{
                              '& .MuiInputBase-root': { 
                                color: '#0F172A', 
                                backgroundColor: '#FFFFFF',
                                border: qItem.correctAnswer === optIdx ? '2px solid #059669' : '1px solid #CBD5E1'
                              },
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                            }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
              </Paper>
            ))}
          </DialogContent>
          <DialogActions sx={{ p: 2.5, borderTop: '1px solid #E2E8F0' }}>
            <Button onClick={() => { resetForm(); setOpenModal(false); }} sx={{ color: '#64748B', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
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
              {editId ? 'Update & Save Changes' : 'Save & Publish Test'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default TestManagement;
