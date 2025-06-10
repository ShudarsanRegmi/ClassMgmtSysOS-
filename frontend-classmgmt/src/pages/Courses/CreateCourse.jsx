import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Trash2, ArrowUpDown } from 'lucide-react';


// Form to create a new course
const CreateCourse = () => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    credits: 3,
  });

  const [msg, setMsg] = useState('');
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState({ key: 'title', asc: true });
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/getAllCourses');
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses", err);
      setMsg("Failed to fetch courses");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/courses/create', formData);
      setMsg("Course created successfully");
      setFormData({ title: '', code: '', credits: 3 });
      fetchCourses(); // Refresh list
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Failed to create course");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      setMsg("Course deleted successfully");
      fetchCourses();
    } catch (err) {
      console.error("Delete failed", err);
      setMsg(err.response?.data?.message || "Failed to delete course");
    }
  };

  const handleSort = (key) => {
    setSortBy(prev => ({
      key,
      asc: prev.key === key ? !prev.asc : true
    }));
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase()) ||
    course.code.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const aVal = a[sortBy.key];
    const bVal = b[sortBy.key];
    if (typeof aVal === 'string') {
      return sortBy.asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    } else {
      return sortBy.asc ? aVal - bVal : bVal - aVal;
    }
  });

  const indexOfLast = currentPage * coursesPerPage;
  const indexOfFirst = indexOfLast - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirst, indexOfLast);

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-gray-50 rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Course Management</h1>

      {/* CREATE COURSE FORM */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
        {msg && <p className="mb-4 text-sm text-green-600">{msg}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Course Title" className="p-2 border rounded" required />
          <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="Course Code" className="p-2 border rounded" required />
          <input type="number" name="credits" value={formData.credits} onChange={handleChange} placeholder="Credits" className="p-2 border rounded" />
          <button type="submit" className="md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Create Course
          </button>
        </form>
      </div>

      {/* COURSE LIST */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Courses</h2>
          <input
            type="text"
            placeholder="Search by title or code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="p-2 border rounded w-60"
          />
        </div>

        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 cursor-pointer" onClick={() => handleSort('title')}>
                Title <ArrowUpDown size={14} className="inline ml-1" />
              </th>
              <th className="p-2 cursor-pointer" onClick={() => handleSort('code')}>
                Code <ArrowUpDown size={14} className="inline ml-1" />
              </th>
              <th className="p-2 cursor-pointer" onClick={() => handleSort('credits')}>
                Credits <ArrowUpDown size={14} className="inline ml-1" />
              </th>
              <th className="p-2">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map(course => (
              <tr key={course._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{course.title}</td>
                <td className="p-2">{course.code}</td>
                <td className="p-2">{course.credits}</td>
                <td className="p-2">{new Date(course.createdAt).toLocaleDateString()}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {currentCourses.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No courses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="mt-4 flex justify-center items-center gap-2">
          {Array.from({ length: Math.ceil(filteredCourses.length / coursesPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
