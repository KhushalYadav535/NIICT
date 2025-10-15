import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, 
         Card, CardContent, TextField, Dialog, DialogTitle, DialogContent, 
         DialogActions, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box display="flex" alignItems="center" mb={4} gap={2}>
          <FaTrophy size={30} color="#fbbf24" />
          <Typography variant="h4" fontWeight={700} color="#222">
            Result Management
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #4a90e2 60%, #2563eb 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Total Results</Typography>
                <Typography variant="h4" fontWeight={700}>{totalResults}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #10b981 60%, #22d3ee 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Published</Typography>
                <Typography variant="h4" fontWeight={700}>{publishedResults}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #fbbf24 60%, #f59e42 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>GK Results</Typography>
                <Typography variant="h4" fontWeight={700}>{gkResults}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #a78bfa 60%, #6366f1 100%)', color: 'white', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Computer Results</Typography>
                <Typography variant="h4" fontWeight={700}>{computerResults}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={openAddDialog}
            startIcon={<FaPlus />}
            sx={{ borderRadius: 2 }}
          >
            Add Result
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handlePublish}
            startIcon={<FaUpload />}
            sx={{ borderRadius: 2 }}
          >
            Publish All Results
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={exportToCSV}
            startIcon={<FaDownload />}
            sx={{ borderRadius: 2 }}
          >
            Export CSV
          </Button>
        </Box>

        {/* Results Table */}
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 6 }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: '#f0f9ff' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Roll Number</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Father Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Marks</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Published</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result._id} hover>
                    <TableCell>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {result.rollNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight={500}>
                        {result.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{result.fatherName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={result.subject}
                        color={result.subject === 'GK' ? 'primary' : 'secondary'}
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        {result.marks}/100
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight={600} color="#1e293b">
                        #{result.rank}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={result.status}
                        color={result.status === 'Passed' ? 'success' : 'error'}
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={result.isPublished ? 'Yes' : 'No'}
                        color={result.isPublished ? 'success' : 'warning'}
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="info" 
                        size="small"
                        onClick={() => openEditDialog(result)}
                        sx={{ mr: 1, borderRadius: 2 }}
                        startIcon={<FaEdit />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(result.rollNumber)}
                        sx={{ borderRadius: 2 }}
                        startIcon={<FaTrash />}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {results.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="#64748b">
              No results found. Add some results to get started.
            </Typography>
          </Box>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingResult ? 'Edit Result' : 'Add New Result'}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Roll Number"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({...formData, rollNumber: e.target.value.toUpperCase()})}
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Student Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Father Name"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                    required
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mother Name"
                    value={formData.motherName}
                    onChange={(e) => setFormData({...formData, motherName: e.target.value})}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Subject</InputLabel>
                    <Select
                      value={formData.subject}
                      label="Subject"
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    >
                      <MenuItem value="GK">GK</MenuItem>
                      <MenuItem value="Computer">Computer</MenuItem>
                      <MenuItem value="Both">Both</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Marks"
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({...formData, marks: e.target.value})}
                    required
                    inputProps={{ min: 0, max: 100 }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Rank"
                    type="number"
                    value={formData.rank}
                    onChange={(e) => setFormData({...formData, rank: e.target.value})}
                    required
                    inputProps={{ min: 1 }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Exam Date"
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({...formData, examDate: e.target.value})}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      label="Status"
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <MenuItem value="Passed">Passed</MenuItem>
                      <MenuItem value="Failed">Failed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Class"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="School"
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </DialogActions>
          </form>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default ResultManagement;
