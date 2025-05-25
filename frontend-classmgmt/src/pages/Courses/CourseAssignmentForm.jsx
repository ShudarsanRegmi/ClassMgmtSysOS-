import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

const CourseAssignmentForm = () => {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    courseId: '',
    classId: '',
    facultyId: '',
    semester: '',
    year: new Date().getFullYear(),
    assignedBy: ''
  });

  const host = 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          setFormData(prev => ({ ...prev, assignedBy: user.uid }));
        }

        const [coursesRes, classesRes, facultiesRes] = await Promise.all([
          axios.get(`${host}/api/courses/getAllCourses`),
          axios.get(`${host}/api/class/getAllClasses`),
          axios.get(`${host}/api/faculty/getAllFaculties`)
        ]);

        setCourses(coursesRes.data);
        setClasses(classesRes.data);
        setFaculties(facultiesRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      alert('❌ Failed to assign course.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
        <span className="ml-2 text-blue-600 font-medium">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Assign Course</h2>
      <p className="text-sm text-gray-500 mb-6">Assign a course to a faculty and class for the current semester.</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.code} - {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name} {cls.section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
          <select
            name="facultyId"
            value={formData.facultyId}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Faculty</option>
            {faculties.map(fac => (
              <option key={fac._id} value={fac._id}>
                {fac.name} ({fac.email})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <input
              type="text"
              name="semester"
              placeholder="e.g., Fall"
              value={formData.semester}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300 font-medium"
        >
          Assign Course
        </button>
      </form>
    </div>
  );
};

export default CourseAssignmentForm;
