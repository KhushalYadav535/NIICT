import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, Search, Printer, FileText, CheckCircle, Calendar, 
  Clock, MapPin, Sparkles, ChevronRight, Download, User, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { openAdmitCardPrintWindow, openApplicationFormPrintWindow } from '../utils/admitCardGenerator';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');

const AdmitCardPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchMethod, setSearchMethod] = useState('roll'); // 'roll' | 'mobile' | 'aadhaar'
  const [rollNumber, setRollNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('hasSeenAdmitCardPopup');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenAdmitCardPopup', 'true');
  };

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setCandidate(null);
    setLoading(true);

    try {
      let url = '';
      if (searchMethod === 'roll') {
        if (!rollNumber.trim()) {
          setError('Please enter your Roll Number (e.g. SKMIC-001 or NIICT1234)');
          setLoading(false);
          return;
        }
        url = `${API_BASE_URL}/api/competition-applications/roll/${encodeURIComponent(rollNumber.trim())}`;
      } else if (searchMethod === 'mobile') {
        if (!/^\d{10,11}$/.test(mobile.trim())) {
          setError('Please enter a valid 10-digit mobile number');
          setLoading(false);
          return;
        }
        if (!dob) {
          setError('Please select Candidate Date of Birth');
          setLoading(false);
          return;
        }
        url = `${API_BASE_URL}/api/competition-applications/mobile/${encodeURIComponent(mobile.trim())}?dob=${encodeURIComponent(dob)}`;
      } else if (searchMethod === 'aadhaar') {
        if (!/^\d{12}$/.test(aadhaar.trim())) {
          setError('Please enter a valid 12-digit Aadhaar number');
          setLoading(false);
          return;
        }
        url = `${API_BASE_URL}/api/competition-applications/aadhaar/${encodeURIComponent(aadhaar.trim())}${dob ? `?dob=${encodeURIComponent(dob)}` : ''}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('No candidate found with this detail. Please verify your Roll Number or try searching on the full portal.');
        }
        throw new Error(data.message || 'Lookup failed');
      }

      setCandidate(data);
    } catch (err) {
      console.error('Admit Card lookup error:', err);
      setError(err.message || 'Unable to fetch admit card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintAdmitCard = () => {
    if (candidate) {
      openAdmitCardPrintWindow(candidate);
    }
  };

  const handlePrintApplicationForm = () => {
    if (candidate) {
      openApplicationFormPrintWindow(candidate);
    }
  };

  const handleResetSearch = () => {
    setCandidate(null);
    setError('');
    setRollNumber('');
    setMobile('');
    setDob('');
    setAadhaar('');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full max-w-xl overflow-hidden bg-gradient-to-b from-[#0B1329] via-[#0F172A] to-[#022C22] rounded-[2rem] shadow-[0_20px_70px_-15px_rgba(5,150,105,0.4)] border border-emerald-500/30 text-white my-auto max-h-[92vh] flex flex-col"
          >
            {/* Animated glowing top border */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400" />

            {/* Close Button */}
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 z-20 p-2 text-white/70 bg-white/10 hover:bg-white/20 hover:text-white rounded-full backdrop-blur-md transition-all shadow-md"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Area */}
            <div className="pt-6 sm:pt-7 pb-4 px-6 sm:px-8 text-center relative overflow-hidden">
              {/* Background ambient glow circles */}
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none" />
              <div className="absolute top-16 -left-12 w-44 h-44 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none" />

              {/* Status Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mb-3 text-xs font-black tracking-wider text-emerald-950 uppercase bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300 rounded-full shadow-lg shadow-emerald-500/25"
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>E-Admit Card 2026-2027 Is Live!</span>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-teal-200">
                Download Your Admit Card
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                State Level GK &amp; Computer Literacy Competition 2026-2027
              </p>

              {/* Quick Exam Date & Center Badge */}
              <div className="mt-3.5 p-3 rounded-2xl bg-white/5 border border-emerald-500/20 backdrop-blur-sm grid grid-cols-1 sm:grid-cols-3 gap-2 text-left text-xs">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Calendar className="w-4 h-4 flex-shrink-0 text-amber-400" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Exam Date</span>
                    <strong className="text-white">18 Oct 2026</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <Clock className="w-4 h-4 flex-shrink-0 text-teal-400" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Reporting</span>
                    <strong className="text-white">08:00 AM</strong>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <div className="truncate">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Venue</span>
                    <strong className="text-white truncate" title="SKMIC Semari Janghai">SKMIC Janghai</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Body Content */}
            <div className="px-6 sm:px-8 pb-6 overflow-y-auto flex-1">
              {!candidate ? (
                /* Search Form View */
                <div className="bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  {/* Method Switcher Tabs */}
                  <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl mb-4 border border-white/5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => { setSearchMethod('roll'); setError(''); }}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center ${
                        searchMethod === 'roll' 
                          ? 'bg-emerald-600 text-white shadow-md font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Roll Number
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSearchMethod('mobile'); setError(''); }}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center ${
                        searchMethod === 'mobile' 
                          ? 'bg-emerald-600 text-white shadow-md font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Mobile + DOB
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSearchMethod('aadhaar'); setError(''); }}
                      className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center ${
                        searchMethod === 'aadhaar' 
                          ? 'bg-emerald-600 text-white shadow-md font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Aadhaar
                    </button>
                  </div>

                  <form onSubmit={handleSearch} className="space-y-3">
                    {searchMethod === 'roll' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Enter Candidate Roll Number *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            autoFocus
                            placeholder="e.g. SKMIC-001 or NIICT..."
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                            className="w-full px-4 py-3 bg-black/40 border border-slate-700 rounded-xl text-white font-mono placeholder:font-sans placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 tracking-wider"
                          />
                          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                        </div>
                        <span className="block text-[11px] text-slate-400 mt-1">
                          💡 You can enter your full Roll No or last sequence number.
                        </span>
                      </div>
                    )}

                    {searchMethod === 'mobile' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Candidate Mobile *
                          </label>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            placeholder="10-digit number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3.5 py-2.5 bg-black/40 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Date of Birth *
                          </label>
                          <input
                            type="date"
                            required
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-black/40 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 [color-scheme:dark]"
                          />
                        </div>
                      </div>
                    )}

                    {searchMethod === 'aadhaar' && (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            12-Digit Aadhaar Number *
                          </label>
                          <input
                            type="text"
                            maxLength={12}
                            required
                            placeholder="Enter 12-digit UID"
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-3.5 py-2.5 bg-black/40 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono tracking-wider"
                          />
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-[length:200%_auto] hover:bg-right hover:scale-[1.01] transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Searching Candidate Record...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Find &amp; Download Admit Card</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* Candidate Verified Success Card */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900/80 p-5 rounded-2xl border border-emerald-500/40 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <div className="w-12 h-14 rounded-xl bg-white/10 border border-white/20 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {candidate.image ? (
                        <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Candidate Found ✓</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white truncate leading-tight">
                        {candidate.name}
                      </h3>
                      <div className="text-xs text-slate-300 font-mono font-bold text-amber-300 mt-0.5">
                        Roll No: {candidate.rollNumber}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                    <div className="bg-black/30 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Subject Paper</span>
                      <strong className="text-white">{candidate.subject || 'Both'}</strong>
                    </div>
                    <div className="bg-black/30 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Father's Name</span>
                      <strong className="text-white truncate block">{candidate.fatherName || 'N/A'}</strong>
                    </div>
                    <div className="bg-black/30 p-2 rounded-lg col-span-2">
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Confirmed Venue</span>
                      <strong className="text-emerald-300">🏢 S K Modern Inter College Semari Janghai</strong>
                    </div>
                  </div>

                  {/* Print & Download Buttons */}
                  <div className="space-y-2 mt-4">
                    <button
                      onClick={handlePrintAdmitCard}
                      className="w-full py-3.5 px-5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print E-Admit Card (Hall Ticket)</span>
                    </button>

                    <button
                      onClick={handlePrintApplicationForm}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/15 transition-all border border-white/10 flex items-center justify-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Print Application Form &amp; Fee Receipt</span>
                    </button>

                    <button
                      onClick={handleResetSearch}
                      className="w-full text-center text-xs text-slate-400 hover:text-white pt-1 font-semibold"
                    >
                      ← Search Another Roll Number
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Quick Links & Portal Redirect */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
                <Link
                  to="/admit-card"
                  onClick={closePopup}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 group"
                >
                  <span>Open Full Admit Card Portal Page</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  onClick={closePopup}
                  className="text-slate-400 hover:text-white font-medium"
                >
                  Continue to Website
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdmitCardPopup;
