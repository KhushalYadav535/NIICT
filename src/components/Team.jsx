import React from 'react';
import { Link } from 'react-router-dom';

const team = [
  {
    name: 'Mr. Ramesh Kumar',
    role: 'Founder/Chairman',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Smt. Priya Sharma',
    role: 'Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Mr. Amit Verma',
    role: 'Legal Advisor',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Mr. Sunil Patel',
    role: 'State Co-Ordinator',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
  },
];

const Team = () => {
  return (
    <section id="trainers" className="trainers py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our <span className="text-[#245894]">Management Team</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="overflow-hidden">
                <img src={member.image} className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500" alt={member.name} />
              </div>
              <div className="p-6 text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h4>
                <span className="text-[#245894] text-sm font-medium">{member.role}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/about"
            className="btn-3 inline-flex items-center gap-2 bg-[#245894] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1a3f6a] transition-colors text-sm uppercase tracking-wider"
          >
            <span>View All</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Team;
