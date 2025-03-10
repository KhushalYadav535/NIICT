import React from 'react';

function Assignments() {
  const assignments = [
    {
      title: 'React Project Development',
      dueDate: 'March 25, 2024',
      description: 'Build a full-stack React application with user authentication and database integration.',
      status: 'Pending',
      progress: 60
    },
    {
      title: 'Database Design Challenge',
      dueDate: 'March 28, 2024',
      description: 'Design and implement a normalized database schema for an e-commerce platform.',
      status: 'In Progress',
      progress: 35
    },
    {
      title: 'API Integration Project',
      dueDate: 'April 2, 2024',
      description: 'Integrate third-party APIs into your React application for enhanced functionality.',
      status: 'Not Started',
      progress: 0
    }
  ];

  return (
    <div className="assignments-container">
      <div className="assignments-grid">
        {assignments.map((assignment, index) => (
          <div className="assignment-card" key={index}>
            <div className="assignment-header">
              <h3>{assignment.title}</h3>
              <span className={`assignment-status ${assignment.status.toLowerCase().replace(' ', '-')}`}>
                {assignment.status}
              </span>
            </div>
            <p className="assignment-description">{assignment.description}</p>
            <div className="assignment-footer">
              <div className="assignment-progress">
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${assignment.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{assignment.progress}% Complete</span>
              </div>
              <div className="assignment-due">
                <span className="due-label">Due:</span>
                <span className="due-date">{assignment.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Assignments;