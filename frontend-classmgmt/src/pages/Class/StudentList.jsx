import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FaUserCircle, FaEnvelope, FaPhone, FaGraduationCap } from 'react-icons/fa';

const StudentList = ({ classId }) => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStudents = async (page) => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:3001/api/class/${classId}/students?page=${page}&limit=9`);
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchStudents(currentPage);
    }
  }, [classId, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderStudentCard = (student) => (
    <div key={student._id} 
         className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative pb-48">
        {student.profile?.photoUrl?.url ? (
          <img
            src={student.profile.photoUrl.url}
            alt={student.name}
            className="absolute h-full w-full object-cover object-center"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = ''; // Clear the src
              e.target.parentElement.innerHTML = '<div class="absolute inset-0 bg-gray-100 flex items-center justify-center"><svg class="h-24 w-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div>';
            }}
          />
        ) : (
          <div className="absolute h-full w-full bg-gray-100 flex items-center justify-center">
            <FaUserCircle className="h-24 w-24 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{student.name}</h3>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <FaEnvelope className="h-4 w-4 mr-2" />
            <span className="text-sm truncate">{student.email}</span>
          </div>
          {student.phone && (
            <div className="flex items-center text-gray-600">
              <FaPhone className="h-4 w-4 mr-2" />
              <span className="text-sm">{student.phone}</span>
            </div>
          )}
          <div className="flex items-center text-gray-600">
            <FaGraduationCap className="h-4 w-4 mr-2" />
            <span className="text-sm">Roll: {student.rollNumber || 'N/A'}</span>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center">
          <span>View Details</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Students</h2>
        <div className="text-gray-600">
          Total Students: {students.length}
        </div>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map(renderStudentCard)}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50'
                  } text-sm font-medium`}
                >
                  Previous
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border-t border-b bg-white text-sm font-medium text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50'
                  } text-sm font-medium`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

StudentList.propTypes = {
  classId: PropTypes.string.isRequired
};

export default StudentList;
