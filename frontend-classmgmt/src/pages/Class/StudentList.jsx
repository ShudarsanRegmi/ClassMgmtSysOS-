import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
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
      const response = await api.get(`/class/${classId}/students?page=${page}&limit=12`);
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
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderStudentCard = (student) => (
    <div key={student._id} 
         className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 flex items-center p-3 gap-3">
      <div className="flex-shrink-0 w-12 h-12 relative rounded-full overflow-hidden">
        {student.profile?.photoUrl?.url ? (
          <img
            src={student.profile.photoUrl.url}
            alt={student.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '';
              e.target.parentElement.innerHTML = '<div class="h-full w-full bg-gray-100 flex items-center justify-center"><svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div>';
            }}
          />
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <FaUserCircle className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{student.name}</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-1">
            <FaEnvelope className="h-3 w-3" />
            <span className="truncate">{student.email}</span>
          </div>
          {student.phone && (
            <div className="flex items-center gap-1">
              <FaPhone className="h-3 w-3" />
              <span>{student.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <FaGraduationCap className="h-3 w-3" />
            <span>Roll: {student.rollNumber || 'N/A'}</span>
          </div>
        </div>
      </div>
      <button className="flex-shrink-0 text-xs bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition-colors duration-300">
        Details
      </button>
    </div>
  );

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Students</h2>
        <div className="text-sm text-gray-600">
          Total Students: {students.length}
        </div>
      </div>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {students.map(renderStudentCard)}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px text-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-3 py-1 rounded-l-md border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50'
                  } text-sm`}
                >
                  Previous
                </button>
                <span className="relative inline-flex items-center px-3 py-1 border-t border-b bg-white text-sm text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-3 py-1 rounded-r-md border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-blue-50'
                  } text-sm`}
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
