import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-10 items-center">
          {/* Image */}
          <div className="lg:w-5/12 w-full">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600"
                className="w-full h-auto"
                alt="About NIICT"
              />
            </div>
          </div>
          {/* Text */}
          <div className="lg:w-7/12 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
              About <span className="text-[#245894]">NIICT</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4 text-justify">
              <strong>NIICT</strong> (Nihanshi Institute of Information &amp;
              Computer Technology) is a unit of <strong>NIICT DIGITAL EDUCATION INSTITUTE</strong>.
              We are a registered educational organization under the Ministry of Corporate
              Affairs Government of India. We are an ISO 9001:2015 CERTIFIED Educational
              organization, providing Teacher's Training and IT courses all over India,
              with the help &amp; cooperation of educational experts with a view to train
              unemployed educated youth.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6 text-justify">
              Our institute offers a wide range of certificate, diploma, and degree programs
              designed to meet the evolving demands of the technology industry. With
              experienced faculty, modern infrastructure, and a student-centric approach,
              we ensure that every student receives the best possible education and guidance
              for a successful career.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-[#245894] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1a3f6a] transition-colors text-sm uppercase tracking-wider"
            >
              Know More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
