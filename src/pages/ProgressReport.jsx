import React from 'react';

function ProgressReport() {
  return (
    <div>
      <h2>Progress Report</h2>
      <div className="cards">
        <div className="card">
          <h3>Course Completion</h3>
          <div className="progress-bar">
            <div className="progress" style={{ width: '75%' }}></div>
          </div>
          <p>75% Complete</p>
        </div>
        <div className="card">
          <h3>Assessment Scores</h3>
          <ul>
            <li>React Basics: 90%</li>
            <li>JavaScript Advanced: 85%</li>
            <li>Database Design: 88%</li>
          </ul>
        </div>
        <div className="card">
          <h3>Attendance</h3>
          <div className="progress-bar">
            <div className="progress" style={{ width: '95%' }}></div>
          </div>
          <p>95% Attendance</p>
        </div>
      </div>
    </div>
  );
}

export default ProgressReport;