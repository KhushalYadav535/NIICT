import React, { useState } from 'react';
import {
  Container, Typography, Paper, TextField, Button, Box, Grid,
  FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import {
  FaTrophy, FaCalendarAlt, FaClock, FaMapMarkerAlt,
  FaCheckCircle, FaCreditCard, FaDownload, FaEye, FaShieldAlt
} from 'react-icons/fa';

/* ─── Design Tokens ─────────────────────────────────────── */
const C = {
  paper: '#FFFFFF',
  canvas: '#F6F5FB',
  ink: '#1E1B3A',
  inkSoft: '#6B6785',
  accent: '#5B3DF5',
  accentSoft: 'rgba(91,61,245,0.08)',
  accentMid: 'rgba(91,61,245,0.18)',
  gold: '#C89B3C',
  goldSoft: 'rgba(200,155,60,0.10)',
  border: '#E4E1F0',
  success: '#16a34a',
  successSoft: 'rgba(22,163,74,0.08)',
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    background: C.paper,
    minHeight: 58,
    fontSize: '1rem',
    color: C.ink,
    transition: 'all 0.25s ease',
    '& fieldset': { borderColor: C.border, borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: C.accent },
    '&.Mui-focused fieldset': { borderColor: C.accent, borderWidth: '2px', boxShadow: `0 0 0 4px ${C.accentSoft}` },
  },
  '& .MuiInputLabel-root': { color: C.inkSoft, fontSize: '0.95rem', fontWeight: 500 },
  '& .MuiInputLabel-root.Mui-focused': { color: C.accent, fontWeight: 600 },
  '& .MuiFormHelperText-root': { color: C.inkSoft, marginLeft: 0, fontSize: '0.8rem' },
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');

// Current academic/exam session — update this each year
const CURRENT_SESSION = '2026-2027';

/* ─── Step Bar ───────────────────────────────────────────── */
const STEPS = ['Fill Form', 'Review', 'Pay Rs.150', 'Admit Card'];

const StepBar = ({ current }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 5 }}>
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.85rem',
              background: done ? C.success : active ? C.accent : C.border,
              color: done || active ? '#fff' : C.inkSoft,
              transition: 'all 0.3s',
              boxShadow: active ? `0 4px 14px ${C.accentMid}` : 'none',
            }}>
              {done ? '✓' : i + 1}
            </Box>
            <Typography variant="caption" sx={{
              color: active ? C.accent : done ? C.success : C.inkSoft,
              fontWeight: active ? 700 : 500, whiteSpace: 'nowrap', fontSize: '0.7rem'
            }}>
              {label}
            </Typography>
          </Box>
          {i < STEPS.length - 1 && (
            <Box sx={{ flex: 1, height: 2, background: i < current ? C.success : C.border, mx: 1, mb: 3, transition: 'background 0.3s', maxWidth: 80 }} />
          )}
        </React.Fragment>
      );
    })}
  </Box>
);

/* ─── Preview Modal ──────────────────────────────────────── */
const PreviewModal = ({ open, formData, imagePreview, onConfirm, onEdit, loading }) => {
  const rows = [
    ['Full Name', formData.name],
    ['Phone', formData.phone],
    ["Father's Name", formData.fatherName],
    ["Mother's Name", formData.motherName],
    ['Date of Birth', formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('en-GB') : ''],
    ['Aadhaar', formData.aadhaar || 'Not provided'],
    ['School / College', formData.school],
    ['Class Passed', formData.classPassed],
    ['Parent Phone', formData.parentPhone || 'Not provided'],
    ['Address', formData.address],
  ];
  return (
    <Dialog open={open} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '24px', p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 800, color: C.ink, fontSize: '1.3rem', pb: 0 }}>
        Review Your Application
        <Typography variant="body2" color={C.inkSoft} sx={{ fontWeight: 400, mt: 0.5 }}>
          Verify all details before payment.
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {imagePreview && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <img src={imagePreview} alt="Student" style={{ width: 90, height: 112, objectFit: 'cover', borderRadius: 12, border: `3px solid ${C.border}` }} />
          </Box>
        )}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          {rows.map(([label, value]) => (
            <Box key={label} sx={{ background: C.canvas, p: 1.5, borderRadius: '12px', gridColumn: label === 'Address' ? 'span 2' : 'auto' }}>
              <Typography variant="caption" color={C.inkSoft} fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '0.65rem' }}>
                {label}
              </Typography>
              <Typography variant="body2" color={C.ink} fontWeight={600} sx={{ mt: 0.2, wordBreak: 'break-word' }}>
                {value || '—'}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3, p: 2.5, background: `linear-gradient(135deg, ${C.accentSoft}, ${C.goldSoft})`, borderRadius: '16px', border: `1px solid ${C.accentMid}`, display: 'flex', alignItems: 'center', gap: 2 }}>
          <FaCreditCard size={28} color={C.accent} />
          <Box>
            <Typography variant="body2" color={C.inkSoft} fontWeight={600}>Registration Fee</Typography>
            <Typography variant="h5" fontWeight={900} color={C.accent}>Rs. 150</Typography>
          </Box>
          <Box sx={{ ml: 'auto', textAlign: 'right' }}>
            <Typography variant="caption" color={C.inkSoft}>Secured by</Typography>
            <Typography variant="body2" fontWeight={700} color={C.ink}>Cashfree Payments</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1.5 }}>
        <Button onClick={onEdit} variant="outlined" sx={{ borderRadius: '12px', px: 3, fontWeight: 700, textTransform: 'none', borderColor: C.border, color: C.inkSoft, '&:hover': { borderColor: C.accent, color: C.accent } }}>
          Edit Details
        </Button>
        <Button onClick={onConfirm} variant="contained" disabled={loading}
          sx={{ borderRadius: '12px', px: 4, fontWeight: 800, textTransform: 'none', background: `linear-gradient(90deg, ${C.accent}, #7C5CFC)`, boxShadow: `0 8px 20px ${C.accentMid}` }}>
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Confirm & Pay Rs.150'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ─── Thank You Screen ───────────────────────────────────── */
const ThankYouScreen = ({ admitCardData, onDownload }) => (
  <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${C.canvas}, #fff)`, display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 10, pb: 8 }}>
    <Container maxWidth="sm">
      <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}>
        <Paper elevation={0} sx={{ p: 5, borderRadius: '32px', border: `1px solid ${C.border}`, textAlign: 'center', boxShadow: '0 30px 70px -25px rgba(30,27,58,0.15)' }}>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ delay: 0.3, duration: 0.5 }}>
            <Box sx={{ width: 100, height: 100, borderRadius: '50%', background: C.successSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
              <FaCheckCircle size={52} color={C.success} />
            </Box>
          </motion.div>
          <Typography variant="h4" fontWeight={900} color={C.ink} gutterBottom>Payment Successful!</Typography>
          <Typography variant="body1" color={C.inkSoft} sx={{ mb: 4 }}>
            Your registration for the <strong>GK &amp; Computer Competition</strong> is confirmed.
          </Typography>

          {/* Receipt */}
          <Box sx={{ background: C.canvas, borderRadius: '20px', p: 3, mb: 4, textAlign: 'left' }}>
            <Typography variant="subtitle2" fontWeight={800} color={C.ink} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaShieldAlt color={C.accent} /> Payment Receipt
            </Typography>
            <Divider sx={{ mb: 2, borderColor: C.border }} />
            {[
              ['Roll Number', admitCardData.rollNumber],
              ['Candidate Name', admitCardData.name],
              ['Amount Paid', 'Rs. 150'],
              ['Transaction ID', admitCardData.paymentTransactionId || 'N/A'],
              ['Payment Date', admitCardData.paidAt ? new Date(admitCardData.paidAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')],
              ['Status', 'PAID'],
            ].map(([k, v]) => (
              <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color={C.inkSoft}>{k}</Typography>
                <Typography variant="body2" fontWeight={700} color={k === 'Status' ? C.success : C.ink}>{v}</Typography>
              </Box>
            ))}
          </Box>

          <Button variant="contained" size="large" fullWidth onClick={onDownload} startIcon={<FaDownload />}
            sx={{ borderRadius: '16px', py: 1.8, fontWeight: 800, textTransform: 'none', fontSize: '1.05rem', background: `linear-gradient(90deg, ${C.accent}, #7C5CFC)`, boxShadow: `0 12px 28px ${C.accentMid}`, mb: 2 }}>
            Download Admit Card
          </Button>
          <Typography variant="caption" color={C.inkSoft}>
            Exam: 18 Oct 2026 | Result: 25 Oct 2026
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  </Box>
);

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const CompetitionForm = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '', phone: '', school: '', parentPhone: '', address: '',
    subject: 'GK', fatherName: '', motherName: '', aadhaar: '',
    dateOfBirth: '', classPassed: '', image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [admitCardData, setAdmitCardData] = useState(null);

  const setField = (name) => (e) => setFormData(p => ({ ...p, [name]: e.target.value }));

  /* ── Image Upload ── */
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Image must be less than 5MB'); return; }
    setUploadingImage(true); setError('');
    try {
      const mf = new FormData();
      mf.append('image', file);
      const mr = await fetch(`${BACKEND_URL}/api/upload-image-mongo`, { method: 'POST', body: mf });
      if (mr.ok) {
        const mj = await mr.json();
        if (mj.secure_url) { setFormData(p => ({ ...p, image: mj.secure_url })); setImagePreview(mj.secure_url); return; }
      }
      setError('Photo upload failed. You may continue without a photo.');
    } catch (_) {
      setError('Photo upload failed. You may continue without a photo.');
    } finally {
      setUploadingImage(false);
    }
  };

  /* ── Validation ── */
  const validate = () => {
    if (!formData.name || !formData.phone || !formData.school || !formData.address ||
      !formData.fatherName || !formData.motherName || !formData.dateOfBirth || !formData.classPassed) {
      setError('Please fill all required fields'); return false;
    }
    const today = new Date(), birth = new Date(formData.dateOfBirth);
    const age = today.getFullYear() - birth.getFullYear();
    const md = today.getMonth() - birth.getMonth();
    const actualAge = md < 0 || (md === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
    if (actualAge > 20) { setError('Only candidates aged 20 or below can register'); return false; }
    if (formData.aadhaar && !/^\d{12}$/.test(formData.aadhaar)) { setError('Aadhaar must be 12 digits'); return false; }
    return true;
  };

  /* ── Step 1: Open Preview ── */
  const handleOpenPreview = (e) => {
    e.preventDefault(); setError('');
    if (!validate()) return;
    setPreviewOpen(true);
  };

  /* ── Step 2: Save → Create Order → Open Cashfree ── */
  const handleConfirmAndPay = async () => {
    setLoading(true); setError('');
    let appId, orderId, enriched;
    try {
      // Save application
      const saveRes = await fetch(`${BACKEND_URL}/api/competition-applications`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, session: CURRENT_SESSION }),
      });
      const saved = await saveRes.json();
      if (!saveRes.ok) throw new Error(saved.message || 'Failed to save application');
      appId = saved._id;

      // Enrich for admit card
      const today2 = new Date(), b2 = new Date(saved.dateOfBirth);
      const age2 = today2.getFullYear() - b2.getFullYear();
      const md2 = today2.getMonth() - b2.getMonth();
      const actualAge2 = md2 < 0 || (md2 === 0 && today2.getDate() < b2.getDate()) ? age2 - 1 : age2;
      enriched = { ...saved, age: actualAge2, qrCode: `COMPETITION_${saved.rollNumber}_${saved.name.replace(/\s+/g, '_')}` };
      setAdmitCardData(enriched);

      // Create Cashfree order
      const orderRes = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: saved._id }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || 'Failed to create payment order');
      orderId = orderData.orderId;

      setPreviewOpen(false);

      // Open Cashfree checkout
      const { load } = await import('@cashfreepayments/cashfree-js');
      const cashfree = await load({ mode: 'sandbox' });
      cashfree.checkout({ paymentSessionId: orderData.paymentSessionId, redirectTarget: '_modal' })
        .then(async (result) => {
          if (result.error) { setError(`Payment failed: ${result.error.message}`); setLoading(false); return; }
          if (result.paymentDetails || result.redirect) {
            await verifyPayment(appId, orderId, enriched);
          }
        });
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  /* ── Verify Payment ── */
  const verifyPayment = async (appId, orderId, enriched) => {
    try {
      setStep(2);
      const vRes = await fetch(`${BACKEND_URL}/api/payment/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, orderId }),
      });
      const vData = await vRes.json();
      if (vRes.ok && vData.success) {
        setAdmitCardData(prev => ({ ...(prev || enriched), paymentTransactionId: vData.transactionId, paidAt: vData.paidAt, paymentStatus: 'paid', paymentAmount: 150 }));
        setStep(3);
      } else {
        setError('Payment verified but confirmation failed. Contact support with Order ID: ' + orderId);
        setStep(0);
      }
    } catch (err) {
      setError('Verification error: ' + err.message);
      setStep(0);
    } finally {
      setLoading(false);
    }
  };

  /* ── Print Admit Card ── */
  const printAdmitCard = () => {
    if (!admitCardData) return;
    const paidDate = admitCardData.paidAt ? new Date(admitCardData.paidAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN');
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>NIICT Admit Card - ${admitCardData.name}</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; font-family: 'Arial', sans-serif; }
body { padding: 15px; color: #000; background: #fff; }
.card { border: 2px solid #000; max-width: 800px; margin: 0 auto; background: #fff; }
.hdr { border-bottom: 2px solid #000; padding: 12px; text-align: center; }
.hdr h1 { font-size: 20px; font-weight: 900; margin-bottom: 4px; text-transform: uppercase; }
.hdr p { font-size: 11px; font-weight: 600; }
.title { text-align: center; font-size: 15px; font-weight: bold; padding: 8px; border-bottom: 2px solid #000; background: #e5e5e5; text-transform: uppercase; letter-spacing: 1px; }
.body { padding: 12px; }
.row-table { display: flex; border: 1px solid #000; margin-bottom: 8px; }
.col { border-right: 1px solid #000; padding: 6px 10px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.col:last-child { border-right: none; }
.col-label { font-size: 9px; font-weight: bold; color: #444; text-transform: uppercase; margin-bottom: 3px; }
.col-value { font-size: 13px; font-weight: bold; color: #000; text-transform: uppercase; }
.photo-box { width: 110px; height: 140px; border: 1px solid #000; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; color: #666; background: #f9f9f9; }
.photo-box img { width: 100%; height: 100%; object-fit: cover; }
.sec-title { font-size: 12px; font-weight: bold; background: #e5e5e5; padding: 6px 10px; border: 1px solid #000; border-bottom: none; text-transform: uppercase; margin-top: 4px; }
.sec-table { border: 1px solid #000; margin-bottom: 8px; width: 100%; border-collapse: collapse; }
.sec-table td { border: 1px solid #000; padding: 6px 10px; width: 50%; }
.instructions { border: 1px solid #000; padding: 10px 10px 10px 30px; margin-bottom: 15px; font-size: 11px; line-height: 1.6; }
.instructions li { margin-bottom: 4px; }
.signature { margin-top: 40px; display: flex; justify-content: space-between; padding: 0 10px; margin-bottom: 10px; }
.sig-line { border-top: 1px solid #000; width: 180px; text-align: center; font-size: 11px; padding-top: 5px; font-weight: bold; text-transform: uppercase; }
@media print { 
  body { padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
  .card { border: 1px solid #000; } 
  .title, .sec-title { background: #e5e5e5 !important; }
}
</style></head><body>
<div class="card">
  <div class="hdr">
    <h1>NIICT Computer Institute of IT Management</h1>
    <p>AN ISO 9001:2015 CERTIFIED ORGANIZATION</p>
  </div>
  <div class="title">Candidate Admit Card &amp; Application Form</div>
  <div class="body">
    <div style="display: flex; gap: 10px; margin-bottom: 8px;">
      <div style="flex: 1;">
        <div class="row-table">
          <div class="col"><div class="col-label">Registration / Roll No.</div><div class="col-value">${admitCardData.rollNumber}</div></div>
          <div class="col"><div class="col-label">Exam Date &amp; Time</div><div class="col-value">18 Oct 2026, 10:00 AM</div></div>
        </div>
        <div class="row-table">
          <div class="col"><div class="col-label">Candidate Name</div><div class="col-value">${admitCardData.name}</div></div>
        </div>
        <div class="row-table">
          <div class="col"><div class="col-label">Father's Name</div><div class="col-value">${admitCardData.fatherName}</div></div>
          <div class="col"><div class="col-label">Mother's Name</div><div class="col-value">${admitCardData.motherName}</div></div>
        </div>
        <div class="row-table">
          <div class="col"><div class="col-label">Date of Birth</div><div class="col-value">${new Date(admitCardData.dateOfBirth).toLocaleDateString('en-GB')}</div></div>
          <div class="col"><div class="col-label">Class Passed</div><div class="col-value">${admitCardData.classPassed || admitCardData.class || 'N/A'}</div></div>
        </div>
      </div>
      <div class="photo-box">
        ${admitCardData.image ? `<img src="${admitCardData.image}" alt="Photo"/>` : 'AFFIX PHOTO'}
      </div>
    </div>
    
    <div class="row-table">
      <div class="col"><div class="col-label">School / College Name</div><div class="col-value">${admitCardData.school}</div></div>
    </div>
    
    <div class="row-table">
      <div class="col"><div class="col-label">Exam Center</div><div class="col-value">S.K. Modern Inter College, Semari, Jaunpur</div></div>
    </div>

    <div class="sec-title">Fee &amp; Payment Details</div>
    <table class="sec-table">
      <tr>
        <td><div class="col-label">Amount Paid</div><div class="col-value">Rs. ${admitCardData.paymentAmount || 150}</div></td>
        <td><div class="col-label">Payment Date</div><div class="col-value">${paidDate}</div></td>
      </tr>
      <tr>
        <td><div class="col-label">Transaction ID</div><div class="col-value">${admitCardData.paymentTransactionId || 'N/A'}</div></td>
        <td><div class="col-label">Payment Status</div><div class="col-value">SUCCESS</div></td>
      </tr>
    </table>

    <div class="sec-title">Instructions to Candidates</div>
    <ol class="instructions">
      <li><strong>Reporting Time: 08:00 AM.</strong> Reporting half hour before scheduled time is mandatory.</li>
      <li>Entry is allowed 15 mins before the exam starts. No entry will be permitted 30 mins after commencement.</li>
      <li>Original photo ID (Aadhaar Card / Voter ID) is mandatory along with this printed Admit Card.</li>
      <li>Mobile phones, calculators, smart watches, and other electronic devices are strictly prohibited inside the exam hall.</li>
      <li>Any malpractice or violation of rules will result in immediate cancellation of the candidature.</li>
      <li><strong>Result Date:</strong> 25 October 2026. Results will be announced on <strong>NIICT Computer Classes</strong> YouTube Channel.</li>
    </ol>

    <div class="signature">
      <div class="sig-line">Candidate Signature</div>
      <div class="sig-line">Invigilator Signature</div>
      <div class="sig-line">Authorized Signatory</div>
    </div>
  </div>
</div>
</body></html>`);
    w.document.close();
    w.onload = () => setTimeout(() => { try { w.focus(); } catch (_) { } w.print(); }, 200);
  };

  /* ─────────────────────────────────────────────────────── */

  if (step === 3 && admitCardData) return <ThankYouScreen admitCardData={admitCardData} onDownload={printAdmitCard} />;

  if (step === 2) return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.canvas }}>
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress size={56} sx={{ color: C.accent, mb: 3 }} />
        <Typography variant="h6" color={C.ink} fontWeight={700}>Verifying your payment…</Typography>
        <Typography variant="body2" color={C.inkSoft} sx={{ mt: 1 }}>Please wait, do not close this page.</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', pt: { xs: 10, md: 14 }, pb: 12, background: `linear-gradient(180deg, ${C.canvas} 0%, #FFFFFF 40%)`, position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: '-15%', left: '-10%', width: '55vw', height: '55vw', background: `radial-gradient(circle, ${C.accentSoft} 0%, rgba(0,0,0,0) 70%)`, filter: 'blur(60px)', zIndex: 0, borderRadius: '50%' }} />
      <Box sx={{ position: 'absolute', bottom: '-15%', right: '-10%', width: '45vw', height: '45vw', background: `radial-gradient(circle, ${C.goldSoft} 0%, rgba(0,0,0,0) 70%)`, filter: 'blur(60px)', zIndex: 0, borderRadius: '50%' }} />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, type: 'spring', bounce: 0.3 }}>
          <Paper elevation={0} sx={{ p: { xs: 4, md: 7 }, borderRadius: '32px', background: C.paper, border: `1px solid ${C.border}`, boxShadow: '0 30px 70px -25px rgba(30,27,58,0.18)' }}>

            <Box textAlign="center" mb={2}>
              <motion.div whileHover={{ scale: 1.05, rotate: 3 }} whileTap={{ scale: 0.95 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 88, height: 88, borderRadius: '24px', background: `linear-gradient(135deg, ${C.gold} 0%, #A67C1F 100%)`, boxShadow: `0 18px 35px -10px rgba(200,155,60,0.5)`, mb: 3 }}>
                  <FaTrophy size={42} color="#fff" />
                </Box>
              </motion.div>
              <Typography variant="h2" fontWeight={900} sx={{ color: C.ink, letterSpacing: '-1.5px', fontSize: { xs: '2.2rem', md: '3.4rem' }, mb: 1.5 }}>
                GK &amp; Computer <br />Competition
              </Typography>
              <Typography variant="h6" color={C.inkSoft} fontWeight={400} sx={{ maxWidth: '600px', mx: 'auto', mb: 4, lineHeight: 1.7 }}>
                State-level competition — test your knowledge and win prizes &amp; scholarships!
              </Typography>
            </Box>

            <StepBar current={step} />

            {/* Exam Info */}
            <Box sx={{ background: C.canvas, p: { xs: 3, md: 4 }, borderRadius: '24px', border: `1px solid ${C.border}`, textAlign: 'left', position: 'relative', overflow: 'hidden', mb: 4 }}>
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '5px', height: '100%', background: `linear-gradient(to bottom, ${C.accent}, ${C.gold})` }} />
              <Typography variant="h6" fontWeight={800} color={C.ink} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <FaCalendarAlt color={C.accent} size={20} /> Exam Details
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '16px', background: C.accentSoft, color: C.accent }}><FaClock size={22} /></Box>
                    <Box>
                      <Typography variant="body2" color={C.inkSoft} fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '1.2px', fontSize: '0.7rem' }}>Form Filling Dates</Typography>
                      <Typography variant="body1" color={C.ink} fontWeight={700} sx={{ mt: 0.5 }}>05 Sep – 10 Oct 2026</Typography>
                      <Typography variant="body2" color={C.inkSoft}>Last Date: 10 Oct 2026</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '16px', background: C.accentSoft, color: C.accent }}><FaClock size={22} /></Box>
                    <Box>
                      <Typography variant="body2" color={C.inkSoft} fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '1.2px', fontSize: '0.7rem' }}>Exam Date &amp; Time</Typography>
                      <Typography variant="body1" color={C.ink} fontWeight={700} sx={{ mt: 0.5 }}>18 Oct 2026, 10:00 AM</Typography>
                      <Typography variant="body2" color={C.inkSoft}>Reporting: 8:00 AM</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '16px', background: C.goldSoft, color: C.gold }}><FaMapMarkerAlt size={22} /></Box>
                    <Box>
                      <Typography variant="body2" color={C.inkSoft} fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '1.2px', fontSize: '0.7rem' }}>Exam Center</Typography>
                      <Typography variant="body1" color={C.ink} fontWeight={700} sx={{ mt: 0.5 }}>S.K. Modern Inter College</Typography>
                      <Typography variant="body2" color={C.inkSoft}>Semari, Jaunpur</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                    <Box sx={{ p: 2, borderRadius: '16px', background: C.goldSoft, color: C.gold }}><FaTrophy size={22} /></Box>
                    <Box>
                      <Typography variant="body2" color={C.inkSoft} fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '1.2px', fontSize: '0.7rem' }}>Result Date</Typography>
                      <Typography variant="body1" color={C.ink} fontWeight={700} sx={{ mt: 0.5 }}>25 Oct 2026</Typography>
                      <Typography variant="body2" color={C.inkSoft}>NIICT YouTube Channel</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* Fee badge */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, p: 2.5, background: `linear-gradient(135deg, ${C.accentSoft}, ${C.goldSoft})`, borderRadius: '18px', border: `1px solid ${C.accentMid}` }}>
              <FaCreditCard size={24} color={C.accent} />
              <Box>
                <Typography variant="body2" color={C.inkSoft} fontWeight={600}>Registration Fee</Typography>
                <Typography variant="h5" fontWeight={900} color={C.accent}>Rs. 150 <Typography component="span" variant="body2" color={C.inkSoft} fontWeight={400}>· Secured by Cashfree</Typography></Typography>
              </Box>
              <FaShieldAlt size={20} color={C.success} style={{ marginLeft: 'auto' }} />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '14px' }}>{error}</Alert>}

            <form onSubmit={handleOpenPreview}>
              <Typography variant="h5" fontWeight={800} color={C.ink} gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 8, height: 26, background: C.accent, borderRadius: 4 }} />
                Applicant Details
              </Typography>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}><TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={setField('name')} required sx={fieldSx} /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}><TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={setField('phone')} required sx={fieldSx} /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}><TextField fullWidth label="Father's Name" name="fatherName" value={formData.fatherName} onChange={setField('fatherName')} required sx={fieldSx} /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}><TextField fullWidth label="Mother's Name" name="motherName" value={formData.motherName} onChange={setField('motherName')} required sx={fieldSx} /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <TextField fullWidth label="Aadhaar Number" name="aadhaar" value={formData.aadhaar}
                    onChange={e => setFormData(p => ({ ...p, aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) }))}
                    inputProps={{ inputMode: 'numeric', maxLength: 12 }} helperText="12-digit Aadhaar (optional)" sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}><TextField fullWidth label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={setField('dateOfBirth')} required InputLabelProps={{ shrink: true }} sx={fieldSx} /></Grid>
                
                <Grid size={{ xs: 12, sm: 12, md: 12 }}><TextField fullWidth label="School / College Name" name="school" value={formData.school} onChange={setField('school')} required sx={fieldSx} /></Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 6 }}><TextField fullWidth label="Parent/Guardian Phone" value={formData.parentPhone} onChange={setField('parentPhone')} helperText="Optional" sx={fieldSx} /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <FormControl fullWidth required sx={{ ...fieldSx, minWidth: '100%' }}>
                    <InputLabel id="class-label">Class Passed</InputLabel>
                    <Select fullWidth labelId="class-label" label="Class Passed" value={formData.classPassed} onChange={setField('classPassed')} sx={{ width: '100%', flex: 1 }}>
                      {['8th', '9th', '10th', '11th', '12th', 'Diploma', 'Undergraduate', 'Graduation'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 12, md: 12 }}><TextField fullWidth label="Complete Address" multiline rows={3} value={formData.address} onChange={setField('address')} required sx={fieldSx} /></Grid>

                {/* Photo */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ p: 5, border: `2px dashed ${C.border}`, borderRadius: '24px', background: C.canvas, textAlign: 'center', transition: 'all 0.3s', '&:hover': { borderColor: C.accent, background: C.accentSoft } }}>
                    <Typography variant="subtitle1" fontWeight={700} color={C.ink} gutterBottom>Student Photo (Optional)</Typography>
                    <Typography variant="body2" color={C.inkSoft} mb={3}>Passport-size, max 5MB</Typography>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="photo-upload" />
                    <label htmlFor="photo-upload">
                      <Button variant="outlined" component="span" disabled={uploadingImage}
                        sx={{ borderRadius: '14px', px: 5, py: 1.5, borderWidth: '1.5px', borderColor: C.accent, color: C.accent, fontWeight: 700, textTransform: 'none', '&:hover': { borderWidth: '1.5px', background: C.accentSoft } }}>
                        {uploadingImage ? 'Uploading…' : 'Choose Photo'}
                      </Button>
                    </label>
                    {imagePreview && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Box sx={{ mt: 3 }}>
                          <img src={imagePreview} alt="Preview" style={{ width: '110px', height: '140px', objectFit: 'cover', borderRadius: '14px', border: `4px solid ${C.paper}`, boxShadow: '0 10px 20px -5px rgba(30,27,58,0.2)' }} />
                        </Box>
                      </motion.div>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Box textAlign="center" mt={5}>
                <Button type="submit" variant="contained" size="large" disabled={loading} startIcon={<FaEye />}
                  sx={{ borderRadius: '50px', py: 2, px: 6, fontSize: '1.15rem', fontWeight: 800, textTransform: 'none', color: '#fff', background: `linear-gradient(90deg, ${C.accent}, #7C5CFC)`, boxShadow: `0 15px 35px -10px rgba(91,61,245,0.55)`, '&:hover': { boxShadow: `0 20px 45px -10px rgba(91,61,245,0.7)`, transform: 'translateY(-2px)' } }}>
                  Preview &amp; Pay Rs.150
                </Button>
                <Typography variant="caption" display="block" color={C.inkSoft} sx={{ mt: 2 }}>
                  Secured by Cashfree Payments · Your data is safe
                </Typography>
              </Box>
            </form>
          </Paper>
        </motion.div>
      </Container>

      <PreviewModal open={previewOpen} formData={formData} imagePreview={imagePreview} onConfirm={handleConfirmAndPay} onEdit={() => setPreviewOpen(false)} loading={loading} />
    </Box>
  );
};

export default CompetitionForm;
