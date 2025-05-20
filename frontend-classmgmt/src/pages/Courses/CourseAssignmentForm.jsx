import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth'; // ✅ Firebase Auth

const CourseAssignmentForm = () => {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    classId: '',
    facultyId: '',
    semester: '',
    year: new Date().getFullYear(),
    assignedBy: '' // This will be updated dynamically
  });

  const host = 'http://localhost:3001'; // Replace with your actual host

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setFormData(prev => ({ ...prev, assignedBy: user.uid }));
    }

    // Fetch dropdown data
    axios.get(`${host}/api/courses/getAllCourses`).then(res => setCourses(res.data));
    axios.get(`${host}/api/class/getAllClasses`).then(res => setClasses(res.data));
    axios.get(`${host}/api/faculty/getAllFaculties`).then(res => setFaculties(res.data));
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await axios.post(`${host}/api/assignments/assign`, formData);
      alert('✅ Course assigned successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Error occurred!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md w-full max-w-xl space-y-4">
      <h2 className="text-xl font-bold mb-4">Assign Course</h2>

      <select name="courseId" onChange={handleChange} className="w-full p-2 border rounded" required>
        <option value="">Select Course</option>
        {courses.map(course => (
          <option key={course._id} value={course._id}>
            {course.code} - {course.title}
          </option>
        ))}
      </select>

      <select name="classId" onChange={handleChange} className="w-full p-2 border rounded" required>
        <option value="">Select Class</option>
        {classes.map(cls => (
          <option key={cls._id} value={cls._id}>
            {cls.name} {cls.section}
          </option>
        ))}
      </select>

      <select name="facultyId" onChange={handleChange} className="w-full p-2 border rounded" required>
        <option value="">Select Faculty</option>
        {faculties.map(fac => (
          <option key={fac._id} value={fac._id}>
            {fac.name} ({fac.email})
          </option>
        ))}
      </select>

      <div className="flex space-x-4">
        <input
          type="text"
          name="semester"
          placeholder="e.g. Fall"
          onChange={handleChange}
          className="w-1/2 p-2 border rounded"
          required
        />
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          className="w-1/2 p-2 border rounded"
        />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Assign Course
      </button>
    </form>
  );
};

export default CourseAssignmentForm;
