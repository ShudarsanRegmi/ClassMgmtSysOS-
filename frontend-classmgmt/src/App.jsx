import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ProfileForm from "./components/ProfileForm";
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Logout from "./components/Logout";
import Fileupload from "./components/Fileupload";
import {useAuth} from "./context/AuthContext";
import "./App.css";

function App() {
  const {currentUser} = useAuth(); // getting the state via context API
  return (
    <Router>
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-extrabold tracking-wide">
            <Link to="/" className="hover:underline">
              ClassRoom Management
            </Link>
          </h1>
          
          <nav className="hidden md:flex space-x-4">
      {!currentUser ? (
        <>
          <Link
            to="/login"
            className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition duration-300"
          >
            Register
          </Link>
        </>
      ) : (
        <>

        <Link
          to="/profile"
          className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition duration-300"
        >
          Profile
        </Link>
        
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-white text-green-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition duration-300"
          >
            Dashboard
          </Link>
          <Link
            to="/logout"
            className="px-4 py-2 bg-white text-red-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition duration-300"
          >
            Logout
          </Link>
        </>
      )}
    </nav>

          <button
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-form" element={<ProfileForm />} />
          <Route path="/" element={<div>Welcome to the Homepage</div>} />
          <Route path="/logout" element={<Logout />} />
          <Route path='/dashboard' element={<PrivateRoute>
              <Dashboard />
          </PrivateRoute>} />
          <Route path='/profile' element={<PrivateRoute>
              <Profile />
          </PrivateRoute>} />
          <Route path="/fileupload" element={<PrivateRoute>
              <Fileupload />
          </PrivateRoute>} /> 
        </Routes>
      </main>
    </Router>
  );
}

export default App;