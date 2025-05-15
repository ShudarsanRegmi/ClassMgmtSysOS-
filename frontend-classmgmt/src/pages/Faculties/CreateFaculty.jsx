import React, { useState } from 'react';
import axios from 'axios';

const CreateFaculty = () => {
  const [faculty, setFaculty] = useState({ name: '', email: '' });
  const [msg, setMsg] = useState('');

  const handleChange = (e) => {
    setFaculty((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/api/admin/faculty/register', faculty); // adjust endpoint as per your route
      setMsg('✅ Faculty added successfully!');
      setFaculty({ name: '', email: '' });
    } catch (err) {
      console.error(err);
      setMsg('❌ Failed to add faculty.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 mt-10 shadow-md rounded-md">
      <h2 className="text-xl font-semibold text-center mb-4">Add Faculty</h2>

      {msg && <p className="text-center text-sm mb-3">{msg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={faculty.name}
            onChange={handleChange}
            placeholder="e.g. Dr. Shrestha"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={faculty.email}
            onChange={handleChange}
            placeholder="e.g. dr.shrestha@college.edu"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <button
          data-testid="submit-button"
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          Add Faculty
        </button>
      </form>
    </div>
  );
};

export default CreateFaculty;
