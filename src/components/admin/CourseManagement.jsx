import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, TextField, Grid, IconButton, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <Typography variant="h4" fontWeight={700} color="#222" mb={4}>
        Course Management
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" mb={3}>Add New Course</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Level (Beginner, Intermediate, Advanced)" name="level" value={formData.level} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleInputChange} multiline rows={3} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Duration (e.g., 3 Months)" name="duration" value={formData.duration} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Current Price (e.g., ₹5,000)" name="price" value={formData.price} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Original Price (e.g., ₹7,000)" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Discount (e.g., 28% OFF)" name="discount" value={formData.discount} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Features (comma separated)" name="features" value={formData.features} onChange={handleInputChange} placeholder="Live Classes, Certificate, Job Support" />
            </Grid>

            {/* Media Uploads */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Thumbnail Image (Required)</Typography>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Promo Video (Optional)</Typography>
              <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0])} />
            </Grid>

            {/* Syllabus Builder */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>Syllabus Modules</Typography>
              <Box display="flex" gap={2} mb={2}>
                <TextField label="Module Title" name="syllabusTitle" value={formData.syllabusTitle} onChange={handleInputChange} sx={{ flex: 1 }} />
                <TextField label="Module Description" name="syllabusDesc" value={formData.syllabusDesc} onChange={handleInputChange} sx={{ flex: 2 }} />
                <Button variant="outlined" onClick={addSyllabusItem}>Add</Button>
              </Box>
              {syllabus.map((item, index) => (
                <Box key={index} display="flex" justifyContent="space-between" alignItems="center" p={1} bgcolor="#f5f5f5" mb={1} borderRadius={1}>
                  <Typography><strong>{item.title}:</strong> {item.description}</Typography>
                  <IconButton onClick={() => removeSyllabusItem(index)} color="error"><DeleteIcon /></IconButton>
                </Box>
              ))}
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" disabled={uploading} size="large" fullWidth>
                {uploading ? <CircularProgress size={24} /> : 'Create Course'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Typography variant="h5" fontWeight={600} mb={3}>Existing Courses</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.level}</TableCell>
                <TableCell>{course.price}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => handleDelete(course._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default CourseManagement;
