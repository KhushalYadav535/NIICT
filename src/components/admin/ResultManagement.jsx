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
    input: { color: '#0F172A' },
    label: { color: '#64748B' },
    '& label.Mui-focused': { color: '#2563EB', fontWeight: 600 },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      '& fieldset': { borderColor: '#CBD5E1' },
      '&:hover fieldset': { borderColor: '#94A3B8' },
      '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: '2px', boxShadow: '0 0 0 4px rgba(37,99,235,0.1)' },
    },
    '& .MuiSelect-icon': { color: '#64748B' },
    '& .MuiSelect-select': { color: '#0F172A' }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Box display="flex" alignItems="center" mb={4} gap={2}>
            <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #F59E0B, #D97706)', boxShadow: '0 10px 20px -5px rgba(245,158,11,0.4)', display: 'flex' }}>
              <FaTrophy size={28} color="#fff" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '0.5px' }}>
                Result <span style={{ color: '#D97706' }}>Management</span>
              </Typography>
              <Typography variant="body2" color="#64748B">
                Manage student examination scores, publish batch results, and export merit lists.
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Total Results</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#0284C7', mt: 0.5 }}>{totalResults}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Published</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#059669', mt: 0.5 }}>{publishedResults}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>GK Results</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#D97706', mt: 0.5 }}>{gkResults}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Computer Results</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ color: '#7C3AED', mt: 0.5 }}>{computerResults}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={openAddDialog} startIcon={<FaPlus />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.5, py: 1, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.25)', '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)' } }}>
              Add Result
            </Button>
            <Button variant="contained" onClick={handlePublish} startIcon={<FaUpload />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.5, py: 1, background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}>
              Publish All Results
            </Button>
            <Button variant="outlined" onClick={exportToCSV} startIcon={<FaDownload />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2.5, py: 1, color: '#475569', borderColor: '#CBD5E1', backgroundColor: '#FFFFFF', '&:hover': { backgroundColor: '#F8FAFC', borderColor: '#94A3B8' } }}>
              Export CSV
            </Button>
          </Box>

          <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ background: '#F8FAFC' }}>
                  <TableRow>
                    {['Roll Number', 'Name', 'Father Name', 'Subject', 'Marks', 'Rank', 'Status', 'Published', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ color: '#475569', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #E2E8F0', py: 1.8 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result._id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC !important' } }}>
                      <TableCell sx={{ color: '#2563EB', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>{result.rollNumber}</TableCell>
                      <TableCell sx={{ color: '#0F172A', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>{result.name}</TableCell>
                      <TableCell sx={{ color: '#64748B', borderBottom: '1px solid #F1F5F9' }}>{result.fatherName}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Chip label={result.subject} size="small" sx={{ background: result.subject === 'GK' ? '#EFF6FF' : '#F5F3FF', color: result.subject === 'GK' ? '#2563EB' : '#7C3AED', fontWeight: 600, border: `1px solid ${result.subject === 'GK' ? '#BFDBFE' : '#DDD6FE'}` }} />
                      </TableCell>
                      <TableCell sx={{ color: '#059669', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>{result.marks}/100</TableCell>
                      <TableCell sx={{ color: '#D97706', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>#{result.rank}</TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Chip label={result.status} size="small" sx={{ background: result.status === 'Passed' ? '#ECFDF5' : '#FEF2F2', color: result.status === 'Passed' ? '#059669' : '#DC2626', fontWeight: 600, border: `1px solid ${result.status === 'Passed' ? '#A7F3D0' : '#FECACA'}` }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Chip label={result.isPublished ? 'Published' : 'Draft'} size="small" sx={{ background: result.isPublished ? '#ECFDF5' : '#FFFBEB', color: result.isPublished ? '#059669' : '#D97706', fontWeight: 600, border: `1px solid ${result.isPublished ? '#A7F3D0' : '#FDE68A'}` }} />
                      </TableCell>
                      <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                        <Box display="flex" gap={1}>
                          <Button variant="outlined" size="small" onClick={() => openEditDialog(result)} sx={{ color: '#2563EB', borderColor: '#BFDBFE', backgroundColor: '#EFF6FF', minWidth: 0, p: 0.8, borderRadius: 1.5, '&:hover': { backgroundColor: '#DBEAFE', borderColor: '#2563EB' } }}><FaEdit size={14} /></Button>
                          <Button variant="outlined" size="small" onClick={() => handleDelete(result.rollNumber)} sx={{ color: '#DC2626', borderColor: '#FECACA', backgroundColor: '#FEF2F2', minWidth: 0, p: 0.8, borderRadius: 1.5, '&:hover': { backgroundColor: '#FEE2E2', borderColor: '#DC2626' } }}><FaTrash size={14} /></Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {results.length === 0 && !loading && (
            <Box textAlign="center" py={6} sx={{ backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', mt: 3 }}>
              <Typography variant="h6" color="#64748B" fontWeight={500}>No results found.</Typography>
              <Typography variant="body2" color="#94A3B8">Click "Add Result" above to add new student examination results.</Typography>
            </Box>
          )}

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth PaperProps={{ sx: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 3, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' } }}>
            <DialogTitle sx={{ borderBottom: '1px solid #F1F5F9', color: '#0F172A', fontWeight: 700, fontSize: '1.25rem' }}>
              {editingResult ? 'Edit Student Result' : 'Add New Student Result'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent sx={{ mt: 2 }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Roll Number" value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value.toUpperCase()})} required /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Student Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Father Name" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} required /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Mother Name" value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} /></Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: '#64748B', '&.Mui-focused': { color: '#2563EB', fontWeight: 600 } }}>Subject</InputLabel>
                      <Select value={formData.subject} label="Subject" onChange={(e) => setFormData({...formData, subject: e.target.value})} sx={{ color: '#0F172A', backgroundColor: '#FFFFFF', '.MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' }, '.MuiSvgIcon-root': { color: '#64748B' } }}>
                        <MenuItem value="GK">GK</MenuItem><MenuItem value="Computer">Computer</MenuItem><MenuItem value="Both">Both</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Marks" type="number" value={formData.marks} onChange={(e) => setFormData({...formData, marks: e.target.value})} required inputProps={{ min: 0, max: 100 }} /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Rank" type="number" value={formData.rank} onChange={(e) => setFormData({...formData, rank: e.target.value})} required inputProps={{ min: 1 }} /></Grid>
                  <Grid item xs={12} md={6}><TextField sx={inputSx} fullWidth label="Exam Date" type="date" value={formData.examDate} onChange={(e) => setFormData({...formData, examDate: e.target.value})} required InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: '#64748B', '&.Mui-focused': { color: '#2563EB', fontWeight: 600 } }}>Status</InputLabel>
                      <Select value={formData.status} label="Status" onChange={(e) => setFormData({...formData, status: e.target.value})} sx={{ color: '#0F172A', backgroundColor: '#FFFFFF', '.MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94A3B8' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' }, '.MuiSvgIcon-root': { color: '#64748B' } }}>
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
              <DialogActions sx={{ p: 2.5, borderTop: '1px solid #F1F5F9' }}>
                <Button onClick={() => setOpenDialog(false)} sx={{ color: '#64748B', textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
                <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff', textTransform: 'none', fontWeight: 600, px: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>Save Result</Button>
              </DialogActions>
            </form>
          </Dialog>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ResultManagement;
