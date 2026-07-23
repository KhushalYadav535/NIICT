import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building2, Key, ShieldCheck, Camera } from 'lucide-react';

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  
  useEffect(() => {
    const data = localStorage.getItem('franchiseData');
    if (data) {
      setProfile(JSON.parse(data));
    }
  }, []);

  if (!profile) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
        <h2 className="text-2xl font-black text-slate-800 mb-2">My Profile</h2>
        <p className="text-slate-500">Manage your franchise details and account settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col items-center text-center">
          <div className="relative mb-6 group cursor-pointer">
            <div className="w-32 h-32 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-5xl font-black border-4 border-white shadow-lg overflow-hidden">
              {profile.ownerName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="text-white" size={24} />
            </div>
          </div>
          
          <h3 className="text-2xl font-black text-slate-800">{profile.ownerName}</h3>
          <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mt-1 mb-4">Center Director</p>
          
          <div className="w-full bg-slate-50 rounded-2xl p-4 mt-2">
            <div className="flex items-center gap-3 text-slate-600 mb-2">
              <ShieldCheck size={18} className="text-green-500" />
              <span className="font-medium text-sm">Account Status: <span className="text-green-600 font-bold">Approved</span></span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Building2 size={18} className="text-blue-500" />
              <span className="font-medium text-sm">{profile.instituteName}</span>
            </div>
          </div>
        </div>

        {/* Details Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <input type="text" defaultValue={profile.ownerName} readOnly className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none" />
                <User size={18} className="absolute left-4 top-3.5 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <input type="email" defaultValue={profile.email} readOnly className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none" />
                <Mail size={18} className="absolute left-4 top-3.5 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Contact</label>
              <div className="relative">
                <input type="text" defaultValue={profile.contact1} readOnly className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none" />
                <Phone size={18} className="absolute left-4 top-3.5 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">District & State</label>
              <div className="relative">
                <input type="text" defaultValue={`${profile.district}, ${profile.state}`} readOnly className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none" />
                <MapPin size={18} className="absolute left-4 top-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mt-10 mb-6">Change Password</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
              <div className="relative">
                <input type="password" placeholder="Enter new password" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none" />
                <Key size={18} className="absolute left-4 top-3.5 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <input type="password" placeholder="Confirm new password" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none" />
                <Key size={18} className="absolute left-4 top-3.5 text-slate-400" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => alert('Profile updated successfully! Changes have been saved.')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-indigo-200"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
