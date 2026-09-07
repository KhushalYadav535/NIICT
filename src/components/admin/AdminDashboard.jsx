import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Box, Chip, Grid, 
  Card, CardContent, TextField, InputAdornment, Avatar, IconButton,
  Tooltip as MuiTooltip, LinearProgress, Pagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// MUI Icons
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
import QuizIcon from '@mui/icons-material/Quiz';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ForumIcon from '@mui/icons-material/Forum';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LaunchIcon from '@mui/icons-material/Launch';
import PrintIcon from '@mui/icons-material/Print';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DnsIcon from '@mui/icons-material/Dns';

// Recharts
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, CartesianGrid 
} from 'recharts';

const PIE_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#64748B'];

const AdminDashboard = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  const [extraStats, setExtraStats] = useState({
    competitions: 0,
    franchises: 0,
    courses: 0,
    tests: 0
  });

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Admissions
      const res = await fetch(`${API_BASE_URL}/api/admissions`);
      if (res.ok) {
        const data = await res.json();
        setAdmissions(Array.isArray(data) ? data : []);
      }

      // 2. Fetch parallel stats for holistic KPI
      const [coursesRes, compRes, franRes, testsRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/courses`),
        fetch(`${API_BASE_URL}/api/competition-applications`),
        fetch(`${API_BASE_URL}/api/franchise`),
        fetch(`${API_BASE_URL}/api/tests`)
      ]);

      const counts = {};
      if (coursesRes.status === 'fulfilled' && coursesRes.value.ok) {
        const d = await coursesRes.value.json();
        counts.courses = Array.isArray(d) ? d.length : (d.courses?.length || 0);
      }
      if (compRes.status === 'fulfilled' && compRes.value.ok) {
        const d = await compRes.value.json();
        counts.competitions = Array.isArray(d) ? d.length : (d.applications?.length || 0);
      }
      if (franRes.status === 'fulfilled' && franRes.value.ok) {
        const d = await franRes.value.json();
        counts.franchises = Array.isArray(d) ? d.length : 0;
      }
      if (testsRes.status === 'fulfilled' && testsRes.value.ok) {
        const d = await testsRes.value.json();
        counts.tests = Array.isArray(d) ? d.length : (d.tests?.length || 0);
      }
      setExtraStats(prev => ({ ...prev, ...counts }));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handlePrint = (admission) => {
    navigate(`/admin/print/${admission._id}`);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAdmissions(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently remove this admission record?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admissions/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setAdmissions(prev => prev.filter(a => a._id !== id));
        } else {
          alert('Failed to delete admission');
        }
      } catch (error) {
        console.error('Error deleting admission:', error);
      }
    }
  };

  // Metrics Calculations
  const total = admissions.length;
  const approved = admissions.filter(a => a.status === 'Approved').length;
  const pending = admissions.filter(a => a.status === 'Pending').length;
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;

  // Chart: Timeline Data
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

  // Chart: Course Distribution
  const admissionsByCourse = {};
  admissions.forEach(a => {
    const course = a.course || 'Other / General';
    admissionsByCourse[course] = (admissionsByCourse[course] || 0) + 1;
  });
  const courseChartData = Object.entries(admissionsByCourse).map(([name, value]) => ({ name, value }));

  // Quick Action Modules Catalog
  const allModules = [
    { title: 'Admissions & Students', category: 'Administration', icon: <HowToRegIcon />, path: '/admin', color: '#2563EB', desc: 'Manage new student enrolments & certificates' },
    { title: 'Course Catalog', category: 'Academics', icon: <SchoolIcon />, path: '/admin/courses', color: '#0284C7', desc: 'Programs, durations, syllabus & fees' },
    { title: 'GK & Talent Search', category: 'Exams', icon: <EmojiEventsIcon />, path: '/admin/competition', color: '#D97706', desc: 'Roll numbers, sessions & admit cards' },
    { title: 'Result Management', category: 'Exams', icon: <SchoolIcon />, path: '/admin/results', color: '#059669', desc: 'Marksheets, rankings & CSV export' },
    { title: 'Test Series / MCQ', category: 'Exams', icon: <QuizIcon />, path: '/admin/tests', color: '#7C3AED', desc: 'Live timed mock exams & question bank' },
    { title: 'Franchise Centers', category: 'Administration', icon: <StoreIcon />, path: '/admin/franchise', color: '#EA580C', desc: 'Center accreditations & applications' },
    { title: 'Live Class Schedule', category: 'Academics', icon: <CalendarMonthIcon />, path: '/admin/schedules', color: '#10B981', desc: 'Timetables & Google Meet lectures' },
    { title: 'Doubt Solver Forum', category: 'Academics', icon: <ForumIcon />, path: '/admin/doubts', color: '#6366F1', desc: 'Student technical questions & faculty solutions' },
    { title: 'Campus Placements', category: 'Career', icon: <WorkIcon />, path: '/admin/jobs', color: '#8B5CF6', desc: 'Job vacancies, salaries & internships' },
    { title: 'Tech News & Blog', category: 'Content', icon: <NewspaperIcon />, path: '/admin/news', color: '#EC4899', desc: 'Institute circulars & industry updates' },
    { title: 'Faculty Mentors', category: 'Academics', icon: <PeopleIcon />, path: '/admin/mentors', color: '#06B6D4', desc: 'Faculty profiles & guidance booking' },
    { title: 'Flashcards Byte', category: 'Content', icon: <ViewCarouselIcon />, path: '/admin/flashcards', color: '#14B8A6', desc: 'Quick-revision computer shortcuts & notes' },
    { title: 'Previous Papers', category: 'Content', icon: <DescriptionIcon />, path: '/admin/papers', color: '#9333EA', desc: 'CCC, DCA & Tally past exam question papers' },
    { title: 'Interview Prep', category: 'Career', icon: <QuestionAnswerIcon />, path: '/admin/interview', color: '#E11D48', desc: 'Common HR & technical Q&As with model answers' }
  ];

  const filteredModules = useMemo(() => {
    if (moduleFilter === 'All') return allModules;
    return allModules.filter(m => m.category === moduleFilter);
  }, [moduleFilter]);

  // Filtered Admissions Table
  const filteredAdmissions = useMemo(() => {
    return admissions.filter(a => {
      const matchSearch = 
        (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.course || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.phone || '').includes(searchTerm);
      
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [admissions, searchTerm, statusFilter]);

  const paginatedAdmissions = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredAdmissions.slice(start, start + rowsPerPage);
  }, [filteredAdmissions, page]);

  const totalPages = Math.ceil(filteredAdmissions.length / rowsPerPage) || 1;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC', pt: 3.5, pb: 10 }}>
      {/* Ambient background glows */}
      <Box sx={{ position: 'fixed', top: '-10%', left: '-5%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '-10%', right: '-5%', width: '45vw', height: '45vw', background: 'radial-gradient(circle, rgba(16,185,129,0.03) 0%, rgba(248,250,252,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* 1. HERO EXECUTIVE WELCOME BANNER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Paper 
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              mb: 4,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.05)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'flex-start', md: 'center' },
              justifyContent: 'space-between',
              gap: 3
            }}
          >
            <Box display="flex" alignItems="center" gap={2.5}>
              <Box sx={{ 
                width: 60, height: 60, borderRadius: '18px', 
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                boxShadow: '0 10px 25px -5px rgba(37,99,235,0.4)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff'
              }}>
                <DashboardIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                  <Typography variant="h4" fontWeight={800} color="#0F172A" sx={{ letterSpacing: '-0.5px' }}>
                    Command <span style={{ color: '#2563EB' }}>Center</span>
                  </Typography>
                  <Chip 
                    label="System Live"
                    size="small"
                    icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981', ml: 1, boxShadow: '0 0 8px #10B981' }} />}
                    sx={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', fontWeight: 700, fontSize: '0.75rem' }}
                  />
                </Box>
                <Typography variant="body2" color="#64748B" sx={{ mt: 0.5 }}>
                  Welcome back! Real-time operations monitoring, admissions, examinations, and center management.
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
              <Button 
                variant="outlined"
                size="medium"
                startIcon={<RefreshIcon className={refreshing ? 'animate-spin' : ''} />}
                onClick={handleRefresh}
                sx={{
                  borderColor: '#E2E8F0',
                  color: '#475569',
                  backgroundColor: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: 2,
                  py: 1,
                  boxShadow: '0 2px 6px rgba(15,23,42,0.03)',
                  '&:hover': { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1' }
                }}
              >
                Refresh Data
              </Button>
              <Button 
                variant="contained"
                size="medium"
                endIcon={<LaunchIcon sx={{ fontSize: 16 }} />}
                onClick={() => window.open('/', '_blank')}
                sx={{
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: 2.5,
                  py: 1,
                  boxShadow: '0 6px 16px -2px rgba(37,99,235,0.3)',
                  '&:hover': { background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)' }
                }}
              >
                View Live Site
              </Button>
            </Box>
          </Paper>
        </motion.div>

        {/* 2. EXECUTIVE 4-PILLAR KPI CARDS */}
        <Grid container spacing={3} mb={4.5}>
          {/* Pillar 1: Total Enrolled Admissions */}
          <Grid item xs={12} sm={6} lg={3}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
              <Card sx={{ 
                background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', 
                p: 3, boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)', position: 'relative', overflow: 'hidden' 
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                      Total Admissions
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#0F172A', mt: 0.5, letterSpacing: '-1px' }}>
                      {total}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: '14px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE' }}>
                    <HowToRegIcon sx={{ fontSize: 26 }} />
                  </Box>
                </Box>
                <Box mt={2.5}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption" color="#64748B" fontWeight={600}>Approval Ratio</Typography>
                    <Typography variant="caption" color="#2563EB" fontWeight={700}>{approvalRate}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={approvalRate} 
                    sx={{ height: 6, borderRadius: 3, backgroundColor: '#EFF6FF', '& .MuiLinearProgress-bar': { backgroundColor: '#2563EB', borderRadius: 3 } }}
                  />
                </Box>
              </Card>
            </motion.div>
          </Grid>

          {/* Pillar 2: Verified Enrollees */}
          <Grid item xs={12} sm={6} lg={3}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
              <Card sx={{ 
                background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', 
                p: 3, boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)', position: 'relative', overflow: 'hidden' 
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                      Approved Students
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#059669', mt: 0.5, letterSpacing: '-1px' }}>
                      {approved}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: '14px', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                    <AssignmentTurnedInIcon sx={{ fontSize: 26 }} />
                  </Box>
                </Box>
                <Box mt={2.5} display="flex" alignItems="center" gap={1}>
                  <Chip 
                    label="Active & Verified"
                    size="small"
                    sx={{ backgroundColor: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #A7F3D0' }}
                  />
                  <Typography variant="caption" color="#64748B">In training</Typography>
                </Box>
              </Card>
            </motion.div>
          </Grid>

          {/* Pillar 3: Pending Applications */}
          <Grid item xs={12} sm={6} lg={3}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
              <Card sx={{ 
                background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', 
                p: 3, boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)', position: 'relative', overflow: 'hidden' 
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                      Pending Review
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#D97706', mt: 0.5, letterSpacing: '-1px' }}>
                      {pending}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: '14px', background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}>
                    <PendingActionsIcon sx={{ fontSize: 26 }} />
                  </Box>
                </Box>
                <Box mt={2.5} display="flex" alignItems="center" gap={1}>
                  <Chip 
                    label={pending > 0 ? "Action Required" : "All Cleared"}
                    size="small"
                    sx={{ 
                      backgroundColor: pending > 0 ? '#FFFBEB' : '#ECFDF5', 
                      color: pending > 0 ? '#D97706' : '#059669', 
                      fontWeight: 700, 
                      fontSize: '0.72rem',
                      border: `1px solid ${pending > 0 ? '#FDE68A' : '#A7F3D0'}` 
                    }}
                  />
                  <Typography variant="caption" color="#64748B">Awaiting verification</Typography>
                </Box>
              </Card>
            </motion.div>
          </Grid>

          {/* Pillar 4: Talent Search & Network */}
          <Grid item xs={12} sm={6} lg={3}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
              <Card sx={{ 
                background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', 
                p: 3, boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)', position: 'relative', overflow: 'hidden' 
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                      GK Exam Applicants
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#7C3AED', mt: 0.5, letterSpacing: '-1px' }}>
                      {extraStats.competitions}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.5, borderRadius: '14px', background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE' }}>
                    <EmojiEventsIcon sx={{ fontSize: 26 }} />
                  </Box>
                </Box>
                <Box mt={2.5} display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" color="#64748B">
                    {extraStats.franchises} Centers &bull; {extraStats.courses} Courses
                  </Typography>
                  <Button 
                    size="small" 
                    onClick={() => navigate('/admin/competition')}
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', p: 0, minWidth: 0, color: '#7C3AED' }}
                  >
                    View
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* 3. OPERATIONS LAUNCHPAD (MODULE HUBS) */}
        <Box mb={5}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5} flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#0F172A">
                Operations Launchpad
              </Typography>
              <Typography variant="body2" color="#64748B">
                Quick access to all 14 institute administrative modules and portals.
              </Typography>
            </Box>

            {/* Category Filter Pills */}
            <Box display="flex" gap={1} flexWrap="wrap">
              {['All', 'Academics', 'Exams', 'Career', 'Content', 'Administration'].map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => setModuleFilter(cat)}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    backgroundColor: moduleFilter === cat ? '#2563EB' : '#FFFFFF',
                    color: moduleFilter === cat ? '#FFFFFF' : '#475569',
                    border: `1px solid ${moduleFilter === cat ? '#2563EB' : '#E2E8F0'}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: moduleFilter === cat ? '#1D4ED8' : '#F1F5F9'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

          <Grid container spacing={2}>
            {filteredModules.map((item, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Paper
                    onClick={() => navigate(item.path)}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: '16px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(15,23,42,0.03)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        borderColor: item.color,
                        boxShadow: `0 10px 24px -6px ${item.color}25`
                      }
                    }}
                  >
                    <Box sx={{
                      width: 48, height: 48, borderRadius: '12px',
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {React.cloneElement(item.icon, { sx: { fontSize: 24 } })}
                    </Box>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: item.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.68rem' }}>
                          {item.category}
                        </Typography>
                        <ArrowForwardIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
                      </Box>
                      <Typography variant="subtitle2" fontWeight={700} color="#0F172A" noWrap sx={{ fontSize: '0.92rem' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="caption" color="#64748B" noWrap sx={{ display: 'block', fontSize: '0.75rem' }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* 4. EXECUTIVE ANALYTICS: ADMISSIONS TIMELINE & COURSE DISTRIBUTION */}
        <Grid container spacing={3} mb={5}>
          {/* Monthly Trend Area Chart */}
          <Grid item xs={12} lg={7}>
            <Paper elevation={0} sx={{ p: 3.5, borderRadius: '20px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)', height: 410 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#0F172A">
                    Admissions Recruitment Trend
                  </Typography>
                  <Typography variant="caption" color="#64748B">
                    Monthly new student enrollments across all centers
                  </Typography>
                </Box>
                <Chip 
                  icon={<TrendingUpIcon sx={{ fontSize: 16 }} />} 
                  label="Session Active" 
                  size="small" 
                  sx={{ backgroundColor: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', fontWeight: 700 }}
                />
              </Box>

              <ResponsiveContainer width="100%" height={310}>
                <AreaChart data={monthChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="admissionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.22}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                  <YAxis allowDecimals={false} stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 25px -4px rgba(0,0,0,0.08)', fontWeight: 600, color: '#0F172A' }} />
                  <Area type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#admissionGradient)" dot={{ r: 4, fill: '#2563EB', stroke: '#FFFFFF', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#1D4ED8', stroke: '#EFF6FF', strokeWidth: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Course Distribution Donut Chart */}
          <Grid item xs={12} lg={5}>
            <Paper elevation={0} sx={{ p: 3.5, borderRadius: '20px', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)', height: 410 }}>
              <Box mb={1}>
                <Typography variant="h6" fontWeight={800} color="#0F172A">
                  Course Enrollment Distribution
                </Typography>
                <Typography variant="caption" color="#64748B">
                  Proportion of students enrolled by program
                </Typography>
              </Box>

              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={courseChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="46%"
                    innerRadius={68}
                    outerRadius={95}
                    paddingAngle={4}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  >
                    {courseChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ color: '#475569', fontSize: 11, fontWeight: 600, paddingTop: 10 }} 
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#0F172A', fontWeight: 600, boxShadow: '0 10px 25px -4px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* 5. RECENT ADMISSIONS DIRECTORY */}
        <Paper elevation={0} sx={{ borderRadius: '20px', overflow: 'hidden', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)' }}>
          {/* Card Header & Search / Filter Controls */}
          <Box sx={{ p: 3.5, borderBottom: '1px solid #E2E8F0', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2.5 }}>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#0F172A">
                Student Admissions Directory
              </Typography>
              <Typography variant="body2" color="#64748B">
                Showing {filteredAdmissions.length} of {total} registered student admissions
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap" sx={{ width: { xs: '100%', md: 'auto' } }}>
              {/* Search Box */}
              <TextField 
                size="small"
                placeholder="Search candidate, email, course..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94A3B8', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  minWidth: { xs: '100%', sm: 260 },
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': { borderColor: '#E2E8F0' },
                    '&:hover fieldset': { borderColor: '#CBD5E1' },
                    '&.Mui-focused fieldset': { borderColor: '#2563EB' }
                  }
                }}
              />

              {/* Status Filter Buttons */}
              <Box display="flex" gap={0.5} sx={{ backgroundColor: '#F1F5F9', p: 0.5, borderRadius: '12px' }}>
                {['All', 'Approved', 'Pending'].map((st) => (
                  <Button
                    key={st}
                    size="small"
                    onClick={() => { setStatusFilter(st); setPage(1); }}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      px: 1.8,
                      py: 0.5,
                      borderRadius: '8px',
                      backgroundColor: statusFilter === st ? '#FFFFFF' : 'transparent',
                      color: statusFilter === st ? '#0F172A' : '#64748B',
                      boxShadow: statusFilter === st ? '0 1px 4px rgba(0,0,0,0.05)' : 'none',
                      '&:hover': { backgroundColor: statusFilter === st ? '#FFFFFF' : '#E2E8F0' }
                    }}
                  >
                    {st}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer>
            <Table>
              <TableHead sx={{ background: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Candidate</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Program / Course</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Date of Admission</TableCell>
                  <TableCell sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Status</TableCell>
                  <TableCell align="right" sx={{ color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem', py: 2 }}>Management</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAdmissions.map((admission) => (
                  <TableRow key={admission._id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC !important' } }}>
                    {/* Candidate with avatar */}
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Box display="flex" alignItems="center" gap={1.8}>
                        <Avatar sx={{ 
                          width: 40, height: 40, 
                          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', 
                          color: '#fff', fontWeight: 700, fontSize: '0.9rem' 
                        }}>
                          {(admission.name || 'S').charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ color: '#0F172A', fontWeight: 700, fontSize: '0.92rem' }}>
                            {admission.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>
                            {admission.email || 'No email provided'} &bull; {admission.phone || 'No phone'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Course */}
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Chip 
                        label={admission.course || 'General'}
                        size="small"
                        sx={{ 
                          backgroundColor: '#EFF6FF', 
                          color: '#2563EB', 
                          fontWeight: 700, 
                          border: '1px solid #BFDBFE',
                          borderRadius: '8px'
                        }}
                      />
                    </TableCell>

                    {/* Date */}
                    <TableCell sx={{ color: '#475569', fontWeight: 500, fontSize: '0.88rem', borderBottom: '1px solid #F1F5F9' }}>
                      {new Date(admission.dateOfAdmission || admission.applicationDate || admission.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>

                    {/* Status Chip */}
                    <TableCell sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Chip 
                        label={admission.status}
                        size="small"
                        icon={
                          <Box sx={{ 
                            width: 6, height: 6, borderRadius: '50%', 
                            backgroundColor: admission.status === 'Approved' ? '#059669' : '#D97706',
                            ml: 1
                          }} />
                        }
                        sx={{ 
                          fontWeight: 700, 
                          backgroundColor: admission.status === 'Approved' ? '#ECFDF5' : '#FFFBEB',
                          color: admission.status === 'Approved' ? '#059669' : '#D97706',
                          border: `1px solid ${admission.status === 'Approved' ? '#A7F3D0' : '#FDE68A'}`,
                          borderRadius: '8px',
                          px: 0.5
                        }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ borderBottom: '1px solid #F1F5F9' }}>
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <MuiTooltip title="Print Official Admission Certificate">
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handlePrint(admission)}
                            startIcon={<PrintIcon sx={{ fontSize: 15 }} />}
                            sx={{ 
                              color: '#2563EB', 
                              borderColor: '#BFDBFE', 
                              backgroundColor: '#EFF6FF',
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: '10px',
                              px: 1.5,
                              '&:hover': { borderColor: '#2563EB', background: '#DBEAFE' } 
                            }}
                          >
                            Print
                          </Button>
                        </MuiTooltip>

                        <MuiTooltip title={admission.status === 'Pending' ? 'Approve Admission' : 'Revert to Pending'}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleStatusUpdate(
                              admission._id,
                              admission.status === 'Pending' ? 'Approved' : 'Pending'
                            )}
                            startIcon={admission.status === 'Pending' ? <CheckCircleOutlineIcon sx={{ fontSize: 15 }} /> : <ReplayIcon sx={{ fontSize: 15 }} />}
                            sx={{ 
                              color: admission.status === 'Pending' ? '#059669' : '#D97706', 
                              borderColor: admission.status === 'Pending' ? '#A7F3D0' : '#FDE68A',
                              backgroundColor: admission.status === 'Pending' ? '#ECFDF5' : '#FFFBEB',
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: '10px',
                              px: 1.5,
                              '&:hover': { 
                                borderColor: admission.status === 'Pending' ? '#059669' : '#D97706', 
                                background: admission.status === 'Pending' ? '#D1FAE5' : '#FEF3C7' 
                              } 
                            }}
                          >
                            {admission.status === 'Pending' ? 'Approve' : 'Revert'}
                          </Button>
                        </MuiTooltip>

                        <MuiTooltip title="Delete Record">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(admission._id)}
                            sx={{ 
                              color: '#DC2626', 
                              borderColor: '#FECACA', 
                              backgroundColor: '#FEF2F2',
                              border: '1px solid #FECACA',
                              borderRadius: '10px',
                              p: 0.8,
                              '&:hover': { background: '#FEE2E2', borderColor: '#DC2626' } 
                            }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </MuiTooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Empty state */}
          {paginatedAdmissions.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="#64748B" fontWeight={600}>
                No admissions found
              </Typography>
              <Typography variant="body2" color="#94A3B8">
                Try adjusting your search query or status filter.
              </Typography>
            </Box>
          )}

          {/* Pagination Footer */}
          <Box sx={{ p: 2.5, borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" color="#64748B">
              Page {page} of {totalPages}
            </Typography>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(e, val) => setPage(val)}
              color="primary"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: '8px',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    backgroundColor: '#2563EB',
                    color: '#fff'
                  }
                }
              }}
            />
          </Box>
        </Paper>

      </Container>
    </Box>
  );
};

export default AdminDashboard;
