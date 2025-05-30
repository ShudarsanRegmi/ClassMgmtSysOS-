import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap } from 'react-icons/fa';

const SemesterSelector = () => {
  const { currentSemester, availableSemesters, setActiveSemester } = useAuth();

  const handleSemesterChange = (semesterId) => {
    setActiveSemester(semesterId);
  };

  const formatSemesterName = (semester) => {
    // Use semcode instead of code
    if (semester.semcode && semester.semcode !== semester.name) {
      return `${semester.name} (${semester.semcode})`;
    }
    return semester.name;
  };

  if (!availableSemesters.length) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
      <FaGraduationCap className="text-blue-500" />
      <select
        value={currentSemester?._id || currentSemester?.id || ''}
        onChange={(e) => handleSemesterChange(e.target.value)}
        className="text-sm text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer"
      >
        <option value="" disabled>Select Semester</option>
        {availableSemesters.map((semester) => (
          <option 
            key={semester._id || semester.id} 
            value={semester._id || semester.id}
          >
            {formatSemesterName(semester)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SemesterSelector; 