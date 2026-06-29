import React from 'react';
import { Link } from 'react-router-dom';

const coursesData = [
  {
    id: 1,
    title: 'Certificate Courses',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    description: 'These courses have been specially designed to suit the current requirements of the industry. The certificate course is basically for the beginners who desire to make their career in the IT industry.',
    slug: 'certificate',
  },
  {
    id: 2,
    title: 'Diploma Courses',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    description: 'NIICT has designed its diploma courses to meet the requirements of the industry in which Internet, Programming, Advanced Programming, and Accountancy are covered.',
    slug: 'diploma',
  },
  {
    id: 3,
    title: 'Vocational Training Courses',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
    description: 'Vocational courses are an educational discipline that enables individuals to acquire skills that are required for a particular trade.',
    slug: 'vocational',
  },
  {
    id: 4,
    title: 'Beautician Courses',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=600',
    description: 'Beautician Courses are offered by NIICT for aspiring students who wish to build a career in the beauty and wellness industry.',
    slug: 'beautician',
  },
  {
    id: 5,
    title: 'Additional Technical Courses',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
    description: 'The Technical Courses cover advanced topics in programming, networking, cybersecurity, and system administration.',
    slug: 'technical',
  },
  {
    id: 6,
    title: 'University Courses',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600',
    description: 'NIICT always tries to give maximum benefit to our students through our authorized study center. Students can get registered in available university courses.',
    slug: 'university',
  },
];

const Courses = () => {
  return (
    <section id="popular-courses" className="courses py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[#245894] font-medium text-sm uppercase tracking-wider mb-2">Courses</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Our Courses</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coursesData.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="overflow-hidden">
                <img src={course.image} className="w-full h-52 object-cover hover:scale-105 transition-transform duration-500" alt={course.title} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  <Link to={`/courses`} className="hover:text-[#245894] transition-colors">{course.title}</Link>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 text-justify">{course.description}</p>
                <Link
                  to={`/courses`}
                  className="btn-3 inline-flex items-center gap-2 bg-[#245894] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a3f6a] transition-colors uppercase tracking-wider"
                >
                  <span>Know More</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
