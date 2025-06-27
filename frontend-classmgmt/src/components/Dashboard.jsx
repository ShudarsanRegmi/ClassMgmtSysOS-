import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';
import { useTheme } from '../App';

const Dashboard = () => {
  const { userProfile, currentSemester } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();

  return (
    <div className={`flex h-screen ${theme.bg}`}>
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 ${theme.bg}">
        {/* Mobile Header */}
        <header className={`md:hidden ${theme.header} shadow-sm p-4`}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2 rounded-lg ${theme.button}`}
          >
            <FaBars className="h-5 w-5" />
          </button>
        </header>

        {/* Content Area */}
        <main className={`flex-1 overflow-y-auto p-4 ${theme.bg}`}>
          {/* Welcome Section */}
          <div className={`rounded-lg shadow-sm p-6 mb-6 ${theme.card}`}> 
            <h1 className={`text-2xl font-bold mb-2 ${theme.text}`}>
              Welcome back, {userProfile?.name}!
            </h1>
            <p className={theme.text}>
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