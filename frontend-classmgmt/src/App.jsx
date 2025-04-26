import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
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
          <Route path="/" element={<div>Welcome to the Homepage</div>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;