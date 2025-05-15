import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, 
         TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#4a90e2', '#10b981', '#fbbf24', '#f87171', '#a78bfa', '#22d3ee', '#f59e42', '#6366f1'];

const AdminDashboard = () => {
  const [admissions, setAdmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const response = await fetch('/api/admissions');
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
      await fetch(`/api/admissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAdmissions(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Dashboard summary
  const total = admissions.length;
  const approved = admissions.filter(a => a.status === 'Approved').length;
  const pending = admissions.filter(a => a.status === 'Pending').length;

  // --- Chart Data Processing ---
  // 1. Admissions per month
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
    // Sort by year then month
    const [ma, ya] = a.month.split(' ');
    const [mb, yb] = b.month.split(' ');
    return ya !== yb ? ya - yb : monthNames.indexOf(ma) - monthNames.indexOf(mb);
  });

  // 2. Admissions per course
  const admissionsByCourse = {};
  admissions.forEach(a => {
    const course = a.course || 'Unknown';
    admissionsByCourse[course] = (admissionsByCourse[course] || 0) + 1;
  });
  const courseChartData = Object.entries(admissionsByCourse).map(([course, value]) => ({ name: course, value }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, paddingTop: '80px' }}>
      <Box display="flex" alignItems="center" mb={4} gap={2}>
        <DashboardIcon sx={{ fontSize: 40, color: '#4a90e2' }} />
        <Typography variant="h4" fontWeight={700} color="#222">
          Admin Dashboard
        </Typography>
      </Box>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #4a90e2 60%, #2563eb 100%)', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Admissions</Typography>
              <Typography variant="h4" fontWeight={700}>{total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #10b981 60%, #22d3ee 100%)', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <AssignmentTurnedInIcon />
                <Typography variant="h6" gutterBottom>Approved</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>{approved}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #fbbf24 60%, #f59e42 100%)', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <PendingActionsIcon />
                <Typography variant="h6" gutterBottom>Pending</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>{pending}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 4, height: 350 }}>
            <Typography variant="h6" mb={2} fontWeight={600}>Admissions Per Month</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthChartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="month" stroke="#888" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4a90e2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 4, height: 350 }}>
            <Typography variant="h6" mb={2} fontWeight={600}>Admissions By Course</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={courseChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {courseChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: 6 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: '#f0f9ff' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admissions.map((admission) => (
                <TableRow key={admission._id} hover>
                  <TableCell>{admission.name}</TableCell>
                  <TableCell>{admission.email}</TableCell>
                  <TableCell>{admission.course}</TableCell>
                  <TableCell>
                    <Chip 
                      label={admission.status}
                      color={admission.status === 'Approved' ? 'success' : 'warning'}
                      variant="filled"
                      sx={{ fontWeight: 600, fontSize: '1rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      onClick={() => handlePrint(admission)}
                      sx={{ mr: 1, borderRadius: 2 }}
                    >
                      Print
                    </Button>
                    <Button
                      variant="contained"
                      color={admission.status === 'Pending' ? 'success' : 'warning'}
                      size="small"
                      onClick={() => handleStatusUpdate(
                        admission._id,
                        admission.status === 'Pending' ? 'Approved' : 'Pending'
                      )}
                      sx={{ borderRadius: 2 }}
                    >
                      {admission.status === 'Pending' ? 'Approve' : 'Mark Pending'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
