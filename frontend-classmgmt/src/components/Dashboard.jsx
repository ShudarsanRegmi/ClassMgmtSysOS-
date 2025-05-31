import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';

const Dashboard = () => {
  const { userProfile, currentSemester } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

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

          {/* Dashboard Content - Outlet for nested routes */}
          <div className="grid grid-cols-1 gap-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;