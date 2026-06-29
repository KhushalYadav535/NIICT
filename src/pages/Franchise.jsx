import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Building2, Globe, TrendingUp, Shield } from 'lucide-react';

const Franchise = () => {
  const benefits = [
    { icon: <Building2 size={32} />, title: 'Brand Recognition', desc: 'Leverage the established NIICT brand name and reputation in the education sector.' },
    { icon: <Users size={32} />, title: 'Training Support', desc: 'Comprehensive training for your staff on curriculum delivery and institute management.' },
    { icon: <Globe size={32} />, title: 'Marketing Support', desc: 'National and regional marketing campaigns to drive student enrollment.' },
    { icon: <TrendingUp size={32} />, title: 'Business Growth', desc: 'Proven business model with high ROI potential in the growing education sector.' },
    { icon: <Shield size={32} />, title: 'ISO Standards', desc: 'Maintain ISO 9001:2015 certified quality standards across all operations.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#1a237e] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Franchise Opportunities</h1>
          <p className="text-blue-200 text-lg max-w-3xl mx-auto">
            Partner with NIICT to spread quality education and build a successful business in your region.
          </p>
        </div>
      </section>

      {/* Why Franchise */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Become a Franchise Partner?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Join the NIICT family and be part of a growing network of educational institutes across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {benefits.map((item, idx) => (
              <div key={idx} className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="text-[#1a237e] mb-4 flex justify-center">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Franchise Requirements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              'Minimum 500 sq. ft. space for the institute',
              'Basic computer systems and infrastructure',
              'Dedicated staff for administration',
              'Investment as per the franchise model',
              'Passion for quality education',
              'Follow NIICT curriculum and guidelines',
            ].map((req, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-500 shrink-0 mt-0.5" />
                <span className="text-gray-700">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1a237e] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interested in Partnering With Us?</h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Fill out the application form and our team will get back to you within 48 hours.
          </p>
          <Link to="/contact" className="inline-flex bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded font-medium transition-colors text-sm uppercase tracking-wider">
            Apply for Franchise
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Franchise;
