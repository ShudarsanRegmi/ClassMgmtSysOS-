import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../../utils/api';
import { FaUserCircle, FaEnvelope, FaPhone, FaChalkboardTeacher, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const FacultyCard = ({ faculty }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      key={faculty._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="absolute inset-0 flex items-center justify-center">
          {!imageError && faculty.photoUrl ? (
            <img
              src={faculty.photoUrl}
              alt={faculty.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
              <FaUserCircle className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">{faculty.name}</h3>
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <FaEnvelope className="h-5 w-5 mr-3 text-blue-500" />
            <span className="truncate">{faculty.email}</span>
          </div>
          {faculty.phone && (
            <div className="flex items-center text-gray-600">
              <FaPhone className="h-5 w-5 mr-3 text-blue-500" />
              <span>{faculty.phone}</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-start">
              <FaChalkboardTeacher className="h-5 w-5 mr-3 text-blue-500 mt-1" />
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-1">Teaching</h4>
                <ul className="space-y-1">
                  {faculty.courses.map((course, idx) => (
                    <li key={idx} className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FacultyList = ({ classId }) => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [currentFacultyIndex, setCurrentFacultyIndex] = useState(0);
  const { currentSemester, availableSemesters } = useAuth();

  // Set initial selected semester
  useEffect(() => {
    if (currentSemester && !selectedSemester) {
      setSelectedSemester(currentSemester);
    }
  }, [currentSemester, selectedSemester]);

  // Fetch faculties when semester changes
  useEffect(() => {
    const fetchFaculties = async () => {
      if (!classId || !selectedSemester) return;

      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/class/${classId}/faculties/${selectedSemester.id}`);
        setFaculties(response.data.faculties);
        setCurrentFacultyIndex(0); // Reset carousel index when faculties change
      } catch (error) {
        console.error('Error fetching faculties:', error);
        setError('Failed to load faculty members');
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, [classId, selectedSemester]);

  const nextFaculty = () => {
    setCurrentFacultyIndex((prev) => (prev + 1) % faculties.length);
  };

  const prevFaculty = () => {
    setCurrentFacultyIndex((prev) => (prev - 1 + faculties.length) % faculties.length);
  };

  const renderSemesterSelector = () => (
    <div className="flex items-center justify-center space-x-2 mb-6 overflow-x-auto py-2">
      <FaCalendarAlt className="text-blue-500 h-5 w-5 flex-shrink-0" />
      {Array.isArray(availableSemesters) && availableSemesters.length > 0 ? (
        availableSemesters.map((semester) => (
          <button
            key={semester.id}
            onClick={() => setSelectedSemester(semester)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0
              ${semester.id === selectedSemester?.id
                ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {semester.name}
            <span className="ml-1 text-xs opacity-75">({semester.status})</span>
          </button>
        ))
      ) : (
        <div className="text-gray-500 text-sm">No semesters available</div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Faculty Members</h2>
        <p className="text-gray-500 text-center">View faculty members across different semesters</p>
      </div>

      {renderSemesterSelector()}

      {error ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">{error}</p>
        </div>
      ) : faculties.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <FaChalkboardTeacher className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No faculty members assigned for {selectedSemester?.name || 'this semester'}.</p>
        </div>
      ) : (
        <div className="relative">
          {faculties.length > 1 && (
            <>
              <button
                onClick={prevFaculty}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 bg-white rounded-full p-3 shadow-lg text-gray-600 hover:text-blue-500 transition-colors z-10"
              >
                <FaChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextFaculty}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 bg-white rounded-full p-3 shadow-lg text-gray-600 hover:text-blue-500 transition-colors z-10"
              >
                <FaChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <FacultyCard key={faculties[currentFacultyIndex]._id} faculty={faculties[currentFacultyIndex]} />
            </AnimatePresence>
          </div>
          {faculties.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {faculties.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentFacultyIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    idx === currentFacultyIndex ? 'bg-blue-500 w-4' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

FacultyList.propTypes = {
  classId: PropTypes.string.isRequired
};

export default FacultyList; 