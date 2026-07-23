import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PeopleIcon from '@mui/icons-material/People';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import DescriptionIcon from '@mui/icons-material/Description';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import StoreIcon from '@mui/icons-material/Store';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#22d3ee', '#f472b6', '#818cf8'];

const AdminDashboard = () => {
  const [admissions, setAdmissions] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admissions`);
      const data = await response.json();
      setAdmissions(data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    }
  };

  const handlePrint = (admission) => {
    navigate(`/admin/print/${admission._id}`);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/admissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAdmissions();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admission?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admissions/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete admission');
        }
        
        await response.json();
        fetchAdmissions();
      } catch (error) {
        console.error('Error deleting admission:', error);
        alert('Failed to delete admission. Please try again.');
      }
    }
  };

  const total = admissions.length;
  const approved = admissions.filter(a => a.status === 'Approved').length;
  const pending = admissions.filter(a => a.status === 'Pending').length;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const admissionsByMonth = {};
  admissions.forEach(a => {
    const date = new Date(a.dateOfAdmission || a.applicationDate || a.createdAt || a.dateOfBirth);
    if (!isNaN(date)) {
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      admissionsByMonth[key] = (admissionsByMonth[key] || 0) + 1;
    }
  });
  const monthChartData = Object.entries(admissionsByMonth).map(([month, count]) => ({ month, count }));
  monthChartData.sort((a, b) => {
    const [ma, ya] = a.month.split(' ');
    const [mb, yb] = b.month.split(' ');
    return ya !== yb ? ya - yb : monthNames.indexOf(ma) - monthNames.indexOf(mb);
  });

  const admissionsByCourse = {};
  admissions.forEach(a => {
    const course = a.course || 'Unknown';
    admissionsByCourse[course] = (admissionsByCourse[course] || 0) + 1;
  });
  const courseChartData = Object.entries(admissionsByCourse).map(([course, value]) => ({ name: course, value }));

  const quickActions = [
    { title: 'Franchises', icon: <StoreIcon />, path: '/admin/franchise', color: '#38bdf8' },
    { title: 'Competitions', icon: <EmojiEventsIcon />, path: '/admin/competition', color: '#fbbf24' },
    { title: 'Results', icon: <SchoolIcon />, path: '/admin/results', color: '#34d399' },
    { title: 'Courses', icon: <SchoolIcon />, path: '/admin/courses', color: '#38bdf8' },
    { title: 'Jobs', icon: <WorkIcon />, path: '/admin/jobs', color: '#a78bfa' },
    { title: 'News', icon: <NewspaperIcon />, path: '/admin/news', color: '#f472b6' },
    { title: 'Mentors', icon: <PeopleIcon />, path: '/admin/mentors', color: '#22d3ee' },
    { title: 'Flashcards', icon: <ViewCarouselIcon />, path: '/admin/flashcards', color: '#4ade80' },
    { title: 'Papers', icon: <DescriptionIcon />, path: '/admin/papers', color: '#c084fc' },
    { title: 'Interviews', icon: <QuestionAnswerIcon />, path: '/admin/interview', color: '#f87171' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#0B1120', pt: 12, pb: 8 }}>
      {/* Background Ambient Glows */}
      <Box sx={{
        position: 'fixed', top: '-10%', left: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(11,17,32,0) 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />
      <Box sx={{
        position: 'fixed', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, rgba(11,17,32,0) 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        
        {/* Header */}
        <Box display="flex" alignItems="center" mb={6} gap={2}>
          <Box sx={{ 
            p: 1.5, borderRadius: 3, background: 'linear-gradient(135deg, #38bdf8, #3b82f6)',
            boxShadow: '0 0 20px rgba(56,189,248,0.4)', display: 'flex'
          }}>
            <DashboardIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={800} color="#fff" sx={{ letterSpacing: '2px', textTransform: 'uppercase', fontFamily: '"Saira Condensed", sans-serif', lineHeight: 1 }}>
              Command <span style={{ color: '#38bdf8' }}>Center</span>
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8', letterSpacing: '4px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              System Administration
            </Typography>
          </Box>
        </Box>

        {/* Quick Actions Grid */}
        <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontFamily: '"Saira Condensed", sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2} mb={6}>
          {quickActions.map((action, idx) => (
            <Grid item xs={6} sm={4} md={2.66} lg={1.33} key={idx} sx={{ display: 'flex' }}>
              <Box 
                onClick={() => navigate(action.path)}
                sx={{
                  width: '100%',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 3,
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(30, 41, 59, 0.8)',
                    transform: 'translateY(-4px)',
                    borderColor: action.color,
                    boxShadow: `0 10px 20px -10px ${action.color}60`
                  }
                }}
              >
                <Box sx={{ color: action.color, display: 'flex' }}>
                  {React.cloneElement(action.icon, { sx: { fontSize: 28 } })}
                </Box>
                <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
                  {action.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Metrics Cards */}
        <Grid container spacing={4} mb={6}>
          {[
            { title: 'Total Admissions', value: total, icon: <DashboardIcon />, color: '#38bdf8', gradient: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(59,130,246,0.05))' },
            { title: 'Approved', value: approved, icon: <AssignmentTurnedInIcon />, color: '#34d399', gradient: 'linear-gradient(135deg, rgba(52,211,153,0.2), rgba(16,185,129,0.05))' },
            { title: 'Pending', value: pending, icon: <PendingActionsIcon />, color: '#fbbf24', gradient: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(245,158,11,0.05))' }
          ].map((metric, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ 
                background: metric.gradient, 
                border: `1px solid ${metric.color}40`,
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                boxShadow: `0 0 30px ${metric.color}15`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ position: 'absolute', top: -20, right: -20, color: `${metric.color}20`, transform: 'scale(3)' }}>
                  {metric.icon}
                </Box>
                <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', mb: 1 }}>
                    {metric.title}
                  </Typography>
                  <Typography variant="h2" fontWeight={800} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif' }}>
                    {metric.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: 4, background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', height: 400 }}>
              <Typography variant="h6" mb={4} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Admissions Timeline
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} stroke="#64748b" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: 4, background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', height: 400 }}>
              <Typography variant="h6" mb={4} sx={{ color: '#fff', fontFamily: '"Saira Condensed", sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Course Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={courseChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    fill="#8884d8"
                    stroke="none"
                  >
                    {courseChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ color: '#cbd5e1' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Admissions Table */}
        <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontFamily: '"Saira Condensed", sans-serif', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Recent Applications
        </Typography>
        <Paper sx={{ borderRadius: 4, overflow: 'hidden', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ background: 'rgba(15,23,42,0.6)' }}>
                <TableRow>
                  {['Name', 'Email', 'Course', 'Status', 'Actions'].map((header) => (
                    <TableCell key={header} sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {admissions.map((admission) => (
                  <TableRow key={admission._id} hover sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.02) !important' } }}>
                    <TableCell sx={{ color: '#f8fafc', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{admission.name}</TableCell>
                    <TableCell sx={{ color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{admission.email}</TableCell>
                    <TableCell sx={{ color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{admission.course}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Chip 
                        label={admission.status}
                        sx={{ 
                          fontWeight: 600, 
                          backgroundColor: admission.status === 'Approved' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)',
                          color: admission.status === 'Approved' ? '#34d399' : '#fbbf24',
                          border: `1px solid ${admission.status === 'Approved' ? '#34d399' : '#fbbf24'}40`,
                          borderRadius: 2
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <Box display="flex" gap={1}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => handlePrint(admission)}
                          sx={{ color: '#38bdf8', borderColor: '#38bdf850', '&:hover': { borderColor: '#38bdf8', background: 'rgba(56,189,248,0.1)' } }}
                        >
                          Print
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleStatusUpdate(
                            admission._id,
                            admission.status === 'Pending' ? 'Approved' : 'Pending'
                          )}
                          sx={{ 
                            color: admission.status === 'Pending' ? '#34d399' : '#fbbf24', 
                            borderColor: admission.status === 'Pending' ? '#34d39950' : '#fbbf2450',
                            '&:hover': { borderColor: admission.status === 'Pending' ? '#34d399' : '#fbbf24', background: admission.status === 'Pending' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)' } 
                          }}
                        >
                          {admission.status === 'Pending' ? 'Approve' : 'Mark Pending'}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDelete(admission._id)}
                          sx={{ color: '#f87171', borderColor: '#f8717150', '&:hover': { borderColor: '#f87171', background: 'rgba(248,113,113,0.1)' } }}
                        >
                          Delete
                        </Button>
                      </Box>
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

export default AdminDashboard;
