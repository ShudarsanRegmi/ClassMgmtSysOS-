import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';


// Form for Assinging course to a faculty to a class for a particular semester
const CourseAssignmentForm = () => {
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const { availableSemesters, currentSemester, userId } = useAuth();

  const [formData, setFormData] = useState({
    courseId: '',
    classId: '',
    facultyId: '',
    semester: '',
    year: new Date().getFullYear(),
    assignedBy: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using api interceptor which automatically adds auth token
        const [coursesRes, classesRes, facultiesRes] = await Promise.all([
          api.get('/courses/getAllCourses'),
          api.get('/class/getAllClasses'),
          api.get('/faculty/getAllFaculties')
        ]);

        setCourses(coursesRes.data);
        setClasses(classesRes.data);
        setFaculties(facultiesRes.data);

        // Set initial semester and assignedBy from auth context
        setFormData(prev => ({ 
          ...prev, 
          semester: currentSemester?.id || '',
          year: calculateYearFromSemester(currentSemester?.code),
          assignedBy: userId
        }));
      } catch (err) {
        console.error("Error fetching data", err);
        showNotification('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentSemester, userId]);

  const calculateYearFromSemester = (semesterCode) => {
    if (!semesterCode) return new Date().getFullYear();
    
    // Extract semester number from code (e.g., "SEM6" -> 6)
    const semNumber = parseInt(semesterCode.replace(/\D/g, ''));
    if (!semNumber) return new Date().getFullYear();
    
    // Calculate year (semester 1-2: year 1, 3-4: year 2, 5-6: year 3, 7-8: year 4)
    return Math.ceil(semNumber / 2);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    
    // If semester is changed, update the year accordingly
    if (name === 'semester') {
      const selectedSemester = availableSemesters.find(sem => sem.id === value);
      if (selectedSemester) {
        const academicYear = calculateYearFromSemester(selectedSemester.code);
        setFormData(prev => ({
          ...prev,
          [name]: value,
          year: academicYear
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/assignments/assign', {
        ...formData,
        assignedBy: userId
      });
      showNotification('Course assigned successfully!');
      // Reset form
      setFormData(prev => ({
        ...prev,
        courseId: '',
        classId: '',
        facultyId: '',
        semester: currentSemester?.id || '',
        year: calculateYearFromSemester(currentSemester?.code),
        assignedBy: userId
      }));
    } catch (err) {
      console.error(err);
      showNotification(
        err.response?.data?.message || 'Failed to assign course',
        'error'
      );
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
      {/* Notification */}
      {notification.show && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center ${
            notification.type === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="h-5 w-5 mr-2" />
          ) : (
            <CheckCircle2 className="h-5 w-5 mr-2" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

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
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Semester</option>
              {availableSemesters.map(semester => (
                <option key={semester.id} value={semester.id}>
                  {semester.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
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
