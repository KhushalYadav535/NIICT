import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ChevronRight, User, BookOpen, MapPin, UploadCloud, Calendar, Phone, Mail, FileText, CheckCircle2, Award } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.MODE === 'production' ? 'https://niictbackend.onrender.com' : 'http://localhost:5000');

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: '',
    session: '',
    courseType: '',
    courseInterest: '',
    fatherName: '',
    motherName: '',
    mobile: '',
    alternateMobile: '',
    email: '',
    dob: '',
    gender: '',
    qualification: '',
    address: ''
  });
  const [files, setFiles] = useState({
    profilePhoto: null,
    marksheetCertificate: null,
    aadharCard: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files: fileList } = e.target;
    if (type === 'file' && fileList && fileList[0]) {
      setFiles(prev => ({ ...prev, [name]: fileList[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formDataObj = new FormData();
      
      // Add all text fields to FormData
      Object.keys(formData).forEach(key => {
        if (formData[key]) formDataObj.append(key, formData[key]);
      });
      
      // Add files to FormData
      if (files.profilePhoto) {
        formDataObj.append('profilePhoto', files.profilePhoto);
      }
      if (files.marksheetCertificate) {
        formDataObj.append('marksheetCertificate', files.marksheetCertificate);
      }
      if (files.aadharCard) {
        formDataObj.append('aadharCard', files.aadharCard);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/students`, {
        method: 'POST',
        body: formDataObj
      });
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to add student');
      }
      
      alert('Student added successfully!');
      navigate('/franchise-dashboard/pending-student');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reusable File Upload Component
  const FileUploadInput = ({ label, name, accept, hint }) => (
    <div className="flex flex-col">
      <label className="text-[13px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
        <UploadCloud size={14} className="text-blue-500" /> {label}
      </label>
      <div className="relative group">
        <input 
          type="file" 
          name={name}
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl px-4 py-4 flex flex-col items-center justify-center text-center transition-all group-hover:border-blue-400 group-hover:bg-blue-50/50">
          <div className="bg-white p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
            <UploadCloud size={18} className="text-blue-500" />
          </div>
          <span className="text-sm font-medium text-slate-700">
            {files[name] ? files[name].name : 'Click or drag file here'}
          </span>
          <span className="text-[11px] text-slate-500 mt-1">{hint}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto min-h-screen bg-slate-50/50 p-4 md:p-6 -m-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Link to="/franchise-dashboard" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <Home size={14} /> Dashboard
          </Link>
          <ChevronRight size={14} />
          <span className="text-slate-800 font-medium">Add Student</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Student Registration</h1>
        <p className="text-slate-500 mt-1">Fill in the details below to enroll a new student.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Details Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden transition-all hover:shadow-md">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 to-transparent flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg"><BookOpen size={18} className="text-blue-600" /></div>
            <h2 className="text-lg font-bold text-slate-800">Course Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/30">
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 block">
                Session <span className="text-red-500">*</span>
              </label>
              <select
                name="session" value={formData.session} onChange={handleChange} required
                className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              >
                <option value="">Select Session</option>
                <option value="2016-17">2016-17</option>
                <option value="2017-18">2017-18</option>
                <option value="2018-19">2018-19</option>
                <option value="2019-20">2019-20</option>
                <option value="2020-21">2020-21</option>
                <option value="2021-22">2021-22</option>
                <option value="2022-23">2022-23</option>
                <option value="2023-24">2023-24</option>
                <option value="2024-25">2024-25</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 block">Course Type</label>
              <select
                name="courseType" value={formData.courseType} onChange={handleChange}
                className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              >
                <option value="">Select</option>
                <option value="popular">Popular Courses</option>
                <option value="other">Other Courses</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 block">Course of Interest</label>
              {formData.courseType === 'popular' ? (
                <>
                  <input 
                    type="text" name="courseInterest" list="popular-courses-list" value={formData.courseInterest} onChange={handleChange}
                    className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400"
                    placeholder="Search and select a popular course..."
                  />
                  <datalist id="popular-courses-list">
                    <option value="[269] ADVANCE DIPLOMA IN COMPUTER APPLICATION (ADCA) 1-YEAR" />
                    <option value="[89] ADVANCE DIPLOMA IN COMPUTER APPLICATION -(ADCA) - 1 YEAR" />
                    <option value="[275] ADVANCE DIPLOMA IN COMPUTER APPLICATION -1YEAR" />
                    <option value="[272] DIPLOMA IN COMPUTER APPLICATION (DCA), 6-MONTH'S" />
                    <option value="[280] CERTIFICATE IN COMPUTER APPLICATION (CCA) 6-MONTHS" />
                    <option value="[281] BASIC COMPUTER COURSE (BCC) 3-MONTHS" />
                    <option value="[282] POST GRADUATE DIPLOMA IN COMPUTER APPLICATION (PGDCA) 1-YEAR" />
                    <option value="[283] COURSE ON COMPUTER CONCEPTS (CCC) 3-MONTHS" />
                    <option value="[284] DIPLOMA IN FINANCIAL ACCOUNTING (DFA) 6-MONTHS" />
                    <option value="[285] ADVANCE DIPLOMA IN FINANCIAL ACCOUNTING (ADFA) 1-YEAR" />
                  </datalist>
                </>
              ) : (
                <input 
                  type="text" name="courseInterest" value={formData.courseInterest} onChange={handleChange}
                  className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-slate-400"
                  placeholder={formData.courseType === 'other' ? "Type your course name here..." : "Select Course Type first"}
                  disabled={!formData.courseType}
                />
              )}
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden transition-all hover:shadow-md">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50/50 to-transparent flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg"><User size={18} className="text-purple-600" /></div>
            <h2 className="text-lg font-bold text-slate-800">Personal Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/30">
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 block">Student Full Name <span className="text-red-500">*</span></label>
              <input 
                type="text" name="studentName" value={formData.studentName} onChange={handleChange} required
                className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm placeholder:text-slate-400"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 block">Father/Husband Name <span className="text-red-500">*</span></label>
              <input 
                type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required
                className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm placeholder:text-slate-400"
                placeholder="Enter father's name"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 block">Mother's Name</label>
              <input 
                type="text" name="motherName" value={formData.motherName} onChange={handleChange}
                className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm placeholder:text-slate-400"
                placeholder="Enter mother's name"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Calendar size={14} className="text-slate-400"/> Date of Birth <span className="text-red-500">*</span></label>
              <input 
                type="date" name="dob" value={formData.dob} onChange={handleChange} required
                className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 block">Gender <span className="text-red-500">*</span></label>
              <select
                name="gender" value={formData.gender} onChange={handleChange} required
                className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Award size={14} className="text-slate-400"/> Qualification</label>
              <select
                name="qualification" value={formData.qualification} onChange={handleChange}
                className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
              >
                <option value="">Select Qualification</option>
                <option value="10th">10th</option>
                <option value="12th">12th</option>
                <option value="graduate">Graduate</option>
                <option value="post-graduate">Post Graduate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact & Address Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden transition-all hover:shadow-md">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 to-transparent flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg"><MapPin size={18} className="text-emerald-600" /></div>
            <h2 className="text-lg font-bold text-slate-800">Contact & Address</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/30">
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Phone size={14} className="text-slate-400"/> Primary Mobile <span className="text-red-500">*</span></label>
              <input 
                type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required
                className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm placeholder:text-slate-400"
                placeholder="10-digit mobile number"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Phone size={14} className="text-slate-400"/> Alternate Mobile</label>
              <input 
                type="tel" name="alternateMobile" value={formData.alternateMobile} onChange={handleChange}
                className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm placeholder:text-slate-400"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Mail size={14} className="text-slate-400"/> Email Address <span className="text-red-500">*</span></label>
              <input 
                type="email" name="email" value={formData.email} onChange={handleChange} required
                className="w-full bg-white px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm placeholder:text-slate-400"
                placeholder="student@example.com"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-[13px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><MapPin size={14} className="text-slate-400"/> Full Address <span className="text-red-500">*</span></label>
              <textarea
                name="address" value={formData.address} onChange={handleChange} required rows={3}
                className="w-full bg-white px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm placeholder:text-slate-400 resize-none"
                placeholder="Enter complete residential address with PIN code"
              />
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden transition-all hover:shadow-md">
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50/50 to-transparent flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg"><FileText size={18} className="text-amber-600" /></div>
            <h2 className="text-lg font-bold text-slate-800">Documents Upload</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/30">
            <FileUploadInput 
              label="Profile Photo" 
              name="profilePhoto" 
              accept="image/*" 
              hint="JPG, PNG format (Max 2MB)" 
            />
            <FileUploadInput 
              label="Marksheet / Certificate" 
              name="marksheetCertificate" 
              accept=".pdf,image/*" 
              hint="PDF, JPG, PNG format" 
            />
            <FileUploadInput 
              label="Aadhar Card" 
              name="aadharCard" 
              accept=".pdf,image/*" 
              hint="PDF, JPG, PNG format" 
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm">
            <div className="bg-red-100 p-1 rounded-full"><span className="text-red-600 text-lg font-bold px-1.5">!</span></div>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-slate-200/60">
          <button
            type="button"
            onClick={() => navigate('/franchise-dashboard')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white px-8 py-2.5 rounded-xl font-medium shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <>
                <CheckCircle2 size={18} /> Enroll Student
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
