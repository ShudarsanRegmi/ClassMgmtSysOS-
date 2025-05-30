import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SemesterSelector from './SemesterSelector';
import {
  FaBook,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaClipboardList,
  FaCog,
  FaGraduationCap,
  FaUsers,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Dashboard = () => {
  const { userProfile, currentSemester } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    {
      title: 'Academic',
      items: [
        { name: 'Courses', icon: <FaBook />, path: '/courses' },
        { name: 'Schedule', icon: <FaCalendarAlt />, path: '/schedule' },
        { name: 'Assignments', icon: <FaClipboardList />, path: '/assignments' }
      ]
    },
    {
      title: 'Class',
      items: [
        { name: 'Students', icon: <FaUsers />, path: '/students' },
        { name: 'Faculty', icon: <FaChalkboardTeacher />, path: '/faculty' },
        { name: 'Results', icon: <FaGraduationCap />, path: '/results' }
      ]
    },
    {
      title: 'Settings',
      items: [
        { name: 'Preferences', icon: <FaCog />, path: '/settings' }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-[64px] bottom-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:top-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <FaTimes className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {/* Semester Selector */}
            <div className="mt-4">
              <SemesterSelector />
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {menuItems.map((section, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        to={item.path}
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm p-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <FaBars className="h-5 w-5 text-gray-500" />
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back, {userProfile?.name}!
            </h1>
            <p className="text-gray-600">
              {currentSemester ? (
                <>Currently viewing {currentSemester.name}</>
              ) : (
                <>Please select a semester to get started</>
              )}
            </p>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Add your dashboard cards/widgets here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;