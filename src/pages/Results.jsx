import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Medal, Award, Search, Printer, Share2, 
  CheckCircle2, AlertCircle, Phone, User, Calendar, 
  Sparkles, School, Hash, ArrowRight, ShieldCheck, 
  Star, RefreshCw, FileText, Check, Download, 
  ChevronRight, BookmarkCheck, HeartHandshake, HelpCircle,
  Building2, GraduationCap, CheckCircle
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import niictLogo from '../assets/logo.jpg';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');

const Results = () => {
  const location = useLocation();
  const scorecardRef = useRef(null);

  const [searchMethod, setSearchMethod] = useState('roll'); // 'roll' | 'mobile' | 'aadhaar'
  const [rollDigits, setRollDigits] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [top3Students, setTop3Students] = useState([]);
  const [top20Students, setTop20Students] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-search if ?roll= is present in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlRoll = params.get('roll');
    if (urlRoll) {
      const cleanDigits = urlRoll.trim().toUpperCase().replace(/^NIICT/i, '');
      setRollDigits(cleanDigits);
      executeSearch(`NIICT${cleanDigits}`);
    }
    fetchLeaderboard();
  }, [location.search]);

  const fetchLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const [res3, res20] = await Promise.all([
        fetch(`${API_BASE_URL}/api/results/top3`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/results/top20`).then(r => r.json()).catch(() => null)
      ]);

      let top20List = [];
      if (res20 && res20.success && Array.isArray(res20.data) && res20.data.length > 0) {
        top20List = res20.data;
      } else {
        const res10 = await fetch(`${API_BASE_URL}/api/results/top10`).then(r => r.json()).catch(() => null);
        if (res10 && res10.success && Array.isArray(res10.data)) {
          top20List = res10.data;
        }
      }

      // Filter to ensure only positive valid ranks (1 to 20) are included and sorted
      const validRankers = top20List
        .filter(s => s && typeof s.rank === 'number' && s.rank >= 1 && s.rank <= 20)
        .sort((a, b) => a.rank - b.rank);

      setTop20Students(validRankers);

      // Top 3 for the podium - strictly ranks 1, 2, 3
      let top3List = [];
      if (res3 && res3.success && Array.isArray(res3.data) && res3.data.length > 0 && res3.data[0].rank === 1) {
        top3List = res3.data.filter(s => s && typeof s.rank === 'number' && s.rank >= 1 && s.rank <= 3);
      }
      if (top3List.length === 0 && validRankers.length >= 3) {
        top3List = validRankers.slice(0, 3);
      }
      setTop3Students(top3List);

    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const executeSearch = async (query) => {
    if (!query) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/results/search/${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok && data.success && data.data) {
        setResult(data.data);
        setTimeout(() => {
          scorecardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } else {
        setError(data.message || 'No result found matching your entered details. Please verify and try again.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Unable to fetch result. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');

    let query = '';
    if (searchMethod === 'roll') {
      const cleanDigits = rollDigits.trim().toUpperCase().replace(/^NIICT/i, '');
      if (!cleanDigits) {
        setError('Please enter your 4-digit roll number (e.g. 1655)');
        return;
      }
      query = `NIICT${cleanDigits}`;
    } else if (searchMethod === 'mobile') {
      const cleanPhone = mobileNumber.trim().replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setError('Please enter a valid 10-digit registered mobile number');
        return;
      }
      query = cleanPhone.slice(-10);
    } else if (searchMethod === 'aadhaar') {
      const cleanAadhaar = aadhaarNumber.trim().replace(/\D/g, '');
      if (cleanAadhaar.length !== 12) {
        setError('Please enter a valid 12-digit Aadhaar number');
        return;
      }
      query = cleanAadhaar;
    }

    executeSearch(query);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard && result) {
      const url = `${window.location.origin}/results?roll=${encodeURIComponent(result.rollNumber)}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getRankBadgeInfo = (rank) => {
    if (rank === 1) {
      return {
        title: 'State Topper (Rank #1)',
        subtitle: 'Gold Medalist & State Champion',
        badgeBg: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950',
        cardBg: 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/70 border-amber-300 text-amber-950 shadow-amber-500/10',
        icon: <Trophy className="w-8 h-8 text-amber-600 fill-amber-400" />
      };
    }
    if (rank === 2) {
      return {
        title: 'Second Ranker (Rank #2)',
        subtitle: 'Silver Medalist',
        badgeBg: 'bg-gradient-to-r from-slate-300 via-slate-200 to-slate-400 text-slate-900',
        cardBg: 'bg-gradient-to-br from-slate-50 via-white to-slate-100 border-slate-300 text-slate-900',
        icon: <Medal className="w-8 h-8 text-slate-600 fill-slate-300" />
      };
    }
    if (rank === 3) {
      return {
        title: 'Third Ranker (Rank #3)',
        subtitle: 'Bronze Medalist',
        badgeBg: 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-white',
        cardBg: 'bg-gradient-to-br from-amber-50/60 via-white to-orange-50/50 border-amber-300 text-amber-950',
        icon: <Award className="w-8 h-8 text-amber-700 fill-amber-500" />
      };
    }
    if (rank && rank <= 20) {
      return {
        title: `State Merit Rank #${rank}`,
        subtitle: 'Top 20 State Merit List Holder',
        badgeBg: 'bg-gradient-to-r from-[#245894] to-[#1e40af] text-white',
        cardBg: 'bg-gradient-to-br from-blue-50/50 via-white to-slate-50 border-blue-200 text-slate-900',
        icon: <Award className="w-8 h-8 text-[#245894]" />
      };
    }
    return {
      title: 'Qualified Candidate',
      subtitle: 'State Level Talent Search Participant',
      badgeBg: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white',
      cardBg: 'bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 border-emerald-200 text-slate-900',
      icon: <CheckCircle className="w-8 h-8 text-emerald-600" />
    };
  };

  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#fafafc] text-slate-800 selection:bg-amber-400 selection:text-slate-950 pb-24 relative overflow-hidden">
      
      {/* ── Background Micro Grid Pattern (Awwwards Style) ── */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      {/* ── Ambient Soft Glow Orbs ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-blue-100/50 via-amber-100/30 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-80 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[800px] left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Print Specific Styles ── */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          nav, footer, .no-print, .app > div:not(.print-container) {
            display: none !important;
          }
          .print-area {
            display: block !important;
            box-shadow: none !important;
            border: 2px solid #000 !important;
            padding: 24px !important;
            width: 100% !important;
            margin: 0 auto !important;
            background: white !important;
            color: #000 !important;
          }
          .print-area * {
            color: #000 !important;
            text-shadow: none !important;
          }
        }
      `}</style>

      {/* ── Hero Header ── */}
      <section className="relative z-10 pt-14 pb-14 border-b border-slate-200/70 no-print">
        <div className="max-w-5xl mx-auto px-4 text-center">
          
          {/* Top Pill */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-white border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] text-slate-800 text-xs sm:text-sm font-bold tracking-wide"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-slate-900 font-extrabold">Official Result Portal</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-[#245894] font-black uppercase text-[11px] tracking-wider">Session 2026-2027</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]"
          >
            Check Competition Results
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3.5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium"
          >
            State Level General Knowledge &amp; Computer Literacy Talent Search Exam 2026-2027.
          </motion.p>

          {/* Quick Info */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Exam Date: <strong className="text-slate-900 font-bold">18 Oct 2026</strong></span>
          </motion.div>
        </div>
      </section>

      {/* ── Search Container (Awwwards Style Floating Elevated Card) ── */}
      <section className="max-w-3xl mx-auto px-4 -mt-6 relative z-20 no-print">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border-2 border-slate-200/90 rounded-[2rem] p-6 sm:p-9 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.08)]"
        >
          {/* Search Method Segmented Tabs */}
          <div className="flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 mb-7 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => { setSearchMethod('roll'); setError(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                searchMethod === 'roll'
                  ? 'bg-white text-[#245894] shadow-sm font-black border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Hash className="w-4 h-4 text-[#245894]" />
              <span>Roll Number</span>
            </button>
            <button
              type="button"
              onClick={() => { setSearchMethod('mobile'); setError(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                searchMethod === 'mobile'
                  ? 'bg-white text-[#245894] shadow-sm font-black border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Mobile</span>
            </button>
            <button
              type="button"
              onClick={() => { setSearchMethod('aadhaar'); setError(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                searchMethod === 'aadhaar'
                  ? 'bg-white text-[#245894] shadow-sm font-black border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-amber-600" />
              <span>Aadhaar</span>
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-4 max-w-lg mx-auto">
            {searchMethod === 'roll' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Enter Roll Number <span className="text-[#245894] normal-case font-semibold">(Prefix NIICT is default)</span>
                </label>
                <div className="flex rounded-2xl overflow-hidden border-2 border-slate-300 bg-white shadow-sm focus-within:border-[#245894] focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                  <span className="px-5 py-3.5 bg-blue-50 text-[#245894] font-black text-base tracking-widest border-r border-slate-200 flex items-center select-none">
                    NIICT
                  </span>
                  <input
                    type="text"
                    value={rollDigits}
                    onChange={(e) => setRollDigits(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 1655"
                    className="flex-1 bg-transparent px-4 py-3.5 text-slate-900 placeholder-slate-400 text-base font-bold outline-none tracking-wider"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  💡 Just enter the 4 digits printed on your Admit Card (e.g. <strong className="text-[#245894]">1655</strong> for roll <strong className="text-slate-800">NIICT1655</strong>).
                </p>
              </div>
            )}

            {searchMethod === 'mobile' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  10-Digit Registered Mobile Number
                </label>
                <div className="flex rounded-2xl overflow-hidden border-2 border-slate-300 bg-white shadow-sm focus-within:border-[#245894] focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                  <span className="px-4 py-3.5 bg-slate-100 text-slate-600 font-bold text-sm tracking-wider border-r border-slate-200 flex items-center select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter registered mobile number"
                    className="flex-1 bg-transparent px-4 py-3.5 text-slate-900 placeholder-slate-400 text-base font-semibold outline-none tracking-wider"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {searchMethod === 'aadhaar' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  12-Digit Aadhaar Card Number
                </label>
                <div className="flex rounded-2xl overflow-hidden border-2 border-slate-300 bg-white shadow-sm focus-within:border-[#245894] focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    maxLength={12}
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 12-digit Aadhaar number"
                    className="flex-1 bg-transparent px-4 py-3.5 text-slate-900 placeholder-slate-400 text-base font-semibold outline-none tracking-wider text-center"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -4 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs sm:text-sm text-rose-800 flex items-start gap-2.5 font-medium"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-[#245894] via-[#1d4ed8] to-[#245894] hover:from-[#1e40af] hover:to-[#1e3a8a] text-white font-black rounded-2xl text-base transition-all duration-200 shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 tracking-wide cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching Official Records...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search Result &amp; View Scorecard</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </section>

      {/* ── THE OFFICIAL SCORECARD (AWWWARDS-LEVEL LIGHT THEME MASTERPIECE) ── */}
      <AnimatePresence>
        {result && (
          <section ref={scorecardRef} className="max-w-4xl mx-auto px-4 mt-14">
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="print-area relative bg-white rounded-[2.5rem] p-7 sm:p-11 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.12)] border-2 border-amber-300 ring-8 ring-amber-100/60 overflow-hidden"
            >
              {/* Subtle Watermark Crest */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
                <img src={niictLogo} alt="NIICT Watermark" className="w-[500px] h-[500px] object-contain" />
              </div>

              {/* Top Luxury Ribbon Border */}
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#245894] via-amber-400 to-[#d13030]" />

              {/* Scorecard Official Header */}
              <div className="border-b-2 border-slate-200 pb-7 mb-7">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <img 
                      src={niictLogo} 
                      alt="NIICT Logo" 
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-300 shadow-sm"
                    />
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-widest text-[#245894] block">
                        Government Registered &bull; An ISO 9001:2015 Certified Institution
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                        NIHANSHI INSTITUTE OF INFORMATION &amp; COMPUTER TECHNOLOGY
                      </h2>
                      <p className="text-xs text-slate-600 font-semibold mt-1">
                        Janghai - Jaunpur Road, Uttar Pradesh &bull; Official Helpline: +91 8182838680
                      </p>
                    </div>
                  </div>

                  {/* QR Code with Live Verification Seal */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="p-1.5 bg-white border border-slate-300 rounded-xl shadow-sm">
                      <QRCodeSVG 
                        value={`${window.location.origin}/results?roll=${result.rollNumber}`}
                        size={72}
                        level="M"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold mt-1">Scan to Verify</span>
                  </div>
                </div>

                {/* Scorecard Title Banner */}
                <div className="mt-6 py-2.5 px-4 bg-gradient-to-r from-[#245894] via-[#1d4ed8] to-[#245894] text-white rounded-xl text-center shadow-md">
                  <h3 className="text-xs sm:text-sm font-black tracking-wider uppercase">
                    OFFICIAL STATEMENT OF MARKS &bull; STATE LEVEL TALENT SEARCH EXAM 2026-2027
                  </h3>
                </div>
              </div>

              {/* Achievement Rank Banner */}
              <div className="mb-8">
                <div className={`p-5 sm:p-6 rounded-3xl border ${getRankBadgeInfo(result.rank).cardBg} flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm`}>
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-200">
                      {getRankBadgeInfo(result.rank).icon}
                    </div>
                    <div>
                      <span className="text-xs uppercase font-black tracking-widest text-slate-500 block">
                        Official Standing
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {getRankBadgeInfo(result.rank).title}
                      </h4>
                      <p className="text-xs font-bold text-slate-600">{getRankBadgeInfo(result.rank).subtitle}</p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right bg-white px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm flex-shrink-0">
                    <span className="text-[11px] uppercase font-black tracking-wider text-slate-500 block">
                      Total Score Obtained
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-emerald-700 font-mono">
                      {result.marks} <span className="text-sm font-bold text-slate-400">/ 100</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Candidate Particulars (With Monogram Avatar) */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-6 sm:p-7 mb-8">
                <div className="flex items-center gap-4 pb-4 mb-4 border-b border-slate-200">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#245894] to-[#1d4ed8] text-white font-black text-xl flex items-center justify-center shadow-md flex-shrink-0">
                    {getInitials(result.name)}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase">
                      {result.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold">
                      Father's Name: <strong className="text-slate-900 uppercase">{result.fatherName}</strong>
                      {result.motherName ? ` &bull; Mother: ${result.motherName}` : ''}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 font-semibold block text-[11px]">Official Roll Number</span>
                    <span className="font-black text-[#245894] font-mono text-base tracking-wider">{result.rollNumber}</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 font-semibold block text-[11px]">Candidate Contact</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 text-sm mt-0.5 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{result.phone ? `XXXXXX${String(result.phone).slice(-4)}` : 'Verified & Protected'}</span>
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 font-semibold block text-[11px]">Aadhaar Identification</span>
                    <span className="font-bold text-slate-800 font-mono text-sm mt-0.5 block">
                      {result.aadhaar ? `XXXX-XXXX-${result.aadhaar.slice(-4)}` : 'Verified via Registration'}
                    </span>
                  </div>

                  {result.school && (
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs sm:col-span-2">
                      <span className="text-slate-500 font-semibold block text-[11px]">Institution / School</span>
                      <span className="font-bold text-slate-900 text-sm mt-0.5 block">{result.school}</span>
                    </div>
                  )}

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 font-semibold block text-[11px]">Exam Date &bull; Session</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      18 October 2026 &bull; {result.session || '2026-2027'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Marks & Performance Table */}
              <div className="border border-slate-300 rounded-2xl overflow-hidden mb-8 shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#245894] text-white font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Subject / Module</th>
                      <th className="py-3.5 px-4 text-center">Max Marks</th>
                      <th className="py-3.5 px-4 text-center">Marks Obtained</th>
                      <th className="py-3.5 px-4 text-center">Percentage</th>
                      <th className="py-3.5 px-4 text-center">Grade</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-semibold text-slate-800 bg-white">
                    <tr className="hover:bg-slate-50/80">
                      <td className="py-4 px-4 font-bold text-slate-900">
                        General Knowledge &amp; Computer Literacy (State Exam)
                      </td>
                      <td className="py-4 px-4 text-center font-mono">100</td>
                      <td className="py-4 px-4 text-center font-black text-base text-slate-950 font-mono">
                        {result.marks}
                      </td>
                      <td className="py-4 px-4 text-center font-mono font-bold">
                        {result.percentage !== undefined ? `${result.percentage}%` : `${Math.round(result.marks)}%`}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-900 font-black text-xs border border-amber-300">
                          {result.grade || 'A+'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-md font-black text-xs ${
                          result.status === 'Passed' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : result.status === 'Absent'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {result.status || 'Passed'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold text-slate-900">
                    <tr>
                      <td className="py-3.5 px-4 font-black">FINAL CONSOLIDATED SCORE</td>
                      <td className="py-3.5 px-4 text-center font-mono">100</td>
                      <td className="py-3.5 px-4 text-center font-black text-lg text-emerald-700 font-mono">
                        {result.marks}
                      </td>
                      <td colSpan={3} className="py-3.5 px-4 text-center text-xs">
                        {result.rank && result.rank <= 20 ? (
                          <>Merit Standing: <strong>Rank #{result.rank}</strong> (Top 20 State Merit)</>
                        ) : (
                          <>Status: <strong className="text-emerald-700 font-black">Qualified Candidate</strong> &bull; Talent Search Session 2026-2027</>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Official Seal & Signature Footer */}
              <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-full text-emerald-800 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Digitally Verified &bull; Official Board</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Generated: {new Date().toLocaleDateString('en-GB')}</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center text-[10px] font-black text-amber-800 uppercase text-center leading-tight bg-amber-50/50">
                    NIICT<br/>OFFICIAL<br/>SEAL
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="h-10 flex items-end justify-center sm:justify-end">
                    <span className="font-serif italic font-bold text-slate-700 border-b-2 border-slate-800 px-4">
                      Examinations Controller
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-600 font-bold block mt-1">
                    NIICT Institute Examination Cell
                  </span>
                </div>
              </div>

              {/* Action Toolbar (Hidden during print) */}
              <div className="mt-9 pt-6 border-t border-slate-200 flex flex-wrap gap-3 items-center justify-between no-print">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrint}
                    className="py-3.5 px-6 bg-gradient-to-r from-[#245894] to-[#1e40af] hover:from-[#1d4370] hover:to-[#1e3a8a] text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Scorecard</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm flex items-center gap-2 transition-all cursor-pointer border border-slate-300"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Share Scorecard'}</span>
                  </button>
                </div>

                <button
                  onClick={() => { setResult(null); setRollDigits(''); setMobileNumber(''); setAadhaarNumber(''); }}
                  className="py-3 px-4 text-slate-600 hover:text-slate-950 font-semibold text-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Check Another Candidate</span>
                </button>
              </div>
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      {/* ── Top 3 State Rankers Podium Gallery (Name, Rank, Number/Marks ONLY - NO scorecard links) ── */}
      <section className="max-w-6xl mx-auto px-4 mt-24 no-print">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-widest mb-3">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>State Level Merit List &bull; Session 2026-2027</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Competition Top Rankers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto font-medium">
            Congratulations to the top performers of NIICT State Level Talent Search Competition.
          </p>
        </div>

        {/* Podium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {top3Students.map((student, idx) => {
            const isRank1 = student.rank === 1;
            const isRank2 = student.rank === 2;
            const isRank3 = student.rank === 3;

            return (
              <motion.div
                key={student.rollNumber || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className={`relative rounded-3xl p-6 sm:p-8 overflow-hidden border-2 transition-all duration-300 ${
                  isRank1
                    ? 'bg-gradient-to-b from-amber-50 via-white to-yellow-50/60 border-amber-400 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.25)] md:-translate-y-4'
                    : isRank2
                    ? 'bg-gradient-to-b from-slate-50 via-white to-slate-100/60 border-slate-300 shadow-lg'
                    : 'bg-gradient-to-b from-amber-50/40 via-white to-orange-50/40 border-amber-300 shadow-lg'
                }`}
              >
                {/* Header Rank Pill */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    isRank1 
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm' 
                      : isRank2
                      ? 'bg-slate-300 text-slate-950 font-black shadow-sm'
                      : 'bg-amber-600 text-white font-black shadow-sm'
                  }`}>
                    {isRank1 && <Trophy className="w-3.5 h-3.5 text-slate-950" />}
                    {isRank2 && <Medal className="w-3.5 h-3.5 text-slate-950" />}
                    {isRank3 && <Award className="w-3.5 h-3.5 text-white" />}
                    <span>Rank #{student.rank}</span>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-500">
                    {student.rollNumber}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-1">
                  {student.name}
                </h3>
                <p className="text-xs text-slate-600 font-semibold mb-6">
                  S/D of {student.fatherName}
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Marks Obtained</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
                      {student.marks} <span className="text-xs text-slate-400 font-bold">/ 100</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Grade</span>
                    <span className="text-xl font-black text-amber-600">
                      {student.grade || 'A+'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Top 20 Merit Leaderboard Table ── */}
      {top20Students.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-20 no-print">
          <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-6 sm:p-9 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-7">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  <span>State Merit List Top 20 Performers (2026-2027)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluated based on official answer sheets with negative marking.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#245894] text-xs font-bold">
                <span>Top 20 State Rankers</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-5">Rank</th>
                    <th className="py-4 px-5">Student Name</th>
                    <th className="py-4 px-5">Father's Name</th>
                    <th className="py-4 px-5 font-mono">Roll Number</th>
                    <th className="py-4 px-5 text-center font-mono">Marks</th>
                    <th className="py-4 px-5 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800 bg-white">
                  {top20Students.map((s, i) => (
                    <tr key={s.rollNumber || i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-5 font-black">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black ${
                          s.rank === 1 
                            ? 'bg-amber-400 text-slate-950 shadow-sm' 
                            : s.rank === 2 
                            ? 'bg-slate-300 text-slate-950 shadow-sm' 
                            : s.rank === 3 
                            ? 'bg-amber-600 text-white shadow-sm' 
                            : s.rank <= 10
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          #{s.rank}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-bold text-slate-900 text-sm sm:text-base">{s.name}</td>
                      <td className="py-4 px-5 text-slate-600">{s.fatherName}</td>
                      <td className="py-4 px-5 font-mono font-bold text-[#245894]">{s.rollNumber}</td>
                      <td className="py-4 px-5 text-center font-black text-emerald-700 font-mono text-base">{s.marks}</td>
                      <td className="py-4 px-5 text-center font-black text-amber-600">{s.grade || 'A+'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── Help & Guidelines Section ── */}
      <section className="max-w-4xl mx-auto px-4 mt-20 no-print text-center">
        <div className="p-7 bg-white border border-slate-200 rounded-3xl text-slate-600 text-xs sm:text-sm space-y-2 shadow-sm">
          <p className="font-bold text-slate-900 text-sm sm:text-base">
            Need assistance regarding your score or examination certificate?
          </p>
          <p>
            Contact NIICT Institute Examination Office at <a href="tel:+918182838680" className="text-[#245894] font-bold hover:underline">+91 8182838680</a> or email <a href="mailto:niict01@gmail.com" className="text-[#245894] font-bold hover:underline">niict01@gmail.com</a>.
          </p>
          <p className="text-[11px] text-slate-400 pt-2 font-medium">
            NIICT Computer Institute &bull; All India Talent Search Examination Cell &bull; Session 2026-2027
          </p>
        </div>
      </section>

    </div>
  );
};

export default Results;
