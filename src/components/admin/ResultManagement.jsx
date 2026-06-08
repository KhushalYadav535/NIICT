import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, 
         Card, CardContent, TextField, Dialog, DialogTitle, DialogContent, 
         DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import { FaTrophy, FaPlus, FaEdit, FaTrash, FaUpload, FaDownload } from 'react-icons/fa';

const ResultManagement = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [formData, setFormData] = useState({
    rollNumber: '',
    name: '',
    fatherName: '',
    motherName: '',
    subject: 'GK',
    marks: '',
    rank: '',
    examDate: '',
    status: 'Passed',
    class: '',
    school: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/results/all`);
      const data = await res.json();
      if (res.ok && data.success) {
        setResults(data.data);
      }
    } catch (e) {
      console.error('Error loading results:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      
      const resultData = {
        ...formData,
        marks: parseInt(formData.marks),
        rank: parseInt(formData.rank),
        examDate: new Date(formData.examDate)
      };

      const res = await fetch(`${API_BASE_URL}/api/results/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOpenDialog(false);
        resetForm();
        loadResults();
        alert('Result saved successfully!');
      } else {
        alert(data.message || 'Failed to save result');
      }
    } catch (e) {
      console.error('Error saving result:', e);
      alert('Failed to save result');
    }
  };

  const handleDelete = async (rollNumber) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/results/${rollNumber}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        loadResults();
        alert('Result deleted successfully!');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete result');
      }
    } catch (e) {
      console.error('Error deleting result:', e);
      alert('Failed to delete result');
    }
  };

  const handlePublish = async () => {
    if (!window.confirm('Are you sure you want to publish all results? This will make them visible to students.')) return;
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');
      const res = await fetch(`${API_BASE_URL}/api/results/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publishAll: true })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        loadResults();
        alert(`Successfully published ${data.modifiedCount} results!`);
      } else {
        alert(data.message || 'Failed to publish results');
      }
    } catch (e) {
      console.error('Error publishing results:', e);
      alert('Failed to publish results');
    }
  };

  const resetForm = () => {
    setFormData({
      rollNumber: '',
      name: '',
      fatherName: '',
      motherName: '',
      subject: 'GK',
      marks: '',
      rank: '',
      examDate: '',
      status: 'Passed',
      class: '',
      school: '',
      phone: '',
      address: ''
    });
    setEditingResult(null);
  };

  const openAddDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const openEditDialog = (result) => {
    setFormData({
      rollNumber: result.rollNumber,
      name: result.name,
      fatherName: result.fatherName,
      motherName: result.motherName || '',
      subject: result.subject,
      marks: result.marks.toString(),
      rank: result.rank.toString(),
      examDate: new Date(result.examDate).toISOString().split('T')[0],
      status: result.status,
      class: result.class || '',
      school: result.school || '',
      phone: result.phone || '',
      address: result.address || ''
    });
    setEditingResult(result);
    setOpenDialog(true);
  };

  const exportToCSV = () => {
    const headers = [
      'Roll Number', 'Name', 'Father Name', 'Mother Name', 'Subject', 
      'Marks', 'Rank', 'Exam Date', 'Status', 'Class', 'School', 'Phone', 'Address'
    ];
    
    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        result.rollNumber,
        result.name,
        result.fatherName,
        result.motherName || '',
        result.subject,
        result.marks,
        result.rank,
        new Date(result.examDate).toLocaleDateString('en-GB'),
        result.status,
        result.class || '',
        result.school || '',
        result.phone || '',
        `"${result.address || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalResults = results.length;
  const publishedResults = results.filter(r => r.isPublished).length;
  const gkResults = results.filter(r => r.subject === 'GK').length;
  const computerResults = results.filter(r => r.subject === 'Computer').length;

  const inputSx = {
    input: { color: '#fff' },
    label: { color: '#94a3b8' },
    '& label.Mui-focused': { color: '#fbbf24' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&.Mui-focused fieldset': { borderColor: '#fbbf24', boxShadow: '0 0 10px rgba(251,191,36,0.2)' },
    },
    '& .MuiSelect-icon': { color: '#94a3b8' },
    '& .MuiSelect-select': { color: '#fff' }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1120', pt: 12, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box display="flex" alignItems="center" mb={6} gap={2}>
            <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #fbbf24, #f59e42)', boxShadow: '0 0 20px rgba(251,191,36,0.4)', display: 'flex' }}>
              <FaTrophy size={32} color="#fff" />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={800} color="#fff" sx={{ letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
                Result <span style={{ color: '#fbbf24' }}>Management</span>
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3} mb={6}>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(59,130,246,0.05))', border: '1px solid rgba(56,189,248,0.4)', backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 0 30px rgba(56,189,248,0.15)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', mb: 1 }}>Total Results</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif' }}>{totalResults}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.05))', border: '1px solid rgba(52,211,153,0.4)', backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 0 30px rgba(52,211,153,0.15)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', mb: 1 }}>Published</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif' }}>{publishedResults}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.05))', border: '1px solid rgba(251,191,36,0.4)', backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 0 30px rgba(251,191,36,0.15)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', mb: 1 }}>GK Results</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif' }}>{gkResults}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(139,92,246,0.05))', border: '1px solid rgba(167,139,250,0.4)', backdropFilter: 'blur(10px)', borderRadius: 4, boxShadow: '0 0 30px rgba(167,139,250,0.15)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', mb: 1 }}>Computer Results</Typography>
                  <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif' }}>{computerResults}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={openAddDialog} startIcon={<FaPlus />} sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #fbbf24, #f59e42)', color: '#fff', '&:hover': { boxShadow: '0 0 20px rgba(251,191,36,0.4)' } }}>
              Add Result
            </Button>
            <Button variant="contained" onClick={handlePublish} startIcon={<FaUpload />} sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>
              Publish All Results
            </Button>
            <Button variant="contained" onClick={exportToCSV} startIcon={<FaDownload />} sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff' }}>
              Export CSV
            </Button>
          </Box>

          <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ background: 'rgba(15,23,42,0.6)' }}>
                  <TableRow>
                    {['Roll Number', 'Name', 'Father Name', 'Subject', 'Marks', 'Rank', 'Status', 'Published', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02) !important' } }}>
                      <TableCell sx={{ color: '#fbbf24', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{result.rollNumber}</TableCell>
                      <TableCell sx={{ color: '#f8fafc', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{result.name}</TableCell>
                      <TableCell sx={{ color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{result.fatherName}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Chip label={result.subject} size="small" sx={{ background: result.subject === 'GK' ? 'rgba(56,189,248,0.1)' : 'rgba(167,139,250,0.1)', color: result.subject === 'GK' ? '#38bdf8' : '#a78bfa', border: `1px solid ${result.subject === 'GK' ? 'rgba(56,189,248,0.2)' : 'rgba(167,139,250,0.2)'}` }} />
                      </TableCell>
                      <TableCell sx={{ color: '#34d399', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{result.marks}/100</TableCell>
                      <TableCell sx={{ color: '#fbbf24', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>#{result.rank}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Chip label={result.status} size="small" sx={{ background: result.status === 'Passed' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', color: result.status === 'Passed' ? '#34d399' : '#f87171', border: `1px solid ${result.status === 'Passed' ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}` }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Chip label={result.isPublished ? 'Yes' : 'No'} size="small" sx={{ background: result.isPublished ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)', color: result.isPublished ? '#34d399' : '#fbbf24', border: `1px solid ${result.isPublished ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)'}` }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <Box display="flex" gap={1}>
                          <Button variant="outlined" size="small" onClick={() => openEditDialog(result)} sx={{ color: '#38bdf8', borderColor: '#38bdf850', minWidth: 0, p: 1 }}><FaEdit /></Button>
                          <Button variant="outlined" size="small" onClick={() => handleDelete(result.rollNumber)} sx={{ color: '#f87171', borderColor: '#f8717150', minWidth: 0, p: 1 }}><FaTrash /></Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {results.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="#64748b">No results found.</Typography>
            </Box>
          )}

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, color: '#fff' } }}>
            <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {editingResult ? 'Edit Result' : 'Add New Result'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Roll Number" value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value.toUpperCase()})} required /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Student Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Father Name" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} required /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Mother Name" value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} /></Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: '#94a3b8', '&.Mui-focused': { color: '#fbbf24' } }}>Subject</InputLabel>
                      <Select value={formData.subject} label="Subject" onChange={(e) => setFormData({...formData, subject: e.target.value})} sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24' }, '.MuiSvgIcon-root': { color: '#94a3b8' } }}>
                        <MenuItem value="GK">GK</MenuItem><MenuItem value="Computer">Computer</MenuItem><MenuItem value="Both">Both</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Marks" type="number" value={formData.marks} onChange={(e) => setFormData({...formData, marks: e.target.value})} required inputProps={{ min: 0, max: 100 }} /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Rank" type="number" value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})} required inputProps={{ min: 1 }} /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Exam Date" type="date" value={formData.examDate} onChange={(e) => setFormData({...formData, examDate: e.target.value})} required InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: '#94a3b8', '&.Mui-focused': { color: '#fbbf24' } }}>Status</InputLabel>
                      <Select value={formData.status} label="Status" onChange={(e) => setFormData({...formData, status: e.target.value})} sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fbbf24' }, '.MuiSvgIcon-root': { color: '#94a3b8' } }}>
                        <MenuItem value="Passed">Passed</MenuItem><MenuItem value="Failed">Failed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Class" value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="School" value={formData.school} onChange={(e) => setFormData({...formData, school: e.target.value})} /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></Grid>
                  <Grid item xs={12}><TextField sx={inputSx} fullWidth label="Address" multiline rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} /></Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <Button onClick={() => setOpenDialog(false)} sx={{ color: '#94a3b8' }}>Cancel</Button>
                <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(135deg, #fbbf24, #f59e42)', color: '#fff' }}>Save Result</Button>
              </DialogActions>
            </form>
          </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ResultManagement;
