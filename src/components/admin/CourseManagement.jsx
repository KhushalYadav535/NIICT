import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, TextField, Grid, IconButton, CircularProgress, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    level: 'Beginner',
    price: '',
    originalPrice: '',
    discount: '',
    features: '',
    syllabusTitle: '',
    syllabusDesc: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [syllabus, setSyllabus] = useState([]);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSyllabusItem = () => {
    if (formData.syllabusTitle && formData.syllabusDesc) {
      setSyllabus([...syllabus, { title: formData.syllabusTitle, description: formData.syllabusDesc }]);
      setFormData({ ...formData, syllabusTitle: '', syllabusDesc: '' });
    }
  };

  const removeSyllabusItem = (index) => {
    const newSyllabus = [...syllabus];
    newSyllabus.splice(index, 1);
    setSyllabus(newSyllabus);
  };

  const uploadMedia = async (file) => {
    const formData = new FormData();
    formData.append('media', file);
    const res = await fetch(`${API_BASE_URL}/api/upload-media`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Upload failed');
    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Thumbnail image is required');
      return;
    }
    
    setUploading(true);
    try {
      const imageUrl = await uploadMedia(imageFile);
      let videoUrl = null;
      if (videoFile) {
        videoUrl = await uploadMedia(videoFile);
      }

      const courseData = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        level: formData.level,
        price: formData.price,
        originalPrice: formData.originalPrice,
        discount: formData.discount,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        syllabus: syllabus,
        image: imageUrl,
        video: videoUrl
      };

      const res = await fetch(`${API_BASE_URL}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      });

      if (res.ok) {
        alert('Course created successfully!');
        setFormData({
          title: '', description: '', duration: '', level: 'Beginner', price: '',
          originalPrice: '', discount: '', features: '', syllabusTitle: '', syllabusDesc: ''
        });
        setSyllabus([]);
        setImageFile(null);
        setVideoFile(null);
        fetchCourses();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error creating course. See console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await fetch(`${API_BASE_URL}/api/courses/${id}`, { method: 'DELETE' });
        fetchCourses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const inputSx = {
    input: { color: '#fff' },
    label: { color: '#94a3b8' },
    '& label.Mui-focused': { color: '#38bdf8' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      '&.Mui-focused fieldset': { borderColor: '#38bdf8', boxShadow: '0 0 10px rgba(56,189,248,0.2)' },
    },
    '& .MuiInputBase-inputMultiline': { color: '#fff' }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1120', pt: 12, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, rgba(11,17,32,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={6} gap={2}>
          <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #38bdf8, #3b82f6)', boxShadow: '0 0 20px rgba(56,189,248,0.4)', display: 'flex' }}>
            <SchoolIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800} color="#fff" sx={{ letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
              Course <span style={{ color: '#38bdf8' }}>Management</span>
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: 4, background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <Typography variant="h6" mb={4} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>Add New Course</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField sx={inputSx} fullWidth label="Title" name="title" value={formData.title} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField sx={inputSx} fullWidth label="Level (Beginner, Intermediate, Advanced)" name="level" value={formData.level} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField sx={inputSx} fullWidth label="Description" name="description" value={formData.description} onChange={handleInputChange} multiline rows={3} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField sx={inputSx} fullWidth label="Duration (e.g., 3 Months)" name="duration" value={formData.duration} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField sx={inputSx} fullWidth label="Current Price (e.g., ₹5,000)" name="price" value={formData.price} onChange={handleInputChange} required />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField sx={inputSx} fullWidth label="Original Price (e.g., ₹7,000)" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField sx={inputSx} fullWidth label="Discount (e.g., 28% OFF)" name="discount" value={formData.discount} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField sx={inputSx} fullWidth label="Features (comma separated)" name="features" value={formData.features} onChange={handleInputChange} placeholder="Live Classes, Certificate, Job Support" />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1, textTransform: 'uppercase', letterSpacing: '1px' }}>Thumbnail Image (Required)</Typography>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required style={{ color: '#cbd5e1' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1, textTransform: 'uppercase', letterSpacing: '1px' }}>Promo Video (Optional)</Typography>
                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} style={{ color: '#cbd5e1' }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 2, mt: 2, textTransform: 'uppercase', letterSpacing: '1px' }}>Syllabus Modules</Typography>
                <Box display="flex" gap={2} mb={2}>
                  <TextField label="Module Title" name="syllabusTitle" value={formData.syllabusTitle} onChange={handleInputChange} sx={{ ...inputSx, flex: 1 }} />
                  <TextField label="Module Description" name="syllabusDesc" value={formData.syllabusDesc} onChange={handleInputChange} sx={{ ...inputSx, flex: 2 }} />
                  <Button variant="outlined" onClick={addSyllabusItem} sx={{ color: '#38bdf8', borderColor: '#38bdf8', '&:hover': { background: 'rgba(56,189,248,0.1)' } }}>Add</Button>
                </Box>
                {syllabus.map((item, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" p={2} mb={1} borderRadius={2} sx={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Typography sx={{ color: '#cbd5e1' }}><strong style={{ color: '#fff' }}>{item.title}:</strong> {item.description}</Typography>
                    <IconButton onClick={() => removeSyllabusItem(index)} sx={{ color: '#f87171' }}><DeleteIcon /></IconButton>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12} mt={2}>
                <Button type="submit" variant="contained" disabled={uploading} size="large" fullWidth sx={{ background: 'linear-gradient(135deg, #38bdf8, #3b82f6)', color: '#fff', py: 1.5, fontSize: '1.1rem', letterSpacing: '1px', '&:hover': { boxShadow: '0 0 20px rgba(56,189,248,0.4)' } }}>
                  {uploading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Create Course'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography variant="h6" mb={3} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>Existing Courses</Typography>
        <Paper sx={{ borderRadius: 4, overflow: 'hidden', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'rgba(15,23,42,0.6)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Title</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Level</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Price</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02) !important' } }}>
                    <TableCell sx={{ color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{course.title}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Chip label={course.level} size="small" sx={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }} />
                    </TableCell>
                    <TableCell sx={{ color: '#34d399', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{course.price}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <IconButton onClick={() => handleDelete(course._id)} sx={{ color: '#f87171', background: 'rgba(248,113,113,0.1)', '&:hover': { background: 'rgba(248,113,113,0.2)' } }}>
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

export default CourseManagement;
