import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SystemSettingsForm = () => {
  const [academicYear, setAcademicYear] = useState('');
  const [currentSemester, setCurrentSemester] = useState('');
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchSemesters();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/settings/getSettings');
      setAcademicYear(res.data.academicYear);
      setCurrentSemester(res.data.currentSemester?._id || '');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/sem/getAllSemesters'); // Adjust path if needed
      setSemesters(res.data);
      setLoading(false);
      console.log('semster fetched successfully');
      console.log(res.data)
    } catch (err) {
    console.log('could not fetch semesters');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:3001/api/admin/settings/updateSettings', {
        academicYear,
        currentSemester
      });
      alert('Settings updated successfully ');
    } catch (err) {
      console.error(err);
      alert('Error updating settings');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">🛠 System Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Academic Year</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            placeholder="2024-25"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Current Semester</label>
          <select
            className="w-full p-2 border rounded"
            value={currentSemester}
            onChange={(e) => setCurrentSemester(e.target.value)}
          >
            <option value="">-- Select Semester --</option>
            {semesters.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.name} ({sem.semcode})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SystemSettingsForm;
