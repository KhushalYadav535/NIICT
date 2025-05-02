import React from 'react';

const courses = [
  { name: 'CCC', notes: 'Notes for CCC course...' },
  { name: 'ADCA', notes: 'Notes for ADCA course...' },
  { name: 'Data Analyst', notes: 'Notes for Data Analyst course...' },
  { name: 'Web Development', notes: 'Notes for Web Development course...' },
  { name: 'O Level', notes: 'Notes for O Level course...' },
  { name: 'DIT', notes: 'Notes for DIT course...' },
  { name: 'Tally', notes: 'Notes for Tally course...' },
  { name: 'Excel', notes: 'Notes for Excel course...' },
  { name: 'Coral C', notes: 'Notes for Coral C course...' },
  { name: 'React', notes: 'Notes for React course...' },
  { name: 'NodeJS', notes: 'Notes for NodeJS course...' },
  { name: 'Express', notes: 'Notes for Express course...' },
  { name: 'SSSSODB', notes: 'Notes for SSSSODB course...' },
];

const CourseMaterials = () => {
  return (
    <div className="course-materials-container" style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
      <h2 style={{ color: '#2563eb', marginBottom: '1.5rem' }}>Course Materials</h2>
      {courses.map((course, index) => (
        <div key={index} style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
          <h3 style={{ color: '#1e40af', marginBottom: '0.5rem' }}>{course.name}</h3>
          <p style={{ color: '#4b5563' }}>{course.notes}</p>
        </div>
      ))}
    </div>
  );
};

export default CourseMaterials;
