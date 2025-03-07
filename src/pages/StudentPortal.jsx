import React from 'react';
import { useParams } from 'react-router-dom';
import Assignments from './Assignments';
import CourseMaterials from './CourseMaterials';
import ClassSchedule from './ClassSchedule';
import ProgressReport from './ProgressReport';

function StudentPortal() {
  const { section } = useParams();

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
      // default:
      //   return <div>Select a section from the menu</div>;
    }
  };

  return (
    <div className="student-portal">
      <div className="container">{renderContent()}</div>
    </div>
  );
}

export default StudentPortal;