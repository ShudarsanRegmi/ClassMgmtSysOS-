import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSemester = () => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [classId, setClassId] = useState('');
  const [message, setMessage] = useState('');
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('/api/classes');
        const data = Array.isArray(res.data) ? res.data : [];

        setClasses(
          data.length > 0
            ? data
            : [
                { _id: 'sample-class-1', name: 'CSE A - 2023' },
                { _id: 'sample-class-2', name: 'IT B - 2024' }
              ]
        );
      } catch (err) {
        console.error('Error fetching classes:', err);
        setClasses([
          { _id: 'sample-class-1', name: 'CSE A - 2023' },
          { _id: 'sample-class-2', name: 'IT B - 2024' }
        ]);
      }
    };

    fetchClasses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('/api/semesters', {
        name,
        year,
        classId
      });
      setMessage('Semester created successfully!');
      setName('');
      setYear('');
      setClassId('');
    } catch (err) {
      console.error('Error creating semester:', err);
      const errorMsg = err.response?.data?.error || 'Something went wrong';
      setMessage(`Error: ${errorMsg}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Semester</h2>
      {message && (
        <p className="mb-4 text-sm text-blue-600">{message}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Semester Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Semester 1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 2025"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Class:</label>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Create Semester
        </button>
      </form>
    </div>
  );
};

export default AddSemester;