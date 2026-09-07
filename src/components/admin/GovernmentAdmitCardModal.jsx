import React, { useState, useRef } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Box, Typography, IconButton, Chip 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BadgeIcon from '@mui/icons-material/Badge';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { 
  generateAdmitCardHtml, 
  generateApplicationFormHtml, 
  openAdmitCardPrintWindow, 
  openApplicationFormPrintWindow 
} from '../../utils/admitCardGenerator';

const GovernmentAdmitCardModal = ({ open, onClose, application, initialDocType = 'admit_card' }) => {
  const [docType, setDocType] = useState(initialDocType);
  const iframeRef = useRef(null);

  // Sync state if initialDocType changes
  React.useEffect(() => {
    if (initialDocType) {
      setDocType(initialDocType);
    }
  }, [initialDocType, open]);

  if (!application) return null;

  const isAdmitCard = docType === 'admit_card';
  const htmlContent = isAdmitCard 
    ? generateAdmitCardHtml(application) 
    : generateApplicationFormHtml(application);

  const handlePrint = () => {
    if (isAdmitCard) {
      openAdmitCardPrintWindow(application);
    } else {
      openApplicationFormPrintWindow(application);
    }
  };

  const handleSavePdf = () => {
    handlePrint();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          background: '#0F172A',
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          maxHeight: '92vh'
        }
      }}
    >
      {/* Modal Top Control Bar */}
      <DialogTitle sx={{ 
        m: 0, p: 2.5, 
        background: '#1E293B', 
        borderBottom: '1px solid #334155',
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-start', md: 'center' }, 
        justifyContent: 'space-between',
        gap: 2
      }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box sx={{ 
            width: 42, height: 42, borderRadius: '12px', 
            background: isAdmitCard 
              ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' 
              : 'linear-gradient(135deg, #059669, #047857)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            {isAdmitCard ? <BadgeIcon sx={{ fontSize: 24 }} /> : <ReceiptLongIcon sx={{ fontSize: 24 }} />}
          </Box>
          <Box>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="h6" fontWeight={800} color="#FFFFFF" sx={{ letterSpacing: '0.5px' }}>
                {isAdmitCard ? 'E-Admit Card (Exam Hall Ticket)' : 'Application Form & Fee Confirmation Receipt'}
              </Typography>
              <Chip 
                label={isAdmitCard ? 'EXAM ADMIT CARD' : 'CONFIRMATION & PAYMENT'} 
                size="small" 
                sx={{ 
                  backgroundColor: isAdmitCard ? 'rgba(37,99,235,0.2)' : 'rgba(16,185,129,0.2)', 
                  color: isAdmitCard ? '#60A5FA' : '#34D399', 
                  border: `1px solid ${isAdmitCard ? '#2563EB' : '#10B981'}`, 
                  fontWeight: 800, 
                  fontSize: '0.68rem',
                  letterSpacing: '0.5px'
                }} 
              />
            </Box>
            <Typography variant="caption" color="#94A3B8">
              Candidate: <strong style={{ color: '#F1F5F9' }}>{application.name}</strong> &bull; Roll No: <strong style={{ color: '#F59E0B' }}>{application.rollNumber}</strong> &bull; Official A4 Format
            </Typography>
          </Box>
        </Box>

        {/* Document Switcher & Print Controls */}
        <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
          {/* Document Switcher Tabs */}
          <Box sx={{ background: '#0F172A', p: 0.5, borderRadius: '12px', border: '1px solid #334155', display: 'flex', gap: 0.5 }}>
            <Button
              size="small"
              onClick={() => setDocType('admit_card')}
              startIcon={<BadgeIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                px: 1.5,
                py: 0.6,
                borderRadius: '8px',
                backgroundColor: isAdmitCard ? '#2563EB' : 'transparent',
                color: isAdmitCard ? '#FFFFFF' : '#94A3B8',
                boxShadow: isAdmitCard ? '0 2px 8px rgba(37,99,235,0.4)' : 'none',
                '&:hover': { backgroundColor: isAdmitCard ? '#1D4ED8' : 'rgba(255,255,255,0.06)' }
              }}
            >
              E-Admit Card
            </Button>
            <Button
              size="small"
              onClick={() => setDocType('application_form')}
              startIcon={<ReceiptLongIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.78rem',
                px: 1.5,
                py: 0.6,
                borderRadius: '8px',
                backgroundColor: !isAdmitCard ? '#059669' : 'transparent',
                color: !isAdmitCard ? '#FFFFFF' : '#94A3B8',
                boxShadow: !isAdmitCard ? '0 2px 8px rgba(16,185,129,0.4)' : 'none',
                '&:hover': { backgroundColor: !isAdmitCard ? '#047857' : 'rgba(255,255,255,0.06)' }
              }}
            >
              Application &amp; Fee Slip
            </Button>
          </Box>

          <Button
            variant="contained"
            size="small"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              background: isAdmitCard ? 'linear-gradient(135deg, #2563EB, #1D4ED8)' : 'linear-gradient(135deg, #059669, #047857)',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
              px: 2.2,
              py: 0.8,
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              '&:hover': { filter: 'brightness(1.1)' }
            }}
          >
            {isAdmitCard ? 'Print Admit Card' : 'Print Application Form'}
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={handleSavePdf}
            sx={{
              borderColor: '#475569',
              color: '#CBD5E1',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '10px',
              px: 2,
              '&:hover': { borderColor: '#94A3B8', backgroundColor: 'rgba(255,255,255,0.05)' }
            }}
          >
            Save PDF
          </Button>

          <IconButton 
            onClick={onClose} 
            sx={{ color: '#94A3B8', '&:hover': { color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.1)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Realistic Document Viewport */}
      <DialogContent sx={{ 
        p: 0, 
        backgroundColor: '#334155', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        overflowY: 'auto',
        minHeight: '650px'
      }}>
        <Box sx={{ 
          width: '100%', 
          height: '750px', 
          display: 'flex', 
          justifyContent: 'center', 
          p: { xs: 1, md: 3 } 
        }}>
          <iframe 
            ref={iframeRef}
            srcDoc={htmlContent}
            title="Document Preview"
            style={{
              width: '100%',
              maxWidth: '850px',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              backgroundColor: '#FFFFFF'
            }}
          />
        </Box>
      </DialogContent>

      {/* Modal Bottom Bar */}
      <DialogActions sx={{ 
        p: 2, 
        background: '#1E293B', 
        borderTop: '1px solid #334155',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center' 
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <CheckCircleIcon sx={{ color: '#10B981', fontSize: 18 }} />
          <Typography variant="caption" color="#94A3B8">
            {isAdmitCard 
              ? 'E-Admit Card: Examination hall entry document (Contains roll no, center, timings & rules).'
              : 'Application Form: Registration confirmation with complete candidate data & verified payment transaction details.'
            }
          </Typography>
        </Box>
        <Button 
          onClick={onClose}
          sx={{ 
            color: '#94A3B8', 
            textTransform: 'none', 
            fontWeight: 600,
            '&:hover': { color: '#FFFFFF' } 
          }}
        >
          Close Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GovernmentAdmitCardModal;
