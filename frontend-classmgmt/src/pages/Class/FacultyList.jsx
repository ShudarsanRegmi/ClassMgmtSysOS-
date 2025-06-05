import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { FaUserCircle, FaEnvelope, FaPhone, FaChalkboardTeacher } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const FacultyList = ({ classId }) => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentSemester } = useAuth();


  useEffect(() => {
    const fetchFaculties = async () => {
      if (!classId || !currentSemester) return;

      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/class/${classId}/faculties/${currentSemester.id}`);
        setFaculties(response.data.faculties);
      } catch (error) {
        console.error('Error fetching faculties:', error);
        setError('Failed to load faculty members');
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, [classId, currentSemester]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const renderFacultyCard = (faculty) => (
    <div key={faculty._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {faculty.photoUrl ? (
            <img
              src={faculty.photoUrl}
              alt={faculty.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '';
                e.target.parentElement.innerHTML = '<div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"><svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></div>';
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FaUserCircle className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">{faculty.name}</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              Faculty
            </span>
          </div>
          
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center text-sm text-gray-600">
              <FaEnvelope className="h-3.5 w-3.5 mr-2 text-gray-400" />
              <span className="truncate">{faculty.email}</span>
            </div>
            {faculty.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <FaPhone className="h-3.5 w-3.5 mr-2 text-gray-400" />
                <span>{faculty.phone}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-gray-600">
              <FaChalkboardTeacher className="h-3.5 w-3.5 mr-2 text-gray-400" />
              <span>{faculty.courses.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-sm mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Faculty Members</h2>
          <p className="text-sm text-gray-500 mt-1">Current semester course instructors</p>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <FaChalkboardTeacher className="h-4 w-4 mr-1.5 text-blue-400" />
          Total Faculty: {faculties.length}
        </div>
      </div>
      
      {error ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      ) : faculties.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">No faculty members assigned for the current semester.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {faculties.map(renderFacultyCard)}
        </div>
      )}
    </div>
  );
};

FacultyList.propTypes = {
  classId: PropTypes.string.isRequired
};

export default FacultyList; 