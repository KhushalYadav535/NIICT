import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Search, Trophy, Medal, Award, CheckCircle2, 
  Sparkles, ExternalLink, Phone, User, Hash, AlertCircle, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');

const ResultPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchMethod, setSearchMethod] = useState('roll'); // 'roll' | 'mobile' | 'aadhaar'
  const [rollDigits, setRollDigits] = useState('');
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('hasSeenResultPopup2026');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenResultPopup2026', 'true');
  };

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setResult(null);

    let query = '';
    if (searchMethod === 'roll') {
      const cleanDigits = rollDigits.trim().toUpperCase().replace(/^NIICT/i, '');
      if (!cleanDigits) {
        setError('Please enter your roll number digits (e.g. 1655)');
        return;
      }
      query = `NIICT${cleanDigits}`;
    } else if (searchMethod === 'mobile') {
      const cleanPhone = mobile.trim().replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        setError('Please enter a valid 10-digit registered mobile number');
        return;
      }
      query = cleanPhone.slice(-10);
    } else if (searchMethod === 'aadhaar') {
      const cleanAadhaar = aadhaar.trim().replace(/\D/g, '');
      if (cleanAadhaar.length !== 12) {
        setError('Please enter a valid 12-digit Aadhaar number');
        return;
      }
      query = cleanAadhaar;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/results/search/${encodeURIComponent(query)}`);
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.message || 'No result found matching your entered details. Please check and try again.');
      }
    } catch (err) {
      console.error('Error fetching result in popup:', err);
      setError('Unable to connect to result server. Please check your connection or visit the full Results portal.');
    } finally {
      setLoading(false);
    }
  };

  const goToFullResult = (roll) => {
    closePopup();
    if (roll) {
      navigate(`/results?roll=${encodeURIComponent(roll)}`);
    } else {
      navigate('/results');
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: <Trophy className="w-4 h-4 text-amber-600" />, label: 'Rank #1 (State Topper)', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (rank === 2) return { icon: <Medal className="w-4 h-4 text-slate-700" />, label: 'Rank #2 (Silver Medal)', color: 'bg-slate-200 text-slate-900 border-slate-300' };
    if (rank === 3) return { icon: <Award className="w-4 h-4 text-amber-700" />, label: 'Rank #3 (Bronze Medal)', color: 'bg-amber-100 text-amber-950 border-amber-300' };
    if (rank && rank <= 20) return { icon: <Award className="w-4 h-4 text-blue-600" />, label: `Rank #${rank}`, color: 'bg-blue-100 text-blue-900 border-blue-200' };
    return { icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, label: 'Qualified', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg overflow-hidden bg-white rounded-3xl shadow-[0_25px_70px_-15px_rgba(0,0,0,0.25)] border-2 border-amber-300 text-slate-800 my-auto max-h-[92vh] flex flex-col"
          >
            {/* Top decorative gradient bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#245894] via-amber-400 to-[#d13030]" />

            {/* Close Button */}
            <button 
              onClick={closePopup}
              className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Area */}
            <div className="pt-6 sm:pt-7 pb-3 px-6 sm:px-8 text-center bg-gradient-to-b from-amber-50/60 via-white to-white">
              {/* Status Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 mb-2 text-xs font-black tracking-wider text-amber-900 uppercase bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200 rounded-full border border-amber-300 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                <span>Results Live &bull; Session 2026-2027</span>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Check Your Competition Result
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                State Level Talent Search &amp; GK Exam 2026-2027
              </p>
            </div>

            {/* Content Body */}
            <div className="px-5 sm:px-7 pb-6 overflow-y-auto space-y-4">
              {!result ? (
                <>
                  {/* Search Method Selector */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => { setSearchMethod('roll'); setError(''); }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                        searchMethod === 'roll'
                          ? 'bg-white text-[#245894] shadow-sm font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Hash className="w-3.5 h-3.5" />
                      <span>Roll No.</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSearchMethod('mobile'); setError(''); }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                        searchMethod === 'mobile'
                          ? 'bg-white text-[#245894] shadow-sm font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSearchMethod('aadhaar'); setError(''); }}
                      className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                        searchMethod === 'aadhaar'
                          ? 'bg-white text-[#245894] shadow-sm font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Aadhaar</span>
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSearch} className="space-y-3.5">
                    {searchMethod === 'roll' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Enter Roll Number <span className="text-[#245894] text-[11px] font-semibold">(Prefix NIICT is default)</span>
                        </label>
                        <div className="flex rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm focus-within:border-[#245894] focus-within:ring-2 focus-within:ring-blue-100 bg-white">
                          <span className="px-4 py-3 bg-blue-50 text-[#245894] font-black text-sm tracking-wider border-r border-slate-200 flex items-center select-none">
                            NIICT
                          </span>
                          <input
                            type="text"
                            value={rollDigits}
                            onChange={(e) => setRollDigits(e.target.value.replace(/\D/g, ''))}
                            placeholder="e.g. 1655"
                            className="flex-1 bg-transparent px-3.5 py-3 text-slate-900 placeholder-slate-400 text-sm font-bold outline-none tracking-wider"
                            autoFocus
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1.5">
                          💡 Tip: Just enter your 4 digits (e.g. <span className="font-bold text-[#245894]">1655</span> for roll NIICT1655).
                        </p>
                      </div>
                    )}

                    {searchMethod === 'mobile' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          10-Digit Registered Mobile Number
                        </label>
                        <div className="flex rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm focus-within:border-[#245894] focus-within:ring-2 focus-within:ring-blue-100 bg-white">
                          <span className="px-3.5 py-3 bg-slate-100 text-slate-600 font-bold text-xs tracking-wider border-r border-slate-200 flex items-center select-none">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 10-digit mobile number"
                            className="flex-1 bg-transparent px-3.5 py-3 text-slate-900 placeholder-slate-400 text-sm font-semibold outline-none tracking-wider"
                            autoFocus
                          />
                        </div>
                      </div>
                    )}

                    {searchMethod === 'aadhaar' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          12-Digit Aadhaar Card Number
                        </label>
                        <div className="flex rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm focus-within:border-[#245894] focus-within:ring-2 focus-within:ring-blue-100 bg-white">
                          <input
                            type="text"
                            maxLength={12}
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                            placeholder="Enter 12-digit Aadhaar number"
                            className="flex-1 bg-transparent px-3.5 py-3 text-slate-900 placeholder-slate-400 text-sm font-semibold outline-none tracking-wider text-center"
                            autoFocus
                          />
                        </div>
                      </div>
                    )}

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -4 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-[#245894] via-[#1e40af] to-[#245894] hover:from-[#1d4370] hover:to-[#1e3a8a] text-white font-black rounded-xl text-sm transition-all duration-200 shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Searching Official Result...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Search Result</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                /* Light Theme Result Preview Card */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-amber-50/50 via-white to-blue-50/40 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 text-slate-900 space-y-4 shadow-lg"
                >
                  <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-[#245894] block">
                        Verified Official Result
                      </span>
                      <h3 className="text-xl font-black text-slate-900 leading-tight">{result.name}</h3>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">S/D of {result.fatherName}</p>
                    </div>

                    {/* Rank Badge */}
                    <div className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm border ${getRankBadge(result.rank).color}`}>
                      {getRankBadge(result.rank).icon}
                      <span>{getRankBadge(result.rank).label}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center sm:text-left">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] text-slate-500 block font-bold">Roll Number</span>
                      <span className="text-xs font-black text-[#245894] font-mono">{result.rollNumber}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] text-slate-500 block font-bold">Candidate Contact</span>
                      <span className="text-xs font-bold text-slate-800 font-mono">{result.phone ? `XXXXXX${String(result.phone).slice(-4)}` : 'Verified'}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] text-slate-500 block font-bold">Marks Obtained</span>
                      <span className="text-sm font-black text-emerald-700 font-mono">{result.marks} / 100</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <span className="text-[10px] text-slate-500 block font-bold">Status / Grade</span>
                      <span className={`text-xs font-black ${result.status === 'Passed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {result.status} ({result.grade || 'A+'})
                      </span>
                    </div>
                  </div>

                  {result.school && (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                      <span className="text-[10px] text-slate-500 block font-bold">Institution / School</span>
                      <span className="font-semibold text-slate-900">{result.school}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => goToFullResult(result.rollNumber)}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-amber-400/25 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Full Scorecard &amp; Print</span>
                    </button>
                    <button
                      onClick={() => setResult(null)}
                      className="py-3 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer border border-slate-300"
                    >
                      Search Another
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Ticker Footer */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold text-[11px]">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>State Level Merit List (2026-2027)</span>
                </div>
                <button
                  onClick={() => goToFullResult()}
                  className="text-[#245894] hover:underline text-[11px] font-black flex items-center gap-0.5"
                >
                  <span>Open Full Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResultPopup;
