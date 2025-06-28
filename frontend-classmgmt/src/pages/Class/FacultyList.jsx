import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { FaUserCircle, FaEnvelope, FaPhone, FaChalkboardTeacher, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const FacultyCard = ({ faculty }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 shadow-lg text-white">
      <div className="flex flex-col items-center mb-4">
        {!imageError && faculty.photoUrl ? (
          <img
            src={faculty.photoUrl}
            alt={faculty.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow mb-3 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-3">
            <FaUserCircle className="text-5xl text-gray-400" />
          </div>
        )}
        <h3 className="text-xl font-semibold">{faculty.name}</h3>
      </div>

      <div className="text-sm text-gray-300 space-y-2">
        <div className="flex items-center">
          <FaEnvelope className="mr-2 text-blue-400" />
          <span>{faculty.email}</span>
        </div>
        {faculty.phone && (
          <div className="flex items-center">
            <FaPhone className="mr-2 text-blue-400" />
            <span>{faculty.phone}</span>
          </div>
        )}
        <div className="mt-3">
          <div className="flex items-start">
            <FaChalkboardTeacher className="mt-1 mr-2 text-blue-400" />
            <div>
              <h4 className="font-semibold mb-1 text-gray-200">Courses:</h4>
              <ul className="space-y-1">
                {faculty.courses.map((course, idx) => (
                  <li key={idx} className="bg-[#0F172A] px-3 py-1 rounded text-xs text-gray-300">
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FacultyList = ({ classId }) => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const { currentSemester, availableSemesters } = useAuth();

  useEffect(() => {
    if (currentSemester && !selectedSemester) {
      setSelectedSemester(currentSemester);
    }
  }, [currentSemester, selectedSemester]);

  useEffect(() => {
    const fetchFaculties = async () => {
      if (!classId || !selectedSemester) return;

      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/class/${classId}/faculties/${selectedSemester.id}`);
        setFaculties(response.data.faculties);
      } catch (error) {
        console.error('Error fetching faculties:', error);
        setError('Failed to load faculty members');
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, [classId, selectedSemester]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white text-center">Faculty Members</h2>
        <p className="text-gray-400 text-center">Explore faculty assigned to your class</p>
      </div>

      {/* Semester Selector */}
      <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
        <FaCalendarAlt className="text-blue-400" />
        {availableSemesters?.length > 0 ? (
          availableSemesters.map((semester) => (
            <button
              key={semester.id}
              onClick={() => setSelectedSemester(semester)}
              className={`px-4 py-1 cursor-pointer rounded-full text-sm transition-all duration-200 
                ${semester.id === selectedSemester?.id
                  ? 'bg-blue-500 text-white shadow'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              {semester.name} <span className="text-xs ml-1">({semester.status})</span>
            </button>
          ))
        ) : (
          <div className="text-gray-500 text-sm">No semesters available</div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center text-white">Loading faculties...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : faculties.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <FaChalkboardTeacher className="mx-auto text-5xl mb-4" />
          <p>No faculty members assigned for {selectedSemester?.name}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculties.map((faculty) => (
            <FacultyCard key={faculty._id} faculty={faculty} />
          ))}
        </div>
      )}
    </div>
  );
};

FacultyList.propTypes = {
  classId: PropTypes.string.isRequired
};

export default FacultyList;
