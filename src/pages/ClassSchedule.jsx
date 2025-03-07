import React from 'react';

function ClassSchedule() {
  return (
    <div>
      <h2>Class Schedule</h2>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Subject</th>
              <th>Instructor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>9:00 AM</td>
              <td>React.js</td>
              <td>John Doe</td>
            </tr>
            <tr>
              <td>11:00 AM</td>
              <td>Node.js</td>
              <td>Jane Smith</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClassSchedule;