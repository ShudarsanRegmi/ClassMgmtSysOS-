import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import StudentList from './StudentList';
import CRList from './CRList';
import FacultyList from './FacultyList';
import HonorList from '../../components/HonorList';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClassHomepage = () => {
  const { classId, currentSemester, userProfile } = useAuth();
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const [honors, setHonors] = useState([]);

  useEffect(() => {
    if (!classId) {
      setError('No class ID found. Please complete your profile first.');
      return;
    }

    const fetchClassDetails = async () => {
      try {
        const response = await api.get(`/class/${classId}/details`);
        setPhotoUrl(response.data.photoUrl);
        setError('');
      } catch (error) {
        console.error('Error fetching class details:', error);
        setError('Failed to load class details. Please try again later.');
      }
    };

    fetchClassDetails();
  }, [classId]);

  useEffect(() => {
    if (classId && currentSemester?.id) {
      fetchHonorList();
    }
  }, [classId, currentSemester]);

  const fetchHonorList = async () => {
    try {
      const response = await api.get(`/honors/class/${classId}/semester/${currentSemester.id}`);
      setHonors(response.data.honors);
    } catch (error) {
      console.error('Error fetching honor list:', error);
    }
  };

  const handleUpdateHonor = async (updatedHonor) => {
    try {
      const originalHonor = honors.find(h => h.student._id === updatedHonor.student._id);
      if (!originalHonor) throw new Error('Honor entry not found');

      await api.put(`/honors/${originalHonor._id}`, {
        student: originalHonor.student._id,
        rank: updatedHonor.rank,
        semester: currentSemester.id,
        classId: classId
      });

      fetchHonorList();
    } catch (error) {
      console.error('Error updating honor:', error);
      setError('Failed to update honor list. Please try again.');
    }
  };

  const handleDeleteHonor = async (honor) => {
    try {
      const originalHonor = honors.find(h => h.student._id === honor.student._id);
      if (!originalHonor) throw new Error('Honor entry not found');

      await api.delete(`/honors/${originalHonor._id}`);
      fetchHonorList();
    } catch (error) {
      console.error('Error deleting honor:', error);
      setError('Failed to delete honor entry. Please try again.');
    }
  };

  if (!classId) {
    return (
      <div className="p-4 text-center min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-5 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-xl font-bold mb-2">No Class Found</h2>
          <p className="text-sm mb-4">Please complete your profile with a valid class ID to access your class homepage.</p>
          <button
            onClick={() => navigate('/profile-form')}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 px-4 rounded"
          >
            Go to Profile Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white">
      
      {photoUrl && (
  <div className="relative w-full h-72 md:h-[30rem] mb-4">
    <img
      src={photoUrl}
      alt="Class Cover"
      className="absolute inset-0 w-full h-full object-cover object-center"
    />
    <div className="absolute inset-0 bg-black/40 z-10" />
  </div>
)}

{/* Welcome Section */}
<div className="max-w-5xl mx-auto px-4 -mt-16 md:-mt-24 z-20 relative mb-8">
  <div className="bg-white/5 border border-white/10 backdrop-blur-md shadow-xl rounded-xl p-6 md:p-10 text-white text-center mb-8">
    <h1 className="text-3xl md:text-5xl font-bold mb-2">Welcome to the Class</h1>
    <p className="text-lg md:text-xl text-gray-300 mb-4">
      You're currently viewing the class portal for <br /> <span className="font-semibold text-blue-400">CYS230</span>.
    </p>
  </div>
</div>


      <div className="max-w-6xl mx-auto w-full px-2 md:px-4">
        {error && (
          <div className="bg-red-900/80 border border-red-700 text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <HonorList 
          honors={honors} 
          isCR={userProfile?.role === 'STUDENT'} 
          onUpdate={handleUpdateHonor}
          onDelete={handleDeleteHonor}
        />

        <FacultyList classId={classId} />
        <CRList classId={classId} />
        <StudentList classId={classId} />

        <footer className="mt-12 text-center text-gray-500 text-sm py-6">
          &copy; {new Date().getFullYear()} Class Management System. Built with ❤️ at Amrita.
        </footer>
      </div>
    </div>
  );
};

export default ClassHomepage;
