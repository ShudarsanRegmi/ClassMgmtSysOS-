import React from 'react';
import { Link } from 'react-router-dom';

const isDev = import.meta.env.VITE_APP_ENV === 'development';

const SectionCard = ({ title, description, to }) => (
  <Link
    to={to}
    className="group block bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition duration-300 backdrop-blur-md hover:shadow-xl hover:border-white/20"
  >
    <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 mb-2">
      {title}
    </h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </Link>
);

const DevLinks = () => (
  <div className="min-h-screen w-full bg-gradient-to-br from-black to-gray-900 text-white py-16 px-6">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Developer Playground</h1>
      <p className="text-gray-400 mb-12 max-w-2xl">
        These are dev-only routes to help test and preview various components during build time.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <SectionCard to="/login" title="Login" description="Authenticate and access your dashboard." />
        <SectionCard to="/register" title="Register" description="Sign up as a new user." />
        <SectionCard to="/logout" title="Logout" description="Exit your session securely." />
        <SectionCard to="/profile-form" title="Profile Form" description="Edit your personal profile details." />
        <SectionCard to="/notices" title="Notices" description="See posted announcements." />
        <SectionCard to="/notices/create" title="Create Notice" description="Add a new notice to the board." />
        <SectionCard to="/dashboard" title="Dashboard" description="Overview of your activity and classes." />
        <SectionCard to="/profile" title="User Profile" description="View and manage your profile." />
        <SectionCard to="/courses/create" title="Create Course" description="Add a new course to curriculum." />
        <SectionCard to="/courses/assignment" title="Assign Course" description="Link courses to users/classes." />
        <SectionCard to="/sem/add" title="Add Semester" description="Manage academic term timelines." />
        <SectionCard to="/class/add" title="Add Class" description="Introduce a new class for a semester." />
        <SectionCard to="/class/home" title="Class Homepage" description="CR or student view for classes." />
        <SectionCard to="/cr/dashboard" title="CR Dashboard" description="Class rep management zone." />
        <SectionCard to="/fileupload" title="Upload Files" description="Push course materials or notes." />
        <SectionCard to="/admin/settings" title="Admin Settings" description="Admin-exclusive controls." />
      </div>
    </div>
  </div>
);

const RealHome = () => (
  <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
    {/* Full-page cover image */}
    <img
      src="/cover1.jpg"
      alt="Class Management Cover"
      className="absolute inset-0 w-full h-full object-cover z-0"
      style={{ minHeight: '100vh' }}
    />
    {/* Dark overlay for readability */}
    <div className="absolute inset-0 bg-black/70 z-10" />
    {/* Centered overlay content */}
    <div className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center px-4">
      <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white drop-shadow-lg mb-6">
        Class Management <span className="block text-cyan-400">Reimagined.</span>
      </h1>
      <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow">
        A futuristic way to manage your academic journey. Seamlessly handle classes, semesters, courses, files, and more—all in one intuitive platform.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/login"
          className="px-8 py-3 bg-cyan-500 text-white rounded-lg font-semibold text-lg hover:bg-cyan-600 transition shadow"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-8 py-3 border border-cyan-400 text-cyan-400 rounded-lg font-semibold text-lg hover:bg-cyan-600 hover:text-white transition shadow"
        >
          Register
        </Link>
      </div>
    </div>
  </div>
);

const Home = () => {
  return isDev ? <DevLinks /> : <RealHome />;
};

export default Home;
