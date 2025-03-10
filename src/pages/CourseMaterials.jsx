import React from 'react';

const CourseMaterials = () => {
  const materials = [
    {
      title: 'React Fundamentals',
      resources: [
        { type: 'pdf', name: 'Introduction to React', size: '2.5 MB' },
        { type: 'video', name: 'Component Lifecycle', duration: '45 mins' },
        { type: 'code', name: 'Practice Examples', files: '12 files' }
      ]
    },
    {
      title: 'Node.js Basics',
      resources: [
        { type: 'pdf', name: 'Node.js Architecture', size: '1.8 MB' },
        { type: 'video', name: 'Express Framework Tutorial', duration: '60 mins' },
        { type: 'code', name: 'Server Examples', files: '8 files' }
      ]
    },
    {
      title: 'Database Design',
      resources: [
        { type: 'pdf', name: 'SQL Fundamentals', size: '3.2 MB' },
        { type: 'video', name: 'MongoDB Basics', duration: '55 mins' },
        { type: 'code', name: 'Query Examples', files: '15 files' }
      ]
    }
  ];

  const getResourceIcon = (type) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'video':
        return '🎥';
      case 'code':
        return '💻';
      default:
        return '📁';
    }
  };

  return (
    <div className="materials-container">
      <div className="materials-grid">
        {materials.map((section, index) => (
          <div key={index} className="material-section">
            <h3 className="section-title">{section.title}</h3>
            <div className="resources-list">
              {section.resources.map((resource, resourceIndex) => (
                <div key={resourceIndex} className="resource-card">
                  <div className="resource-icon">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div className="resource-details">
                    <h4 className="resource-name">{resource.name}</h4>
                    <p className="resource-meta">
                      {resource.size || resource.duration || resource.files}
                    </p>
                  </div>
                  <button className="download-btn">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseMaterials;