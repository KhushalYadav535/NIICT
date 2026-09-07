import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton, Box, Chip, 
  MenuItem, Switch, FormControlLabel, CircularProgress 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ScheduleManagement = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState('All');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    course: 'ADCA',
    day: 'Monday',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    meetLink: '',
    isLive: false,
    thumbnail: ''
  });
  const [editId, setEditId] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/schedule`);
      const data = await response.json();
      setSchedules(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.instructor || !formData.course) {
      alert('Please fill in title, instructor, and course');
      return;
    }

    try {
      const url = editId ? `${API_BASE_URL}/api/schedule/${editId}` : `${API_BASE_URL}/api/schedule`;
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({
          title: '',
          instructor: '',
          course: 'ADCA',
          day: 'Monday',
          startTime: '10:00 AM',
          endTime: '11:30 AM',
          meetLink: '',
          isLive: false,
          thumbnail: ''
        });
        setEditId(null);
        fetchSchedules();
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const handleEdit = (schedule) => {
    setEditId(schedule._id);
    setFormData({
      title: schedule.title || '',
      instructor: schedule.instructor || '',
      course: schedule.course || 'ADCA',
      day: schedule.day || 'Monday',
      startTime: schedule.startTime || '10:00 AM',
      endTime: schedule.endTime || '11:30 AM',
      meetLink: schedule.meetLink || '',
      isLive: schedule.isLive || false,
      thumbnail: schedule.thumbnail || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class schedule?')) {
      try {
        await fetch(`${API_BASE_URL}/api/schedule/${id}`, { method: 'DELETE' });
        fetchSchedules();
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const filteredSchedules = selectedDay === 'All' 
    ? schedules 
    : schedules.filter(s => s.day === selectedDay);

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
              <CalendarMonthIcon sx={{ color: '#2563EB', fontSize: 32 }} /> Live Classes & Timetable Management
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
              Schedule live classes, update Google Meet / stream links, and manage weekly timetable
            </Typography>
          </Box>
        </Box>

        {/* Schedule Creation / Edit Form */}
        <Paper sx={{ p: 3.5, mb: 4, backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)' }}>
          <Typography variant="h6" sx={{ color: '#0F172A', mb: 2.5, fontWeight: 700, fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {editId ? '✏️ Edit Scheduled Class' : '➕ Add New Live Class Schedule'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Class Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. ADCA Morning Batch: Excel Mastery"
                  required
                  sx={{
                    '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Instructor Name"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  placeholder="e.g. Er. Amit Sharma"
                  required
                  sx={{
                    '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="e.g. ADCA, DCA, CCC"
                  required
                  sx={{
                    '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  fullWidth
                  label="Day of Week"
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
                  }}
                >
                  {daysOfWeek.map((day) => (
                    <MenuItem key={day} value={day}>{day}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Start Time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 10:00 AM"
                  required
                  sx={{
                    '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="End Time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 11:30 AM"
                  required
                  sx={{
                    '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isLive}
                      onChange={handleInputChange}
                      name="isLive"
                      color="error"
                    />
                  }
                  label={formData.isLive ? '🔴 Currently Live' : '⚪ Scheduled'}
                  sx={{ color: '#0F172A', mt: 1, fontWeight: 600 }}
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Live Stream / Google Meet Link"
                  name="meetLink"
                  value={formData.meetLink}
                  onChange={handleInputChange}
                  placeholder="https://meet.google.com/xyz-abcd-efg"
                  sx={{
                    '& .MuiInputBase-root': { color: '#0F172A', backgroundColor: '#FFFFFF' },
                    '& .MuiInputLabel-root': { color: '#64748B' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CBD5E1' }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{
                      height: '54px',
                      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      color: '#fff',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)' }
                    }}
                  >
                    {editId ? 'Update Class' : 'Schedule Class'}
                  </Button>
                  {editId && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setEditId(null);
                        setFormData({
                          title: '',
                          instructor: '',
                          course: 'ADCA',
                          day: 'Monday',
                          startTime: '10:00 AM',
                          endTime: '11:30 AM',
                          meetLink: '',
                          isLive: false,
                          thumbnail: ''
                        });
                      }}
                      sx={{ color: '#64748B', borderColor: '#CBD5E1', height: '54px', fontWeight: 600, textTransform: 'none', borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>

        {/* Day Filter Chips */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mb: 3, pb: 1 }}>
          <Chip
            label="All Days"
            clickable
            onClick={() => setSelectedDay('All')}
            sx={{
              backgroundColor: selectedDay === 'All' ? '#2563EB' : '#FFFFFF',
              color: selectedDay === 'All' ? '#fff' : '#475569',
              border: '1px solid',
              borderColor: selectedDay === 'All' ? '#2563EB' : '#E2E8F0',
              fontWeight: 700
            }}
          />
          {daysOfWeek.map((day) => (
            <Chip
              key={day}
              label={day}
              clickable
              onClick={() => setSelectedDay(day)}
              sx={{
                backgroundColor: selectedDay === day ? '#2563EB' : '#FFFFFF',
                color: selectedDay === day ? '#fff' : '#475569',
                border: '1px solid',
                borderColor: selectedDay === day ? '#2563EB' : '#E2E8F0',
                fontWeight: 700
              }}
            />
          ))}
        </Box>

        {/* Existing Schedules Table */}
        <Paper sx={{ p: 3, backgroundColor: '#FFFFFF', borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#0F172A', fontWeight: 700 }}>
              Classes ({filteredSchedules.length})
            </Typography>
            <Button onClick={fetchSchedules} sx={{ color: '#2563EB', fontWeight: 600, textTransform: 'none', '&:hover': { backgroundColor: '#EFF6FF' } }}>
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
                    <TableCell>Day</TableCell>
                    <TableCell>Timing</TableCell>
                    <TableCell>Class Title</TableCell>
                    <TableCell>Instructor</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSchedules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ color: '#64748B', py: 4 }}>
                        No classes scheduled for {selectedDay}.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSchedules.map((item) => (
                      <TableRow 
                        key={item._id} 
                        sx={{ 
                          '&:hover': { backgroundColor: '#F8FAFC !important' },
                          '& td': { borderColor: '#F1F5F9', color: '#334155' } 
                        }}
                      >
                        <TableCell sx={{ fontWeight: 700, color: '#2563EB' }}>{item.day}</TableCell>
                        <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{item.startTime} - {item.endTime}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#0F172A' }}>{item.title}</TableCell>
                        <TableCell sx={{ color: '#334155' }}>{item.instructor}</TableCell>
                        <TableCell>
                          <Chip label={item.course} size="small" sx={{ backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontWeight: 600 }} />
                        </TableCell>
                        <TableCell>
                          {item.isLive ? (
                            <Chip label="LIVE NOW" size="small" sx={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', fontWeight: 'bold' }} />
                          ) : (
                            <Chip label="Scheduled" size="small" sx={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', fontWeight: 600 }} />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleEdit(item)} sx={{ color: '#2563EB', backgroundColor: '#EFF6FF', mr: 1, '&:hover': { backgroundColor: '#DBEAFE' } }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
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
      </Container>
    </Box>
  );
};

export default ScheduleManagement;
