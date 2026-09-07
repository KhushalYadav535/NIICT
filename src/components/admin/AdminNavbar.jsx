import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Box, Container, Typography, Button, IconButton, Menu, MenuItem, 
  Chip, Tooltip 
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import QuizIcon from '@mui/icons-material/Quiz';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ForumIcon from '@mui/icons-material/Forum';
import StoreIcon from '@mui/icons-material/Store';
import WorkIcon from '@mui/icons-material/Work';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import PeopleIcon from '@mui/icons-material/People';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import DescriptionIcon from '@mui/icons-material/Description';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon sx={{ fontSize: 18 }} /> },
  { label: 'Admissions', path: '/admin/dashboard', icon: <DashboardIcon sx={{ fontSize: 18 }} /> },
  { label: 'GK Competition', path: '/admin/competition', icon: <EmojiEventsIcon sx={{ fontSize: 18 }} /> },
  { label: 'Courses', path: '/admin/courses', icon: <SchoolIcon sx={{ fontSize: 18 }} /> },
  { label: 'Test Series', path: '/admin/tests', icon: <QuizIcon sx={{ fontSize: 18 }} /> },
  { label: 'Live Schedules', path: '/admin/schedules', icon: <CalendarMonthIcon sx={{ fontSize: 18 }} /> },
  { label: 'Doubt Forum', path: '/admin/doubts', icon: <ForumIcon sx={{ fontSize: 18 }} /> },
  { label: 'Results', path: '/admin/results', icon: <EmojiEventsIcon sx={{ fontSize: 18 }} /> },
  { label: 'Franchise', path: '/admin/franchise', icon: <StoreIcon sx={{ fontSize: 18 }} /> },
  { label: 'Jobs', path: '/admin/jobs', icon: <WorkIcon sx={{ fontSize: 18 }} /> },
  { label: 'News & Updates', path: '/admin/news', icon: <NewspaperIcon sx={{ fontSize: 18 }} /> },
  { label: 'Mentors', path: '/admin/mentors', icon: <PeopleIcon sx={{ fontSize: 18 }} /> },
  { label: 'Flashcards', path: '/admin/flashcards', icon: <ViewCarouselIcon sx={{ fontSize: 18 }} /> },
  { label: 'Question Papers', path: '/admin/papers', icon: <DescriptionIcon sx={{ fontSize: 18 }} /> },
  { label: 'Interview Prep', path: '/admin/interview', icon: <QuestionAnswerIcon sx={{ fontSize: 18 }} /> }
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navAnchor, setNavAnchor] = useState(null);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of Admin Portal?')) {
      localStorage.removeItem('adminToken');
      navigate('/admin-login');
    }
  };

  const isDashboard = location.pathname === '/admin/dashboard';
  const currentItem = NAV_ITEMS.find(item => item.path === location.pathname);

  return (
    <Box 
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 2px 12px -2px rgba(15, 23, 42, 0.05)',
        transition: 'all 0.2s ease'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Left: Brand + Navigation Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box 
              onClick={() => navigate('/admin/dashboard')}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: 2.5, 
                  background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                  color: '#fff'
                }}
              >
                <SchoolIcon sx={{ fontSize: 22 }} />
              </Box>
              <Box>
                <Typography 
                  variant="subtitle1" 
                  fontWeight={800} 
                  sx={{ color: '#0F172A', lineHeight: 1.1, letterSpacing: '0.5px' }}
                >
                  NIICT <span style={{ color: '#2563EB' }}>Admin</span>
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.65rem' }}
                >
                  Management Portal
                </Typography>
              </Box>
            </Box>

            {/* Quick Modules Menu Trigger */}
            <Button
              onClick={(e) => setNavAnchor(e.currentTarget)}
              endIcon={<KeyboardArrowDownIcon />}
              variant="outlined"
              size="small"
              sx={{
                ml: 1,
                borderColor: '#E2E8F0',
                color: '#334155',
                backgroundColor: '#F8FAFC',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                px: 1.5,
                '&:hover': {
                  borderColor: '#CBD5E1',
                  backgroundColor: '#F1F5F9'
                }
              }}
            >
              Modules
            </Button>

            <Menu
              anchorEl={navAnchor}
              open={Boolean(navAnchor)}
              onClose={() => setNavAnchor(null)}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: 3,
                  boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.05)',
                  border: '1px solid #E2E8F0',
                  minWidth: 240,
                  p: 1
                }
              }}
            >
              <Typography sx={{ px: 2, py: 1, fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                All Modules
              </Typography>
              {NAV_ITEMS.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <MenuItem
                    key={idx}
                    onClick={() => {
                      navigate(item.path);
                      setNavAnchor(null);
                    }}
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      my: 0.3,
                      display: 'flex',
                      gap: 1.5,
                      color: isActive ? '#2563EB' : '#334155',
                      fontWeight: isActive ? 700 : 500,
                      backgroundColor: isActive ? '#EFF6FF !important' : 'transparent',
                      '&:hover': {
                        backgroundColor: '#F8FAFC'
                      }
                    }}
                  >
                    <Box sx={{ color: isActive ? '#2563EB' : '#64748B', display: 'flex' }}>
                      {item.icon}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                      {item.label}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Menu>

            {/* Breadcrumb / Current Route Indicator */}
            {!isDashboard && (
              <Chip
                label={currentItem ? currentItem.label : 'Active'}
                size="small"
                sx={{
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  border: '1px solid #BFDBFE',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
              />
            )}
          </Box>

          {/* Right: Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {!isDashboard && (
              <Button
                variant="text"
                size="small"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/admin/dashboard')}
                sx={{
                  color: '#475569',
                  fontWeight: 600,
                  textTransform: 'none',
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:hover': {
                    color: '#0F172A',
                    backgroundColor: '#F1F5F9'
                  }
                }}
              >
                Dashboard
              </Button>
            )}

            <Button
              variant="outlined"
              size="small"
              startIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
              onClick={() => window.open('/', '_blank')}
              sx={{
                borderColor: '#E2E8F0',
                color: '#475569',
                backgroundColor: '#FFFFFF',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#CBD5E1',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A'
                }
              }}
            >
              Website
            </Button>

            <Tooltip title="Log out of Admin">
              <Button
                variant="contained"
                size="small"
                startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
                onClick={handleLogout}
                sx={{
                  backgroundColor: '#FEE2E2',
                  color: '#DC2626',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  boxShadow: 'none',
                  border: '1px solid #FECACA',
                  '&:hover': {
                    backgroundColor: '#FCA5A5',
                    color: '#B91C1C',
                    boxShadow: 'none'
                  }
                }}
              >
                Logout
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminNavbar;
