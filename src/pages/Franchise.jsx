import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Building2, Users, Globe, TrendingUp, Shield,
  Phone, Mail, MapPin, AlertCircle, ArrowRight, Star, Award,
  Clock, Lock, Calendar, CreditCard, Hash, ChevronRight,
  FileText, Sparkles, BadgeCheck, HeartHandshake, Landmark
} from 'lucide-react';

const steps = ['Institute Details', 'Contact Info', 'Address', 'Credentials', 'Terms'];

const benefits = [
  { icon: <BadgeCheck size={24} />, title: 'Brand Recognition', desc: 'Leverage the trusted NIICT brand with national presence.', color: 'bg-blue-50 text-blue-700' },
  { icon: <HeartHandshake size={24} />, title: 'Training Support', desc: 'Full staff training and curriculum delivery guidance.', color: 'bg-purple-50 text-purple-700' },
  { icon: <Globe size={24} />, title: 'Marketing Support', desc: 'National campaigns to drive student enrollment.', color: 'bg-green-50 text-green-700' },
  { icon: <TrendingUp size={24} />, title: 'Business Growth', desc: 'Proven model with high ROI in the education sector.', color: 'bg-orange-50 text-orange-700' },
  { icon: <Shield size={24} />, title: 'ISO Certified', desc: 'ISO 9001:2015 quality standards across all ops.', color: 'bg-red-50 text-red-700' },
  { icon: <Landmark size={24} />, title: '350+ Courses', desc: 'Comprehensive catalog of vocational & tech courses.', color: 'bg-teal-50 text-teal-700' },
];

const InputField = ({ label, error, children, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <AlertCircle size={12} />{error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const inputClass = (error) =>
  `w-full px-4 py-2.5 border rounded-lg text-gray-900 text-sm outline-none transition-all focus:ring-2 focus:ring-[#1a237e]/30 focus:border-[#1a237e] ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`;

function Franchise() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    instituteName: '', ownerName: '', dob: '', pan: '', gst: '',
    contact1: '', contact2: '', whatsapp: '', email: '',
    ownerAddress: '', instituteAddress: '', pinCode: '', district: '', state: '',
    password: '', agree1: false, agree2: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (step) => {
    const e = {};
    if (step === 0) {
      if (!formData.instituteName.trim()) e.instituteName = 'Institute name is required';
      if (!formData.ownerName.trim()) e.ownerName = 'Owner name is required';
    }
    if (step === 1) {
      if (!formData.contact1.trim()) e.contact1 = 'Primary contact is required';
      else if (!/^[6-9]\d{9}$/.test(formData.contact1)) e.contact1 = 'Enter valid 10-digit number';
      if (!formData.email.trim()) e.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email address';
    }
    if (step === 2) {
      if (!formData.instituteAddress.trim()) e.instituteAddress = 'Institute address is required';
      if (!formData.pinCode.trim()) e.pinCode = 'Pin code is required';
      if (!formData.district.trim()) e.district = 'District is required';
      if (!formData.state.trim()) e.state = 'State is required';
    }
    if (step === 3) {
      if (!formData.password) e.password = 'Password is required';
      else if (formData.password.length < 6) e.password = 'Minimum 6 characters';
    }
    if (step === 4) {
      if (!formData.agree1) e.agree1 = 'You must agree to the terms';
      if (!formData.agree2) e.agree2 = 'You must agree to receive communications';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep(currentStep)) setCurrentStep(s => s + 1); };
  const prevStep = () => setCurrentStep(s => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/api/franchise`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit');
      }
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a237e] to-[#0d1b5e] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-2xl">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={52} className="text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for applying to become an NIICT Authorised Training Centre.
            Our team will review your application and contact you within <strong>48 hours</strong>.
          </p>
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-2xl p-5 mb-8">
            {[
              { icon: <Clock size={20} />, text: 'Response in 48 hrs' },
              { icon: <Users size={20} />, text: 'Dedicated Support' },
              { icon: <Award size={20} />, text: '350+ Courses' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-gray-600 text-xs">
                <span className="text-[#1a237e] bg-white p-2 rounded-xl shadow-sm">{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          <Link to="/" className="inline-flex items-center gap-2 bg-[#1a237e] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0d1b5e] transition-colors">
            Back to Home <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1a237e] via-[#283593] to-[#1565c0] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-5 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} className="text-yellow-300" /> Franchise Opportunity
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight">
            Partner With <span className="text-yellow-300">NIICT</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-blue-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Become an Authorised Training Centre and build a successful education business with one of India's growing IT education networks.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6">
            {[
              { icon: <Star size={18} className="text-yellow-300" />, text: '50+ Centers' },
              { icon: <Award size={18} className="text-yellow-300" />, text: 'ISO 9001:2015' },
              { icon: <Users size={18} className="text-yellow-300" />, text: '10K+ Students' },
              { icon: <FileText size={18} className="text-yellow-300" />, text: '350+ Courses' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                {item.icon} {item.text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Partner with NIICT?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Join a network that supports your growth with tools, training, and a trusted brand.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${b.color} group-hover:scale-110 transition-transform`}>
                {b.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{b.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Info */}
      <section className="bg-white py-14 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-blue-50 text-[#1a237e] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">About NIICT</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-snug">A Government-Recognised Education Partner</h2>
              <p className="text-gray-600 leading-relaxed">
                We are an ISO 9001:2015 certified educational organisation engaged in designing vocational courses for institutes
                countrywide. Our courses are relevant for modern working environments and employer demand.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1a237e]/5 to-blue-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-lg font-bold text-[#1a237e] mb-4 flex items-center gap-2">
                <ChevronRight size={20} /> Franchisee Process
              </h3>
              <ol className="space-y-4">
                {[
                  'Fill and submit the franchise application form below.',
                  'Our team reviews your application within 48 hours.',
                  'A representative explains operational & legal aspects.',
                  'Complete documentation and verification process.',
                  'Receive authorisation to promote NIICT courses.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-6 h-6 rounded-full bg-[#1a237e] text-white flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <span className="inline-block bg-blue-50 text-[#1a237e] text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Application Form</span>
              <h2 className="text-2xl font-bold text-gray-900">NIICT - ATC Registration</h2>
              <p className="text-gray-500 mt-1 text-sm">Complete all steps to apply for an NIICT Authorised Training Centre.</p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center mb-8 overflow-x-auto pb-2">
              {steps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                      i < currentStep ? 'bg-[#1a237e] border-[#1a237e] text-white' :
                      i === currentStep ? 'bg-white border-[#1a237e] text-[#1a237e]' :
                      'bg-white border-gray-200 text-gray-400'}`}>
                      {i < currentStep ? <CheckCircle size={16} /> : i + 1}
                    </div>
                    <span className={`text-xs mt-1.5 font-medium hidden sm:block ${i === currentStep ? 'text-[#1a237e]' : i < currentStep ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-all ${i < currentStep ? 'bg-[#1a237e]' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <motion.form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <AnimatePresence mode="wait">
                {/* Step 0: Institute Details */}
                {currentStep === 0 && (
                  <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center"><Building2 size={20} className="text-[#1a237e]" /></div>
                      <div><h3 className="font-semibold text-gray-900">Institute Details</h3><p className="text-xs text-gray-500">Basic information about your institute</p></div>
                    </div>
                    <div className="space-y-5">
                      <InputField label="Institute Name" error={errors.instituteName} required>
                        <input type="text" name="instituteName" value={formData.instituteName} onChange={handleChange} className={inputClass(errors.instituteName)} placeholder="e.g. ABC Computer Institute" />
                      </InputField>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField label="Owner Name" error={errors.ownerName} required>
                          <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className={inputClass(errors.ownerName)} placeholder="Full name of owner" />
                        </InputField>
                        <InputField label="Date of Birth" error={errors.dob}>
                          <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={inputClass(false)} />
                        </InputField>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField label="PAN Number" error={errors.pan}>
                          <input type="text" name="pan" value={formData.pan} onChange={handleChange} className={inputClass(false)} placeholder="ABCDE1234F" />
                        </InputField>
                        <InputField label="GST Number (Optional)" error={errors.gst}>
                          <input type="text" name="gst" value={formData.gst} onChange={handleChange} className={inputClass(false)} placeholder="22AAAAA0000A1Z5" />
                        </InputField>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 1: Contact Info */}
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center"><Phone size={20} className="text-purple-700" /></div>
                      <div><h3 className="font-semibold text-gray-900">Contact Information</h3><p className="text-xs text-gray-500">How we can reach you</p></div>
                    </div>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField label="Primary Contact" error={errors.contact1} required>
                          <input type="tel" name="contact1" value={formData.contact1} onChange={handleChange} className={inputClass(errors.contact1)} placeholder="10-digit mobile number" />
                        </InputField>
                        <InputField label="Secondary Contact" error={errors.contact2}>
                          <input type="tel" name="contact2" value={formData.contact2} onChange={handleChange} className={inputClass(false)} placeholder="Alternate number" />
                        </InputField>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <InputField label="WhatsApp Number" error={errors.whatsapp}>
                          <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={inputClass(false)} placeholder="WhatsApp number" />
                        </InputField>
                        <InputField label="Email Address" error={errors.email} required>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass(errors.email)} placeholder="you@example.com" />
                        </InputField>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Address */}
                {currentStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center"><MapPin size={20} className="text-green-700" /></div>
                      <div><h3 className="font-semibold text-gray-900">Address Details</h3><p className="text-xs text-gray-500">Owner and institute locations</p></div>
                    </div>
                    <div className="space-y-5">
                      <InputField label="Owner Address" error={errors.ownerAddress}>
                        <textarea name="ownerAddress" value={formData.ownerAddress} onChange={handleChange} rows="2" className={inputClass(false)} placeholder="Owner's residential address" />
                      </InputField>
                      <InputField label="Institute Address" error={errors.instituteAddress} required>
                        <textarea name="instituteAddress" value={formData.instituteAddress} onChange={handleChange} rows="2" className={inputClass(errors.instituteAddress)} placeholder="Full institute address" />
                      </InputField>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <InputField label="Pin Code" error={errors.pinCode} required>
                          <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className={inputClass(errors.pinCode)} placeholder="123456" />
                        </InputField>
                        <InputField label="District" error={errors.district} required>
                          <input type="text" name="district" value={formData.district} onChange={handleChange} className={inputClass(errors.district)} placeholder="District" />
                        </InputField>
                        <InputField label="State" error={errors.state} required>
                          <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass(errors.state)} placeholder="State" />
                        </InputField>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Credentials */}
                {currentStep === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center"><Lock size={20} className="text-orange-700" /></div>
                      <div><h3 className="font-semibold text-gray-900">Login Credentials</h3><p className="text-xs text-gray-500">Set a password for your portal</p></div>
                    </div>
                    <div className="max-w-sm">
                      <InputField label="Create Password" error={errors.password} required>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass(errors.password)} placeholder="Minimum 6 characters" />
                      </InputField>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Your email address will be used as your login username.</p>
                  </motion.div>
                )}

                {/* Step 4: Terms */}
                {currentStep === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center"><CheckCircle size={20} className="text-teal-700" /></div>
                      <div><h3 className="font-semibold text-gray-900">Terms & Conditions</h3><p className="text-xs text-gray-500">Please read and agree before submitting</p></div>
                    </div>
                    <div className="space-y-4">
                      <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.agree1 ? 'border-[#1a237e] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="checkbox" name="agree1" checked={formData.agree1} onChange={handleChange} className="mt-0.5 accent-[#1a237e] w-4 h-4 flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed">I agree to the Terms and Conditions for NIICT ATC, and request consideration of my application to become an Authorised Training Centre for NIICT.</span>
                      </label>
                      {errors.agree1 && <p className="text-red-500 text-xs flex items-center gap-1 -mt-2 pl-1"><AlertCircle size={12} />{errors.agree1}</p>}
                      <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.agree2 ? 'border-[#1a237e] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="checkbox" name="agree2" checked={formData.agree2} onChange={handleChange} className="mt-0.5 accent-[#1a237e] w-4 h-4 flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed">I agree to receive Call / SMS / Email / Postal Communication from NIICT or any concerned authority regarding my application.</span>
                      </label>
                      {errors.agree2 && <p className="text-red-500 text-xs flex items-center gap-1 -mt-2 pl-1"><AlertCircle size={12} />{errors.agree2}</p>}
                    </div>
                    {errors.submit && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                        <AlertCircle size={16} />{errors.submit}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <button type="button" onClick={prevStep} disabled={currentStep === 0}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  ← Previous
                </button>
                <span className="text-xs text-gray-400">Step {currentStep + 1} of {steps.length}</span>
                {currentStep < steps.length - 1 ? (
                  <button type="button" onClick={nextStep}
                    className="px-6 py-2.5 text-sm font-semibold bg-[#1a237e] text-white rounded-lg hover:bg-[#0d1b5e] transition-all flex items-center gap-2">
                    Next <ArrowRight size={16} />
                  </button>
                ) : (
                  <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="px-8 py-2.5 text-sm font-semibold bg-[#1a237e] text-white rounded-lg hover:bg-[#0d1b5e] transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                    {isSubmitting ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</> : <>Submit Application <CheckCircle size={16} /></>}
                  </motion.button>
                )}
              </div>
            </motion.form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link to="/franchise" className="flex items-center justify-between w-full bg-[#1a237e] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#0d1b5e] transition-colors">
                  New Registration <ArrowRight size={16} />
                </Link>
                <Link to="/franchise-login" className="flex items-center justify-between w-full border-2 border-[#1a237e] text-[#1a237e] px-5 py-3 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors">
                  Center Login <ArrowRight size={16} />
                </Link>
              </div>
              <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Need Help?</p>
                <a href="tel:+91XXXXXXXXXX" className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#1a237e] transition-colors">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0"><Phone size={14} className="text-[#1a237e]" /></div>
                  Call Us
                </a>
                <a href="mailto:info@niict.in" className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#1a237e] transition-colors">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0"><Mail size={14} className="text-[#1a237e]" /></div>
                  Email Us
                </a>
              </div>
            </div>

            {/* Stats card */}
            <div className="bg-gradient-to-br from-[#1a237e] to-[#1565c0] rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-4">Our Network</h3>
              <div className="space-y-4">
                {[
                  { value: '50+', label: 'Active Centers' },
                  { value: '350+', label: 'Courses Offered' },
                  { value: '10K+', label: 'Students Enrolled' },
                  { value: '48hr', label: 'Response Time' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-blue-200 text-sm">{s.label}</span>
                    <span className="font-bold text-lg">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Franchise;
