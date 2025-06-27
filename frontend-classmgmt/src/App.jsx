import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from "./components/Login";
import Register from "./components/Register";
import ProfileForm from "./components/ProfileForm";
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Logout from "./components/Logout";
import Fileupload from "./components/Fileupload";
import CRDashboard from "./pages/CR/CRDashboard";
import AddClass from './pages/Class/AddClass';
import ClassHomepage from "./pages/Class/ClassHomepage";
import AddSemester from "./pages/Sem/AddSemester";
import CreateCourse from "./pages/Courses/CreateCourse";
import SemesterCourses from "./pages/Courses/SemesterCourses";
import UserSettings from "./components/SystemSettingsForm";
import CourseAssignmentForm from "./pages/Courses/CourseAssignmentForm";
import NoticeBoard from './components/NoticeBoard';
import NoticeForm from './components/NoticeForm';
import StandaloneCourseView from "./pages/Courses/StandaloneCourseView";
import ClassPage from "./pages/Class/ClassPage";
import Schedule from './components/Schedule';
import { ThemeContext, themes } from './theme';

import "./App.css";

// for making auth token available to cypress
import { auth } from './firebase';
window.firebase = { auth };

export const useTheme = () => useContext(ThemeContext);

function App() {
  // Load theme from localStorage or default to 'dark'
  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('themeName');
      if (saved && themes[saved]) return saved;
    }
    return 'dark';
  };
  const [themeName, setThemeName] = useState(getInitialTheme);
  const theme = themes[themeName];

  // Persist theme to localStorage on change
  useEffect(() => {
    localStorage.setItem('themeName', themeName);
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName, themes }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile-form" element={<ProfileForm />} />
                <Route path="/" element={<Home />} />
                <Route path="/logout" element={<Logout />} />
                
                {/* Dashboard and its nested routes */}
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }>
                  <Route index element={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Default dashboard content/widgets */}
                    </div>
                  } />
                  <Route path="courses" element={<SemesterCourses />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="assignments" element={<div>Assignments Component</div>} />
                  <Route path="students" element={<div>Students Component</div>} />
                  <Route path="faculty" element={<div>Faculty Component</div>} />
                  <Route path="results" element={<div>Results Component</div>} />
                  <Route path="settings" element={<div>Settings Component</div>} />
                </Route>

                {/* Standalone Course View */}
                <Route path="/courses/:courseId/semester/:semesterId" element={
                  <PrivateRoute>
                    <StandaloneCourseView />
                  </PrivateRoute>
                } />
                
                {/* Protected Routes */}
                <Route path='/profile' element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                
                <Route path="/fileupload" element={
                  <PrivateRoute>
                    <Fileupload />
                  </PrivateRoute>
                } />
                
                <Route path="/cr/dashboard" element={
                  <PrivateRoute>
                    <CRDashboard />
                  </PrivateRoute>
                } />

                {/* Class Routes */}
                <Route path="/class/add" element={
                  <PrivateRoute>
                    <AddClass />
                  </PrivateRoute>
                } />
                
                <Route path="/class/home" element={
                  <PrivateRoute>
                    <ClassHomepage />
                  </PrivateRoute>
                } />

                <Route path="/class/timeline" element={
                  <PrivateRoute>
                    <ClassPage />
                  </PrivateRoute>
                } />

                {/* Academic Routes */}
                <Route path="/sem/add" element={
                  <PrivateRoute>
                    <AddSemester />
                  </PrivateRoute>
                } />
                
                <Route path="/courses/create" element={
                  <PrivateRoute>
                    <CreateCourse />
                  </PrivateRoute>
                } />

                {/* User Settings Route */}
                <Route path="/settings" element={
                  <PrivateRoute>
                    <UserSettings />
                  </PrivateRoute>
                } />

                <Route path="/courses/assignment" element={
                  <PrivateRoute>
                    <CourseAssignmentForm />
                  </PrivateRoute>
                } />
                
                {/* Notice Board Routes */}
                <Route path="/notices" element={<NoticeBoard />} />
                <Route path="/notices/create" element={
                  <PrivateRoute>
                    <NoticeForm />
                  </PrivateRoute>
                } />
                <Route path="/notices/edit/:id" element={
                  <PrivateRoute>
                    <NoticeForm />
                  </PrivateRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </LocalizationProvider>
    </ThemeContext.Provider>
  );
}

export default App;