import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Assignments from './Assignments';
import CourseMaterials from './CourseMaterials';
import ClassSchedule from './ClassSchedule';
import ProgressReport from './ProgressReport';

function StudentPortal() {
  const { section } = useParams();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'materials', label: 'Course Materials', icon: '📚' },
    { id: 'schedule', label: 'Class Schedule', icon: '📅' },
    { id: 'progress', label: 'Progress Report', icon: '📊' },
  ];

  React.useEffect(() => {
    if (!section) {
      navigate('/student-portal/assignments');
    }
  }, [section, navigate]);

  const renderContent = () => {
    switch (section) {
      case 'assignments':
        return <Assignments />;
      case 'materials':
        return <CourseMaterials />;
      case 'schedule':
        return <ClassSchedule />;
      case 'progress':
        return <ProgressReport />;
      default:
        return <div className="welcome-message">Select a section from the menu</div>;
    }
  };

  return (
    <div className="student-portal">
      <div className="portal-container">
        <div className="portal-sidebar">
          <h2 className="portal-title">Student Portal</h2>
          <nav className="portal-nav">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={`/student-portal/${item.id}`}
                className={`portal-nav-item ${section === item.id ? 'active' : ''}`}
              >
                <span className="portal-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="portal-content">
          <div className="portal-header">
            <h1 className="portal-page-title">
              {menuItems.find(item => item.id === section)?.label || 'Welcome'}
            </h1>
          </div>
          <div className="portal-main">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentPortal;