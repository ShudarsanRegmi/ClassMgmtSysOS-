import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import CreateFaculty from "./pages/Faculties/CreateFaculty";
import CreateCourse from "./pages/Courses/CreateCourse";
import SemesterCourses from "./pages/Courses/SemesterCourses";
import SystemSettingsForm from "./pages/Admin/SystemSettingsForm";
import CourseAssignmentForm from "./pages/Courses/CourseAssignmentForm";
import NoticeBoard from './components/NoticeBoard';
import NoticeForm from './components/NoticeForm';

import "./App.css";

// for making auth token available to cypress
import { auth } from './firebase';
window.firebase = { auth };

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile-form" element={<ProfileForm />} />
            <Route path="/" element={<Home />} />
            <Route path="/logout" element={<Logout />} />
            
            {/* Protected Routes */}
            <Route path='/dashboard' element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
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

            {/* Academic Routes */}
            <Route path="/sem/add" element={
              <PrivateRoute>
                <AddSemester />
              </PrivateRoute>
            } />
            
            <Route path="/faculties/register" element={
              <PrivateRoute>
                <CreateFaculty />
              </PrivateRoute>
            } />
            
            <Route path="/courses/create" element={
              <PrivateRoute>
                <CreateCourse />
              </PrivateRoute>
            } />

            <Route path="/courses/semester" element={
              <PrivateRoute>
                <SemesterCourses />
              </PrivateRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/settings" element={
              <PrivateRoute>
                <SystemSettingsForm />
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
  );
}

export default App;