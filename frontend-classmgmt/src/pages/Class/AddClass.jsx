import React, { useState } from 'react';
import axios from 'axios';

const AddClass = () => {
  const [formData, setFormData] = useState({
    name: '',
    classId: '',
    year: '',
    department: '',
    section: '',
  });

  const [error, setError] = useState(''); // State to track errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/class/create', formData);
      alert('Class created successfully!');
      setFormData({ name: '', classId: '', year: '', department: '', section: '' });
      setError(''); // Clear error on successful submission
    } catch (error) {
      console.error('Error creating class:', error);
      setError('Failed to create class. Please try again.'); // Set error message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Add New Class</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
      <input
        type="text"
        name="name"
        placeholder="Class Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        name="classId"
        placeholder="Class Id"
        value={formData.classId}
        onChange={handleChange}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="number"
        name="year"
        placeholder="Year"
        value={formData.year}
        onChange={handleChange}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
        className="w-full mb-2 p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        name="section"
        placeholder="Section"
        value={formData.section}
        onChange={handleChange}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Class
      </button>
    </form>
  );
};

export default AddClass;
