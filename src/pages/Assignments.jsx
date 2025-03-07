import React from 'react';

function Assignments() {
  const assignments = [
    {
      title: 'React Project Development',
      dueDate: 'Due: March 25, 2024',
    },
    {
      title: 'Database Design Challenge',
      dueDate: 'Due: March 28, 2024',
    },
  ];

  return (
    <div className="assignments-container" style={{ marginTop: '80px' }}>
      <h2 className="assignments-title">Your Assignments</h2>
      <div className="assignment-cards">
        {assignments.map((assignment, index) => (
          <div className="assignment-card" key={index}>
            <h3>{assignment.title}</h3>
            <p>{assignment.dueDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Assignments;