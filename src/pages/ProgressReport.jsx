import React from 'react';

function ProgressReport() {
  const courseProgress = {
    overall: 75,
    modules: [
      { name: 'React Fundamentals', score: 90, status: 'Completed' },
      { name: 'JavaScript Advanced', score: 85, status: 'Completed' },
      { name: 'Database Design', score: 88, status: 'Completed' },
      { name: 'API Development', score: 70, status: 'In Progress' },
      { name: 'Final Project', score: 0, status: 'Not Started' }
    ],
    attendance: 95,
    nextAssessment: 'API Development Final - April 5, 2024'
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="progress-report-container">
      <div className="progress-overview">
        <div className="overall-progress">
          <div className="progress-circle">
            <div className="progress-value">{courseProgress.overall}%</div>
            <div className="progress-label">Overall Progress</div>
          </div>
        </div>
        <div className="attendance-card">
          <h3>Attendance Rate</h3>
          <div className="attendance-progress">
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ 
                  width: `${courseProgress.attendance}%`,
                  backgroundColor: getScoreColor(courseProgress.attendance)
                }}
              ></div>
            </div>
            <div className="attendance-value">{courseProgress.attendance}%</div>
          </div>
        </div>
      </div>

      <div className="modules-progress">
        <h3>Module Progress</h3>
        <div className="modules-grid">
          {courseProgress.modules.map((module, index) => (
            <div key={index} className="module-card">
              <div className="module-header">
                <h4>{module.name}</h4>
                <span className={`status-badge ${module.status.toLowerCase().replace(' ', '-')}`}>
                  {module.status}
                </span>
              </div>
              <div className="module-progress">
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ 
                      width: `${module.score}%`,
                      backgroundColor: getScoreColor(module.score)
                    }}
                  ></div>
                </div>
                <div className="score-value">{module.score}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="upcoming-assessment">
        <h3>Next Assessment</h3>
        <div className="assessment-card">
          <span className="assessment-icon">📝</span>
          <div className="assessment-details">
            <p>{courseProgress.nextAssessment}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressReport;