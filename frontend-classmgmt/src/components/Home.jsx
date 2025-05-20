import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Welcome to the Homepage</h2>
      <p className="text-gray-600">Quick access to all routes for development & testing:</p>

      {/* 🔐 Auth Routes */}
      <section>
        <h3 className="text-xl font-semibold text-blue-700">🔐 Auth</h3>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><Link to="/login" className="text-blue-600 hover:underline">Login</Link></li>
          <li><Link to="/register" className="text-blue-600 hover:underline">Register</Link></li>
          <li><Link to="/logout" className="text-blue-600 hover:underline">Logout</Link></li>
          <li><Link to="/profile-form" className="text-blue-600 hover:underline">Profile Form</Link></li>
        </ul>
      </section>

      {/* 🧑‍💼 Dashboard & Profile */}
      <section>
        <h3 className="text-xl font-semibold text-green-700">🧑‍💼 User Dashboard</h3>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link></li>
          <li><Link to="/profile" className="text-blue-600 hover:underline">Profile</Link></li>
        </ul>
      </section>

      {/* 🧑‍🏫 Faculty Management */}
      <section>
        <h3 className="text-xl font-semibold text-purple-700">🧑‍🏫 Faculties</h3>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><Link to="/faculties/register" className="text-blue-600 hover:underline">Register Faculty</Link></li>
        </ul>
      </section>

      {/* 📚 Course Management */}
      <section>
        <h3 className="text-xl font-semibold text-indigo-700">📚 Courses</h3>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><Link to="/courses/create" className="text-blue-600 hover:underline">Create Course</Link></li>
        </ul>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><Link to="/courses/assignment" className="text-blue-600 hover:underline">Course Assignment</Link></li>
        </ul>
      </section>

      {/* 🗓️ Semester Management */}
      <section>
        <h3 className="text-xl font-semibold text-yellow-700">🗓️ Semesters</h3>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><Link to="/sem/add" className="text-blue-600 hover:underline">Add Semester</Link></li>
        </ul>
      </section>

      {/* 🏫 Class Management */}
      <section>
        <h3 className="text-xl font-semibold text-red-700">🏫 Class Management</h3>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><Link to="/class/add" className="text-blue-600 hover:underline">Add Class</Link></li>
        </ul>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><Link to="/class/home" className="text-blue-600 hover:underline">Go to Class Homepage</Link></li>
        </ul>
      </section>

      {/* 🧑‍🎓 CR Section */}
      <section>
        <h3 className="text-xl font-semibold text-pink-700">🧑‍🎓 Class Representative</h3>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><Link to="/cr/dashboard" className="text-blue-600 hover:underline">CR Dashboard</Link></li>
        </ul>
      </section>

      {/* 📁 File Management */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700">📁 Files</h3>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li><Link to="/fileupload" className="text-blue-600 hover:underline">File Upload</Link></li>
        </ul>
      </section>

    {/* 🛠️ Admin Routes */}
    <section>
      <h3 className="text-xl font-semibold text-teal-700">🛠️ Admin</h3>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li><Link to="/admin/settings" className="text-blue-600 hover:underline">Admin Settings</Link></li>
      </ul>
    </section>
    </div>

  );
};


export default Home;
