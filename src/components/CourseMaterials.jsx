import React, { useState } from 'react';

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
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <div className="materials-container">
      <h2 className="section-title">Course Materials</h2>
      <div className="materials-grid">
        {courses.map((course, index) => (
          <div key={index} className="material-section" onClick={() => setSelectedCourse(course)}>
            <h3>{course.name}</h3>
            <p>{course.notes}</p>
          </div>
        ))}
      </div>
      {selectedCourse && (
        <div className="content-modal" onClick={() => setSelectedCourse(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedCourse(null)}>×</button>
            <h2>{selectedCourse.name} Notes</h2>
            <p>{selectedCourse.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseMaterials;
