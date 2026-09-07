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
  const [editId, setEditId] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  
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

  const handleEdit = (course) => {
    setEditId(course._id);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      duration: course.duration || '',
      level: course.level || 'Beginner',
      price: course.price || '',
      originalPrice: course.originalPrice || '',
      discount: course.discount || '',
      features: course.features ? course.features.join(', ') : '',
      syllabusTitle: '',
      syllabusDesc: ''
    });
    setSyllabus(course.syllabus || []);
    setExistingImage(course.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditId(null);
    setExistingImage('');
    setFormData({
      title: '', description: '', duration: '', level: 'Beginner', price: '',
      originalPrice: '', discount: '', features: '', syllabusTitle: '', syllabusDesc: ''
    });
    setSyllabus([]);
    setImageFile(null);
    setVideoFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !existingImage) {
      alert('Thumbnail image is required');
      return;
    }
    
    setUploading(true);
    try {
      let imageUrl = existingImage;
      if (imageFile) {
        imageUrl = await uploadMedia(imageFile);
      }
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
        image: imageUrl
      };
      if (videoUrl) {
        courseData.video = videoUrl;
      }

      const url = editId ? `${API_BASE_URL}/api/courses/${editId}` : `${API_BASE_URL}/api/courses`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
      });

      if (res.ok) {
        alert(editId ? 'Course updated successfully!' : 'Course created successfully!');
        handleCancel();
        fetchCourses();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving course. See console for details.');
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
    input: { color: '#0F172A', backgroundColor: '#FFFFFF' },
    label: { color: '#64748B' },
    '& label.Mui-focused': { color: '#2563EB', fontWeight: 600 },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      '& fieldset': { borderColor: '#CBD5E1' },
      '&:hover fieldset': { borderColor: '#94A3B8' },
      '&.Mui-focused fieldset': { borderColor: '#2563EB', borderWidth: '2px', boxShadow: '0 0 0 4px rgba(37,99,235,0.1)' },
    },
    '& .MuiInputBase-inputMultiline': { color: '#0F172A', backgroundColor: '#FFFFFF' }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 4, pb: 8 }}>
      <Box sx={{ position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box display="flex" alignItems="center" mb={5} gap={2}>
          <Box sx={{ p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', boxShadow: '0 8px 20px -4px rgba(37,99,235,0.3)', display: 'flex' }}>
            <SchoolIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '1px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
              Course <span style={{ color: '#2563EB' }}>Management</span>
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#64748B', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'monospace', mt: 0.5 }}>
              Manage curriculum, pricing & modules
            </Typography>
          </Box>
        </Box>

        <Paper elevation={0} sx={{ p: 4, mb: 5, borderRadius: 4, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <Typography variant="h6" mb={3} sx={{ color: '#0F172A', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
            {editId ? '✏️ Edit Course' : 'Add New Course'}
          </Typography>
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
                <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, fontSize: '0.75rem' }}>
                  Thumbnail Image {existingImage ? '(Saved image kept if unchanged)' : '(Required)'}
                </Typography>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required={!existingImage} style={{ color: '#334155' }} />
                {existingImage && (
                  <Typography variant="caption" sx={{ color: '#2563EB', display: 'block', mt: 0.5, fontWeight: 600 }}>
                    Current image attached ✓
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ color: '#475569', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, fontSize: '0.75rem' }}>Promo Video (Optional)</Typography>
                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} style={{ color: '#334155' }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ color: '#475569', mb: 2, mt: 1, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, fontSize: '0.75rem' }}>Syllabus Modules</Typography>
                <Box display="flex" gap={2} mb={2}>
                  <TextField label="Module Title" name="syllabusTitle" value={formData.syllabusTitle} onChange={handleInputChange} sx={{ ...inputSx, flex: 1 }} />
                  <TextField label="Module Description" name="syllabusDesc" value={formData.syllabusDesc} onChange={handleInputChange} sx={{ ...inputSx, flex: 2 }} />
                  <Button variant="outlined" onClick={addSyllabusItem} sx={{ color: '#2563EB', borderColor: '#BFDBFE', fontWeight: 600, textTransform: 'none', '&:hover': { background: '#EFF6FF', borderColor: '#2563EB' } }}>Add</Button>
                </Box>
                {syllabus.map((item, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" p={2} mb={1} borderRadius={2} sx={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <Typography sx={{ color: '#334155' }}><strong style={{ color: '#0F172A' }}>{item.title}:</strong> {item.description}</Typography>
                    <IconButton onClick={() => removeSyllabusItem(index)} sx={{ color: '#DC2626' }}><DeleteIcon /></IconButton>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12} mt={2}>
                <Box display="flex" gap={2}>
                  <Button type="submit" variant="contained" disabled={uploading} size="large" fullWidth sx={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff', py: 1.5, fontSize: '1rem', fontWeight: 700, textTransform: 'none', borderRadius: 2.5, boxShadow: '0 4px 14px rgba(37,99,235,0.25)', '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)' } }}>
                    {uploading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : (editId ? 'Update Course' : 'Create Course')}
                  </Button>
                  {editId && (
                    <Button variant="outlined" onClick={handleCancel} size="large" sx={{ borderColor: '#CBD5E1', color: '#64748B', px: 4, fontWeight: 600, textTransform: 'none', borderRadius: 2.5, '&:hover': { borderColor: '#DC2626', color: '#DC2626', background: '#FEF2F2' } }}>
                      Cancel
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Typography variant="h6" mb={2.5} sx={{ color: '#0F172A', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Existing Courses</Typography>
        <Paper sx={{ borderRadius: 4, overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                <TableRow>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Title</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Level</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Price</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course._id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC !important' } }}>
                    <TableCell sx={{ color: '#0F172A', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>{course.title}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Chip label={course.level} size="small" sx={{ background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell sx={{ color: '#059669', fontWeight: 700, borderBottom: '1px solid #F1F5F9' }}>{course.price}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9', whiteSpace: 'nowrap' }}>
                      <IconButton onClick={() => handleEdit(course)} sx={{ color: '#2563EB', background: '#EFF6FF', mr: 1, '&:hover': { background: '#DBEAFE' } }} title="Edit Course">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(course._id)} sx={{ color: '#DC2626', background: '#FEF2F2', '&:hover': { background: '#FEE2E2' } }} title="Delete Course">
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
