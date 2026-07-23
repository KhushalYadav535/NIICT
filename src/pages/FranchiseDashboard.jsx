import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { 
  Home, Users, FileText, BookOpen, FileCheck, Award, PenTool, User as UserIcon, LogOut,
  ChevronRight, Menu, X, ChevronDown, Plus, DollarSign, CheckCircle,
  MapPin, Phone, Mail, Calendar, CreditCard, Hash, Building2, Clock
} from 'lucide-react';

// Import Student Management components
import AddStudent from '../components/franchise/AddStudent';
import PaidStudent from '../components/franchise/PaidStudent';
import PendingStudent from '../components/franchise/PendingStudent';
import MakePayment from '../components/franchise/MakePayment';

// Import Result Management components
import AddUpdateMarks from '../components/franchise/AddUpdateMarks';
import TypingResult from '../components/franchise/TypingResult';
import FinalResult from '../components/franchise/FinalResult';
import SemesterResult from '../components/franchise/SemesterResult';

// Import Miscellaneous components
import ActiveCourses from '../components/franchise/ActiveCourses';
import CertificateOrder from '../components/franchise/CertificateOrder';
import InstituteCertificate from '../components/franchise/InstituteCertificate';
import CenterSignature from '../components/franchise/CenterSignature';
import MyProfile from '../components/franchise/MyProfile';

// Import Financial components
import WalletLedger from '../components/franchise/WalletLedger';
import IncentiveLedger from '../components/franchise/IncentiveLedger';
import AddBalance from '../components/franchise/AddBalance';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');

const FranchiseDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [franchiseData, setFranchiseData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [totalStudents, setTotalStudents] = useState(0);
  const [paidStudents, setPaidStudents] = useState(0);
  const [pendingStudents, setPendingStudents] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  useEffect(() => {
    const stored = localStorage.getItem('franchiseData');
    const token = localStorage.getItem('franchiseToken');
    if (!stored || !token) {
      navigate('/franchise-login');
      return;
    }
    const data = JSON.parse(stored);
    setFranchiseData(data);
    fetchStats(data._id);
  }, [navigate]);

  const fetchStats = async (franchiseId) => {
    try {
      const token = localStorage.getItem('franchiseToken');
      const headers = { Authorization: `Bearer ${token}` };
      const [allRes, paidRes, pendingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/students?franchiseId=${franchiseId}`, { headers }),
        fetch(`${API_BASE_URL}/api/students?franchiseId=${franchiseId}&status=paid`, { headers }),
        fetch(`${API_BASE_URL}/api/students?franchiseId=${franchiseId}&status=pending`, { headers })
      ]);
      if (allRes.ok) { const d = await allRes.json(); setTotalStudents(Array.isArray(d) ? d.length : 0); }
      if (paidRes.ok) { const d = await paidRes.json(); setPaidStudents(Array.isArray(d) ? d.length : 0); }
      if (pendingRes.ok) { const d = await pendingRes.json(); setPendingStudents(Array.isArray(d) ? d.length : 0); }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('franchiseToken');
    localStorage.removeItem('franchiseData');
    navigate('/franchise-login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/franchise-dashboard', icon: <Home size={18} /> },
    { 
      name: 'Student Management', 
      icon: <Users size={18} />, 
      submenu: [
        { name: 'Add Student', path: '/franchise-dashboard/add-student', icon: <Plus size={14} /> },
        { name: 'Paid Student', path: '/franchise-dashboard/paid-student', icon: <DollarSign size={14} /> },
        { name: 'Pending Student', path: '/franchise-dashboard/pending-student', icon: <DollarSign size={14} /> },
        { name: 'Make Payment', path: '/franchise-dashboard/make-payment', icon: <CreditCard size={14} /> }
      ]
    },
    { 
      name: 'Result Management', 
      icon: <FileText size={18} />, 
      submenu: [
        { name: 'Add/Update Marks', path: '/franchise-dashboard/add-update-marks', icon: <Plus size={14} /> },
        { name: 'Typing Result', path: '/franchise-dashboard/typing-result', icon: <FileText size={14} /> },
        { name: 'Final Result', path: '/franchise-dashboard/final-result', icon: <Award size={14} /> },
        { name: 'Semester Result', path: '/franchise-dashboard/semester-result', icon: <Calendar size={14} /> }
      ]
    },
    { name: 'Active Courses', path: '/franchise-dashboard/active-courses', icon: <BookOpen size={18} /> },
    { name: 'Certificate Order', path: '/franchise-dashboard/certificate-order', icon: <FileCheck size={18} /> },
    { name: 'Institute Certificate', path: '/franchise-dashboard/institute-certificate', icon: <Award size={18} /> },
    { name: 'Center Signature', path: '/franchise-dashboard/center-signature', icon: <PenTool size={18} /> },
    { name: 'My Profile', path: '/franchise-dashboard/my-profile', icon: <UserIcon size={18} /> },
  ];

  // Render Dashboard Home
  const DashboardHome = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-2xl"></div>
        <div className="absolute bottom-0 left-10 w-32 h-32 rounded-full bg-blue-400 opacity-10 blur-xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">{franchiseData?.instituteName}</h1>
            <p className="text-blue-100 text-lg">Welcome back, {franchiseData?.ownerName} 👋</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div onClick={() => navigate('/franchise-dashboard/incentive-ledger')} className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3.5 rounded-2xl text-center min-w-[120px] hover:bg-white/20 transition-colors">
              <span className="text-[11px] text-blue-200 block uppercase tracking-wider font-bold mb-1">Incentive</span>
              <span className="font-bold text-2xl">₹ 0</span>
            </div>
            <div onClick={() => navigate('/franchise-dashboard/wallet-ledger')} className="cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3.5 rounded-2xl text-center min-w-[120px] hover:bg-white/20 transition-colors">
              <span className="text-[11px] text-blue-200 block uppercase tracking-wider font-bold mb-1">Wallet Balance</span>
              <span className="font-bold text-2xl">₹ 0</span>
            </div>
            <button onClick={() => navigate('/franchise-dashboard/add-balance')} className="bg-white text-indigo-700 px-6 py-3.5 rounded-2xl font-bold shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center">
              Add Fund
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Students', value: loadingStats ? '...' : totalStudents, icon: <Users size={24} className="text-blue-600" />, bg: 'bg-blue-50', link: '/franchise-dashboard/paid-student' },
          { title: 'Paid Students', value: loadingStats ? '...' : paidStudents, icon: <CheckCircle size={24} className="text-emerald-600" />, bg: 'bg-emerald-50', link: '/franchise-dashboard/paid-student' },
          { title: 'Pending Students', value: loadingStats ? '...' : pendingStudents, icon: <Clock size={24} className="text-amber-600" />, bg: 'bg-amber-50', link: '/franchise-dashboard/pending-student' },
          { title: 'My Profile', value: 'View', icon: <UserIcon size={24} className="text-purple-600" />, bg: 'bg-purple-50', link: '/franchise-dashboard/my-profile' },
        ].map((stat, index) => (
          <div key={index} onClick={() => stat.link !== '#' && navigate(stat.link)} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div>
              <p className="text-4xl font-black text-slate-800 mb-1">{stat.value}</p>
              <p className="text-sm font-semibold text-slate-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Centre Info Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
          <div className="bg-slate-100 p-2.5 rounded-xl">
            <Building2 size={18} className="text-slate-700" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Franchise Information</h2>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6 bg-slate-50/50">
          <div className="flex gap-4">
            <div className="w-11 h-11 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Building2 size={18} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Institute Name</p>
              <p className="font-semibold text-slate-800 mt-0.5">{franchiseData?.instituteName || '—'}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-11 h-11 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Owner Name</p>
              <p className="font-semibold text-slate-800 mt-0.5">{franchiseData?.ownerName || '—'}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-11 h-11 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
              <p className="font-semibold text-slate-800 mt-0.5 text-sm break-all">{franchiseData?.email || '—'}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-11 h-11 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-orange-600" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Contact Numbers</p>
              <p className="font-semibold text-slate-800 mt-0.5">{franchiseData?.contact1 || '—'}</p>
              {franchiseData?.contact2 && <p className="text-sm text-slate-500">{franchiseData.contact2}</p>}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-11 h-11 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-rose-600" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {[franchiseData?.district, franchiseData?.state].filter(Boolean).join(', ') || '—'}
              </p>
              {franchiseData?.pinCode && <p className="text-sm text-slate-500">PIN: {franchiseData.pinCode}</p>}
            </div>
          </div>
          {franchiseData?.pan && (
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard size={18} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">PAN Number</p>
                <p className="font-semibold text-slate-800 mt-0.5 uppercase">{franchiseData.pan}</p>
              </div>
            </div>
          )}
          {franchiseData?.gst && (
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Hash size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">GST Number</p>
                <p className="font-semibold text-slate-800 mt-0.5 uppercase">{franchiseData.gst}</p>
              </div>
            </div>
          )}
          {franchiseData?.applicationDate && (
            <div className="flex gap-4">
              <div className="w-11 h-11 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-sky-600" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Registered On</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {new Date(franchiseData.applicationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notice */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-5 text-sm text-amber-900 font-medium shadow-sm flex items-start gap-3">
        <div className="bg-amber-100 p-1.5 rounded-lg text-xl leading-none mt-0.5">📦</div>
        <div>
          <span className="block mb-1 text-amber-950 font-bold">Courier Policy Update</span>
          No Courier Charge on minimum 3 Marksheet orders. Single Marksheet Courier Charge: <strong className="bg-amber-200/60 px-1 rounded">₹70/-</strong> applicable.
        </div>
      </div>
    </div>
  );

  if (!franchiseData) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-[#343a40] text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        {/* Toggle button */}
        <div className="px-4 py-3 flex justify-between items-center border-b border-gray-700 bg-[#2b3035] min-h-[60px]">
          {sidebarOpen && <span className="font-bold text-lg tracking-wide text-white">NIICT PANEL</span>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* User Profile */}
        <div className="px-4 py-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#007bff] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-[#0056b3]">
              <UserIcon size={24} className="text-white" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="font-medium text-[15px] text-gray-100 truncate">{franchiseData.ownerName || 'Admin'}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setOpenSubmenus(prev => ({...prev, [item.name]: !prev[item.name]}))}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-none transition-colors ${item.submenu.some(sub => location.pathname === sub.path) ? 'bg-[#007bff] text-white border-l-4 border-[#0056b3]' : 'text-gray-300 hover:bg-[#2c3136] hover:text-white border-l-4 border-transparent'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${item.submenu.some(sub => location.pathname === sub.path) ? 'text-white' : 'text-gray-400'}`}>{React.cloneElement(item.icon, { size: 16 })}</span>
                      {sidebarOpen && <span className="font-medium text-[14px] tracking-wide">{item.name}</span>}
                    </div>
                    {sidebarOpen && <ChevronRight size={14} className={`transition-transform ${item.submenu.some(sub => location.pathname === sub.path) ? 'text-white' : 'text-gray-400'} ${openSubmenus[item.name] ? 'rotate-90' : ''}`} />}
                  </button>
                  {sidebarOpen && openSubmenus[item.name] && (
                    <div className="bg-[#2a2e33]">
                      {item.submenu.map((sub) => {
                        const isActive = location.pathname === sub.path;
                        return (
                          <button
                            key={sub.name}
                            onClick={() => navigate(sub.path)}
                            className={`w-full flex items-center gap-2 pl-12 pr-4 py-2.5 rounded-none transition-colors text-[13.5px] ${isActive ? 'text-white bg-[#343a40]' : 'text-gray-400 hover:text-white hover:bg-[#343a40]'}`}
                          >
                            {/* <ChevronRight size={12} className={isActive ? 'text-[#007bff]' : ''} /> */}
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => item.path && navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-none transition-colors ${location.pathname === item.path ? 'bg-[#007bff] text-white border-l-4 border-[#0056b3]' : 'text-gray-300 hover:bg-[#2c3136] hover:text-white border-l-4 border-transparent'}`}
                >
                  <span className={`${location.pathname === item.path ? 'text-white' : 'text-gray-400'}`}>{React.cloneElement(item.icon, { size: 16 })}</span>
                  {sidebarOpen && <span className="font-medium text-[14px] tracking-wide">{item.name}</span>}
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-none text-gray-400 hover:bg-[#2c3136] hover:text-white transition-colors border-l-4 border-transparent"
          >
            <LogOut size={16} />
            {sidebarOpen && <span className="font-medium text-[14px] tracking-wide">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-800">
                  {franchiseData?.instituteName || 'NIICT Centre'}
                </span>
                <span className="text-xs text-gray-500">
                  {franchiseData?.district && franchiseData?.state
                    ? `${franchiseData.district}, ${franchiseData.state}`
                    : 'Authorised Training Centre'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {franchiseData?.contact1 && (
                <span className="hidden md:flex items-center gap-1 text-sm text-gray-500">
                  <Phone size={14} /> {franchiseData.contact1}
                </span>
              )}
              <span className="hidden md:flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                <CheckCircle size={12} /> Approved
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="paid-student" element={<PaidStudent />} />
            <Route path="pending-student" element={<PendingStudent />} />
            <Route path="make-payment" element={<MakePayment />} />
            <Route path="add-update-marks" element={<AddUpdateMarks />} />
            <Route path="typing-result" element={<TypingResult />} />
            <Route path="final-result" element={<FinalResult />} />
            <Route path="semester-result" element={<SemesterResult />} />
            <Route path="active-courses" element={<ActiveCourses />} />
            <Route path="certificate-order" element={<CertificateOrder />} />
            <Route path="institute-certificate" element={<InstituteCertificate />} />
            <Route path="center-signature" element={<CenterSignature />} />
            <Route path="my-profile" element={<MyProfile />} />
            <Route path="wallet-ledger" element={<WalletLedger />} />
            <Route path="incentive-ledger" element={<IncentiveLedger />} />
            <Route path="add-balance" element={<AddBalance />} />
          </Routes>

          {/* Footer (only show on dashboard home) */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <p>© 2023 © Copyright SDEI | All rights reserved.</p>
              <p>Version 3.0.5</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FranchiseDashboard;
