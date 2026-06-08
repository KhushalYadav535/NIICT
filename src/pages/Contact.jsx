import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mail, Phone, MapPin, Send, User, MessageSquare, GraduationCap, Building, Users, Award, Clock, ChevronRight, Star } from 'lucide-react';

const Contact = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(''), 3000);
    }, 2000);
  };

  const contactInfo = [
    {
      id: 1,
      icon: <MapPin size={24} />,
      title: 'Visit Our Campus',
      details: [
        'Janghai Station Road',
        'Besides Nagrik Degree College',
        'Janghai Jaunpur (U.P)'
      ]
    },
    {
      id: 2,
      icon: <Phone size={24} />,
      title: 'Call Us',
      details: [
        '+91 8182838680',
        '+91 8182838680',
        'Mon - Sat: 9:00 AM - 6:00 PM'
      ]
    },
    {
      id: 3,
      icon: <Mail size={24} />,
      title: 'Email Us',
      details: [
        'niict01@gmail.com',
        'niict01@gmail.com',
        'niict01@gmail.com'
      ]
    }
  ];

  const departments = [
    {
      id: 1,
      name: 'Admissions',
      email: 'niict01@gmail.com',
      phone: '+91 8182838680',
      description: 'For course inquiries, admissions, and fee details',
      icon: <GraduationCap size={20} />
    },
    {
      id: 2,
      name: 'Academic Support',
      email: 'niict01@gmail.com',
      phone: '+91 8182838680',
      description: 'For study materials, assignments, and academic guidance',
      icon: <Building size={20} />
    },
    {
      id: 3,
      name: 'Technical Support',
      email: 'niict01@gmail.com',
      phone: '+91 8182838680',
      description: 'For technical issues, portal access, and online learning',
      icon: <Users size={20} />
    },
    {
      id: 4,
      name: 'Career Services',
      email: 'niict01@gmail.com',
      phone: '+91 8182838680',
      description: 'For job placements, internships, and career guidance',
      icon: <Award size={20} />
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I enroll in a course at NIICT?',
      answer: 'You can enroll by visiting our admissions office, filling out the online application form, or calling our admissions team. We offer both online and offline enrollment options.'
    },
    {
      id: 2,
      question: 'What courses are available at NIICT?',
      answer: 'We offer a wide range of courses including Full Stack Development, Data Science, UI/UX Design, Mobile Development, Digital Marketing, and Cloud Computing. Check our courses page for detailed information.'
    },
    {
      id: 3,
      question: 'Do you provide placement assistance?',
      answer: 'Yes, we have a dedicated placement cell that works with leading companies to provide job opportunities to our students. We also offer interview preparation and career guidance.'
    },
    {
      id: 4,
      question: 'What are the class timings?',
      answer: 'We offer flexible timing options including morning batches (9 AM - 12 PM), afternoon batches (1 PM - 4 PM), and evening batches (5 PM - 8 PM) on weekdays. Weekend batches are also available.'
    }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-slate-900 overflow-x-hidden">
      
      {/* Hyper Cinematic Parallax Hero */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-100 rounded-full blur-[120px] mix-blend-multiply opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-cyan-100 rounded-full blur-[120px] mix-blend-multiply opacity-60"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 border border-slate-200 backdrop-blur-md mb-8 text-xs font-mono font-bold tracking-widest text-blue-600 uppercase shadow-sm">
              <Star size={14} /> 24/7 Support
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display uppercase tracking-tight text-slate-900 mb-6 drop-shadow-sm leading-[0.85]">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto font-sans leading-relaxed">
              We're here to help you achieve your career goals. Reach out to us for any questions, 
              course information, or support you need.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 relative z-10 -mt-20">
        
        {/* Contact Information Cards */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, idx) => (
              <motion.div 
                key={info.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-[2rem] p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,102,255,0.06)] hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-blue-100">
                  {info.icon}
                </div>
                <h3 className="text-2xl font-display uppercase tracking-wide text-slate-900 mb-6 font-bold">{info.title}</h3>
                <div className="space-y-3">
                  {info.details.map((detail, index) => (
                    <p key={index} className="text-slate-500 font-sans text-[15px]">{detail}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Form & Departments Section */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Form Side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-14 shadow-xl relative overflow-hidden"
            >
              {/* Form Ambient Glow */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl font-display uppercase tracking-tight text-slate-900 mb-4 font-bold">Send Us a Message</h2>
                <p className="text-slate-500 mb-10 font-sans text-lg">
                  Fill out the form below and our dedicated team will get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-[11px] font-mono font-bold tracking-[2px] uppercase text-slate-500 mb-3">
                        <User size={14} className="inline mr-2 text-blue-500" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-sans"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-[11px] font-mono font-bold tracking-[2px] uppercase text-slate-500 mb-3">
                        <Mail size={14} className="inline mr-2 text-blue-500" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-sans"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-[11px] font-mono font-bold tracking-[2px] uppercase text-slate-500 mb-3">
                        <Phone size={14} className="inline mr-2 text-blue-500" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-sans"
                        placeholder="+91 8182838680"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-[11px] font-mono font-bold tracking-[2px] uppercase text-slate-500 mb-3">
                        <MessageSquare size={14} className="inline mr-2 text-blue-500" />
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-sans"
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[11px] font-mono font-bold tracking-[2px] uppercase text-slate-500 mb-3">
                      <MessageSquare size={14} className="inline mr-2 text-blue-500" />
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-sans resize-none"
                      placeholder="Tell us more about your inquiry..."
                      rows="6"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full group inline-flex items-center justify-center font-sans text-[15px] font-bold uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 px-8 py-5 rounded-xl transition-all duration-300 shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:-translate-y-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={18} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 text-green-700 border border-green-200 p-5 rounded-xl flex items-center gap-3 font-semibold shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <span>Thank you for your message! We'll get back to you soon.</span>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>

            {/* Departments Side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-display uppercase tracking-tight text-slate-900 mb-8 font-bold">Our Departments</h2>
              
              <div className="space-y-6">
                {departments.map((dept, idx) => (
                  <motion.div 
                    key={dept.id} 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-slate-200 rounded-3xl p-8 flex items-start gap-6 shadow-[0_5px_15px_rgba(0,0,0,0.02)] hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 flex-shrink-0 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                      {dept.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl uppercase tracking-wide font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{dept.name}</h3>
                      <p className="text-slate-500 text-[15px] mb-4 font-sans leading-relaxed">{dept.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm font-mono font-medium text-slate-600">
                          <Mail size={14} className="text-blue-400" />
                          <span>{dept.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-mono font-medium text-slate-600">
                          <Phone size={14} className="text-blue-400" />
                          <span>{dept.phone}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cinematic FAQ Section */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-slate-900 mb-4 font-bold">Frequently Asked Questions</h2>
            <p className="text-slate-500 font-sans text-lg">Everything you need to know before joining.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, idx) => (
              <motion.div 
                key={faq.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-display text-xl uppercase tracking-wide font-bold text-slate-900 mb-4">{faq.question}</h3>
                <p className="text-slate-500 font-sans leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;