import React from 'react';

function ClassSchedule() {
  const schedule = [
    {
      day: 'Monday',
      classes: [
        { time: '9:00 AM - 11:00 AM', subject: 'Frontend Development', instructor: 'Ramesh Sir', room: 'Lab 101' },
        { time: '11:30 AM - 1:30 PM', subject: 'Backend Development', instructor: 'SK Sir', room: 'Lab 102' }
      ]
    },
    {
      day: 'Tuesday',
      classes: [
        { time: '9:00 AM - 11:00 AM', subject: 'Database Management', instructor: 'Sachin Sir', room: 'Lab 101' },
        { time: '2:00 PM - 4:00 PM', subject: 'Web Development', instructor: 'Khushal Sir', room: 'Lab 102' }
      ]
    },
    {
      day: 'Wednesday',
      classes: [
        { time: '10:00 AM - 12:00 PM', subject: 'React & Node.js', instructor: 'Deepak Sir', room: 'Lab 101' },
        { time: '2:00 PM - 4:00 PM', subject: 'Project Development', instructor: 'SK Sir', room: 'Lab 102' }
      ]
    }
  ];

  return (
    <div className="schedule-container">
      {schedule.map((day, index) => (
        <div key={index} className="schedule-day">
          <h3 className="day-title">{day.day}</h3>
          <div className="schedule-grid">
            {day.classes.map((classItem, classIndex) => (
              <div key={classIndex} className="schedule-card">
                <div className="time-badge">{classItem.time}</div>
                <div className="schedule-content">
                  <h4 className="subject-title">{classItem.subject}</h4>
                  <div className="schedule-details">
                    <div className="detail-item">
                      <span className="detail-icon">👨‍🏫</span>
                      <span>{classItem.instructor}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🏛️</span>
                      <span>{classItem.room}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClassSchedule;