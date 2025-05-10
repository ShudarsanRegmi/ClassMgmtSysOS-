import React, { useState } from 'react';
import axios from 'axios';

const AddSemester = () => {
  const [formData, setFormData] = useState({
    name: '',
    semcode: '',
    year: '',
    classId: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3001/api/sem/create', formData);
      setMessage('Semester created successfully!');
      setFormData({ name: '', semcode: '', year: '', classId: '' });
    } catch (err) {
      setMessage('Error creating semester. Check console for details.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Semester</h2>
      
      {message && <p className="mb-4 text-sm text-center">{message}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Semester Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Semester 1"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Semester Code</label>
          <input
            type="text"
            name="semcode"
            placeholder="e.g. SEM1"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.semcode}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Academic Year</label>
          <input
            type="number"
            name="year"
            placeholder="e.g. 1"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Class ID</label>
          <input
            type="text"
            name="classId"
            placeholder="Enter class ObjectId"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.classId}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Create Semester
        </button>
      </form>
    </div>
  );
};

export default AddSemester;
