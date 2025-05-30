import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap } from 'react-icons/fa';

const SemesterSelector = () => {
  const { currentSemester, availableSemesters, updateCurrentSemester } = useAuth();

  const handleSemesterChange = async (semesterId) => {
    try {
      await updateCurrentSemester(semesterId);
    } catch (error) {
      console.error('Failed to update semester:', error);
    }
  };

  if (!availableSemesters.length) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
      <FaGraduationCap className="text-blue-500" />
      <select
        value={currentSemester?._id || ''}
        onChange={(e) => handleSemesterChange(e.target.value)}
        className="text-sm text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer"
      >
        {availableSemesters.map((semester) => (
          <option key={semester._id} value={semester._id}>
            {semester.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SemesterSelector; 