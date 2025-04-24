import React, { useState } from 'react';
import { FiCalendar, FiCheckCircle, FiClock, FiAlertCircle, FiMoreVertical, FiEdit2, FiTrash2, FiShare2, FiDownload } from 'react-icons/fi';

function Assignments() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'React Project Development',
      dueDate: 'March 25, 2024',
      description: 'Build a full-stack React application with user authentication and database integration.',
      status: 'Pending',
      progress: 60,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Database Design Challenge',
      dueDate: 'March 28, 2024',
      description: 'Design and implement a normalized database schema for an e-commerce platform.',
      status: 'In Progress',
      progress: 35,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'API Integration Project',
      dueDate: 'April 2, 2024',
      description: 'Integrate third-party APIs into your React application for enhanced functionality.',
      status: 'Not Started',
      progress: 0,
      priority: 'low'
    }
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const handleDelete = (id) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
    setActiveDropdown(null);
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return assignment.status === 'Pending';
    if (filter === 'in-progress') return assignment.status === 'In Progress';
    if (filter === 'completed') return assignment.status === 'Completed';
    return true;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === 'progress') {
      return b.progress - a.progress;
    }
    return 0;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <FiCheckCircle className="text-green-500" />;
      case 'In Progress':
        return <FiClock className="text-yellow-500" />;
      case 'Pending':
        return <FiAlertCircle className="text-blue-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const classes = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${classes[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <div className="assignments-container">
      <div className="flex justify-between items-center mb-8">
        <h1 className="assignments-title">My Assignments</h1>
        
        <div className="flex gap-4">
          <div className="relative">
            <select 
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Assignments</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="relative">
            <select 
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="progress">Sort by Progress</option>
            </select>
          </div>
        </div>
      </div>

      <div className="assignment-cards">
        {sortedAssignments.length > 0 ? (
          sortedAssignments.map((assignment) => (
            <div className="assignment-card group" key={assignment.id}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{assignment.title}</h3>
                    {getPriorityBadge(assignment.priority)}
                  </div>
                  <p className="text-gray-600 mb-4">{assignment.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="text-blue-500" />
                      <span>Due: {assignment.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(assignment.status)}
                      <span>{assignment.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => toggleDropdown(assignment.id)}
                  >
                    <FiMoreVertical />
                  </button>
                  
                  {activeDropdown === assignment.id && (
                    <div className="dropdown-menu open">
                      <button className="dropdown-item">
                        <FiEdit2 className="item-icon" />
                        Edit
                      </button>
                      <button 
                        className="dropdown-item text-red-500"
                        onClick={() => handleDelete(assignment.id)}
                      >
                        <FiTrash2 className="item-icon" />
                        Delete
                      </button>
                      <button className="dropdown-item">
                        <FiShare2 className="item-icon" />
                        Share
                      </button>
                      <button className="dropdown-item">
                        <FiDownload className="item-icon" />
                        Download
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{assignment.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      assignment.progress < 30 ? 'bg-red-500' :
                      assignment.progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${assignment.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700">No assignments found</h3>
            <p className="text-gray-500 mt-1">Try changing your filters or create a new assignment</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Assignments;